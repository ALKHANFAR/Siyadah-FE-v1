import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/config/prompts/system-prompt";
import { CHAT_PROMPT } from "@/config/prompts/chat-prompt";
import { DOSING_PROMPT } from "@/config/prompts/dosing-prompt";
import { AUTOMATION_PROMPT } from "@/config/prompts/automation-prompt";
import { CONNECTION_PROMPT } from "@/config/prompts/connection-prompt";
import { getSectorPrompt } from "@/config/prompts/sector-prompts";
import { buildAbsorberPrompt } from "@/config/prompts/absorber-prompt";
import {
  getReleasedProducts,
  getComingSoonProducts,
} from "@/config/products-catalog";
import { getToolsSortedByTier } from "@/config/tools-catalog";
import { CLAUDE_TOOLS, executeTool } from "./tools";

interface CompanyContext {
  name: string;
  sector: string;
  country: string;
  strengths: string[];
  painPoints: string[];
  opportunities: string[];
  healthScore: number;
}

function buildSystemPrompt(companyContext?: CompanyContext): string {
  const released = getReleasedProducts();
  const comingSoon = getComingSoonProducts();
  const tools = getToolsSortedByTier();

  const parts = [SYSTEM_PROMPT, CHAT_PROMPT, DOSING_PROMPT];

  if (companyContext) {
    parts.push(buildAbsorberPrompt(companyContext));
    parts.push(getSectorPrompt(companyContext.sector));
  }

  parts.push(AUTOMATION_PROMPT);
  parts.push(CONNECTION_PROMPT);

  const productsSection = `
## المنتجات المتاحة حالياً:
${released.map((p) => `- ${p.nameAr}: ${p.taglineAr}`).join("\n")}

## منتجات قادمة قريباً:
${comingSoon.map((p) => `- ${p.nameAr}: ${p.taglineAr}`).join("\n")}

عند طلب منتج مُطلق: نفّذه فوراً باستخدام أدواتك.
عند طلب منتج قادم: أخبر العميل إنه قيد التطوير وسجّل اهتمامه.
`;
  parts.push(productsSection);

  const toolsSection = `
## الأدوات المتاحة (مرتبة: مجانية أول):
${tools.map((t) => `- ${t.icon} ${t.displayNameAr} (${t.displayNameEn}) — ${t.tier === "free" ? "مجاني" : t.tier === "freemium" ? "محدود مجاناً" : "مدفوع"}`).join("\n")}
`;
  parts.push(toolsSection);

  return parts.join("\n\n---\n\n");
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function* streamChat(
  messages: ChatMessage[],
  companyContext?: CompanyContext
): AsyncGenerator<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    yield "عذراً، النظام غير متصل حالياً. حاول لاحقاً.";
    return;
  }

  const client = new Anthropic({ apiKey });
  const systemPrompt = buildSystemPrompt(companyContext);

  const anthropicMessages: Anthropic.MessageParam[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  let continueLoop = true;

  while (continueLoop) {
    continueLoop = false;

    const stream = client.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      messages: anthropicMessages,
      tools: CLAUDE_TOOLS,
    });

    let currentText = "";
    const toolUses: { id: string; name: string; input: Record<string, unknown> }[] = [];

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        currentText += event.delta.text;
        yield event.delta.text;
      }

      if (
        event.type === "content_block_start" &&
        event.content_block.type === "tool_use"
      ) {
        toolUses.push({
          id: event.content_block.id,
          name: event.content_block.name,
          input: {} as Record<string, unknown>,
        });
      }

      if (
        event.type === "content_block_delta" &&
        event.delta.type === "input_json_delta"
      ) {
        // Accumulate tool input JSON - will be parsed from final message
      }
    }

    const finalMessage = await stream.finalMessage();

    const finalToolUses = finalMessage.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
    );

    if (finalToolUses.length > 0 && finalMessage.stop_reason === "tool_use") {
      anthropicMessages.push({
        role: "assistant",
        content: finalMessage.content,
      });

      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const toolUse of finalToolUses) {
        const result = await executeTool(
          toolUse.name,
          toolUse.input as Record<string, unknown>
        );
        toolResults.push({
          type: "tool_result",
          tool_use_id: toolUse.id,
          content: result,
        });
      }

      anthropicMessages.push({
        role: "user",
        content: toolResults,
      });

      continueLoop = true;
    }
  }
}
