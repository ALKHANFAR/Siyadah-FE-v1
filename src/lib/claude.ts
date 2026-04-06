import Anthropic from "@anthropic-ai/sdk";
import { type CompanyDNA, getDefaultDNA } from "@/config/company-dna";
import { getSectorProfile } from "@/config/sectors/sector-language";
import { suggestTools } from "@/config/tools/tools-selector";
import { getEnabledTools } from "@/config/tools-catalog";
import {
  getReleasedProducts,
  getComingSoonProducts,
} from "@/config/products-catalog";
import { CLAUDE_TOOLS, executeTool } from "./tools";

// In-memory DNA — resets per serverless cold start.
// Future (SaaS): persist in DB per client.
let currentDNA: CompanyDNA = getDefaultDNA();

export function updateDNA(partial: Partial<CompanyDNA>) {
  currentDNA = {
    ...currentDNA,
    ...partial,
    lastInteraction: new Date().toISOString(),
  };
}

export function getDNA(): CompanyDNA {
  return currentDNA;
}

function buildSystemPrompt(): string {
  const dna = currentDNA;
  const sector = getSectorProfile(dna.sector);
  const tools = getEnabledTools();
  const suggestions = suggestTools(dna.sector);
  const released = getReleasedProducts();
  const coming = getComingSoonProducts();

  const identity = `
أنت سيادة — نظام تشغيل الشركات بالذكاء الاصطناعي.
أنت مستشار أعمال سعودي خبير — مباشر، جريء، تفهم السوق السعودي.
تتكلم باللهجة السعودية المهنية.
اسمك "سيادة" — مو Claude ولا ChatGPT.
`;

  const clientKnowledge = dna.name
    ? `
## العميل الحالي:
- الشركة: ${dna.name}
- القطاع: ${sector.nameAr}
- الحجم: ${dna.size}
${dna.description ? `- الوصف: ${dna.description}` : ""}
- الفجوات: ${dna.gaps.length > 0 ? dna.gaps.join("، ") : "لم تُكتشف بعد"}
- نقاط القوة: ${dna.strengths.length > 0 ? dna.strengths.join("، ") : "لم تُكتشف بعد"}
- حقائق مكتسبة: ${dna.facts.length > 0 ? dna.facts.join("، ") : "لا يوجد بعد"}
- أتمتات مبنية: ${dna.automationsBuilt}
`
    : `
## لا يوجد عميل محدد بعد
اسأل عن اسم الشركة أو رابط الموقع عشان تبدأ.
`;

  const sectorLanguage = `
## لغتك مع هالعميل:
- الألم: "${sector.pain}"
- الحلم: "${sector.dream}"
- استخدم هالكلمات: ${sector.words.join("، ")}
- التحية: "${sector.greeting}"
- مؤشرات الأداء: ${sector.kpis.join("، ")}
`;

  let dosingDetail = "";
  switch (dna.stage) {
    case "day1":
      dosingDetail = `
- اكشف فجوة واحدة فقط + قدّم حل فوري
- لا تكشف كل الفجوات!
- النبرة: "وش ذا السحر!"
- ابنِ أول أتمتة مجانية`;
      break;
    case "day3":
      dosingDetail = `
- أظهر نتائج الحل الأول (أرقام إذا ممكن)
- النبرة: "فعلاً يشتغل!"
- اقترح فجوة ثانية`;
      break;
    case "week1":
      dosingDetail = `
- اكشف فجوة ثانية ببيانات حقيقية
- النبرة: "كيف عرف!"
- ابدأ تقترح أدوات متقدمة`;
      break;
    case "month1":
      dosingDetail = `
- افتح كل الأدوات والمسارات
- النبرة: "ما أقدر أعيش بدونه"
- اقترح باقات متقدمة`;
      break;
  }

  const dosing = `
## نظام الجرعات (مهم جداً):
المرحلة الحالية: ${dna.stage}
${dosingDetail}
`;

  const toolsSection = `
## الأدوات المتاحة: ${tools.length} أداة
## المنتجات المُطلقة: ${released.map((p) => p.nameAr).join("، ")}
## قادم قريباً: ${coming.map((p) => p.nameAr).join("، ")}
## الأتمتات المقترحة لهالقطاع:
${suggestions.map((s, i) => `${i + 1}. ${s.name} (${s.template}) — ${s.reason}`).join("\n")}
`;

  const rules = `
## قواعد ذهبية:
1. لا تقول "600 أداة" — قل "${tools.length} أداة"
2. لا تكذب — إذا ما تعرف قل "خلني أتأكد"
3. لا تقول "النظام معطل" — قل "خلني أشيك"
4. إذا فشل بناء أتمتة → قل "فيه تحديث بسيط — خلني أجهزه لك"
5. دائماً اقترح الخطوة التالية
6. استخدم أداة extract_facts لما تسمع معلومة جديدة عن الشركة
7. استخدم أداة build_automation بالقالب الأنسب للقطاع
`;

  return [identity, clientKnowledge, sectorLanguage, dosing, toolsSection, rules].join(
    "\n"
  );
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function* streamChat(
  messages: ChatMessage[]
): AsyncGenerator<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    yield "عذراً، النظام غير متصل حالياً. حاول لاحقاً.";
    return;
  }

  const client = new Anthropic({ apiKey });
  const systemPrompt = buildSystemPrompt();

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
