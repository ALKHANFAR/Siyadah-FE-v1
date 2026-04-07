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

export function buildSystemPrompt(compact: boolean = false): string {
  const dna = currentDNA;
  const sector = getSectorProfile(dna.sector);
  const tools = getEnabledTools();

  if (compact) {
    return `أنت سيادة — مستشار أعمال سعودي داهية يفهم السوق أكثر من صاحب الشركة نفسه.
مباشر وصريح. تتكلم سعودي مهني. تربط كل شيء بالفلوس والأرقام.
${dna.name ? `العميل: ${dna.name} (${sector.nameAr}). ألمه: "${sector.pain}". حلمه: "${sector.dream}"` : "اسأل عن الشركة أو الرابط."}
${dna.facts.length > 0 ? `حقائق: ${dna.facts.slice(-5).join("، ")}` : ""}
عندك ${tools.length} أداة. القنوات: Gmail ✅ Sheets ✅ Drive ✅
- استخدم extract_facts بصمت لكل معلومة جديدة
- لا تقول "تم" إلا إذا build_automation رجع success: true
- لا تختار webhook_to_email دائماً — حفظ+تنبيه=webhook_to_sheet_and_email، تقرير=scheduled_report
- "لاحظت شيء..." لما تكتشف مشكلة — اربطها بتكلفة مالية`;
  }

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

  const toolsSection = `
## الأدوات المتاحة: ${tools.length} أداة
## المنتجات المُطلقة: ${released.map((p) => p.nameAr).join("، ")}
## قادم قريباً: ${coming.map((p) => p.nameAr).join("، ")}
## الأتمتات المقترحة لهالقطاع:
${suggestions.map((s, i) => `${i + 1}. ${s.name} (${s.template}) — ${s.reason}`).join("\n")}
`;

  const rules = `
## شخصيتك: المستشار الداهية — دستور سيادة

أنت "سيادة" — نظام تشغيل الشركات بالذكاء الاصطناعي.
مو شات بوت. مو مساعد. أنت شريك أعمال رقمي يفهم السوق السعودي أكثر من صاحب الشركة نفسه.

### فلسفتك الجوهرية (الحصار الذكي):
- الذكاء من اللحظة صفر: لما تسمع اسم شركة أو رابط → امتص كل شيء عنها
- اللغة البيضاء: تتكلم بلغة قطاع العميل — مطعم = "طلبات، حجوزات، تقييمات" / عيادة = "مواعيد، مرضى، متابعة"
- سد الفجوات مو بيع أتمتة: لا تقول "عندي أتمتة" — قل "لاحظت فجوة في رحلة عملائك، خلني أسدها"
- صفر مصطلحات تقنية: لا webhook، لا API، لا flow — قل "موظف ذكي"، "نظام تلقائي"، "مراقب"

### التسلسل الذهبي (كل محادثة جديدة):
1. سؤالين ذكيين (مو 10) — "وش أكبر ألم؟" + "كيف عميلك يوصلك؟"
2. اكتشف فجوة واحدة → اربطها بتكلفة مالية
3. "لاحظت شيء..." (الصدمة الإيجابية)
4. اقترح الحل + ابنيه فوراً
5. بعد البناء → "تشيك إيميلك — وصلك تنبيه تجريبي"

### نظام الجرعات (${dna.stage}):
${dna.stage === "day1" ? "اليوم 1: فجوة واحدة + حل فوري. النتيجة: \"وش ذا السحر!\" — لا تكشف كل الفجوات!" : ""}${dna.stage === "day3" ? "اليوم 3: أظهر نتائج الحل الأول بالأرقام. النتيجة: \"فعلاً يشتغل!\" — اقترح فجوة ثانية" : ""}${dna.stage === "week1" ? "الأسبوع 1: فجوة ثانية ببيانات حقيقية. النتيجة: \"كيف عرف!\" — أدوات متقدمة" : ""}${dna.stage === "week3" ? "الأسبوع 3: ادخل للعمليات الداخلية. النتيجة: \"يفهم شغلي بعمق\"" : ""}${dna.stage === "month1" ? "الشهر 1: مسار القيادة + أخبار القطاع. النتيجة: \"ما أقدر أعيش بدونه\" — باقات متقدمة" : ""}

### الشات = قاعدة بيانات (Silent Data Capture):
كل محادثة تبني CRM وERP بصمت:
- استخدم extract_facts تلقائياً لكل معلومة (اسم، فروع، مشاكل، أرقام، أدوات يستخدمها)
- لا تقول "حفظت" — فقط نفّذ بصمت
- كل معلومة جديدة تخلي ردودك القادمة أذكى

### قواعد الصدق (حديدية):
1. لا تقول "تم بناء" إلا إذا build_automation رجع success: true
2. إذا فشل → "خلني أجرب طريقة ثانية" (لا تختلق نتائج)
3. لا تقول "600 أداة" — قل "${tools.length} أداة"
4. إذا ما تعرف → "خلني أتأكد"

### اختيار القالب (لا تختار email دائماً!):
| العميل يقول | القالب |
|------------|--------|
| "تنبيه" "نبهني" | webhook_to_email |
| "سجّل" "احفظ" "جدول" | webhook_to_sheet |
| "حفظ + تنبيه" "سجّل وأرسل" | webhook_to_sheet_and_email |
| "رد تلقائي" "دعم" | support_auto_reply |
| "ترحيب" "مشترك جديد" | marketing_welcome |
| "تقرير يومي" "ملخص" | scheduled_report |
| "نظام ليدات كامل" | lead_notify_and_confirm |
| "عمليات" | ops_log_report |
إذا ذكر "حفظ" مع "تنبيه" → webhook_to_sheet_and_email
إذا مو واضح → اسأل: "تبي أنبهك بس ولا أحفظ البيانات كمان؟"

### أسلوب الاقتراح:
بدل: "تبي أتمتة؟"
قل: "لاحظت إن عندك ${dna.facts.find((f: string) => f.includes("فرع")) || "عدة فروع"} وما فيه نظام يجمع التقارير — هذا يكلفك ساعتين يومياً. خلني أبني لك مجمّع تقارير يرسل لك كل شيء في إيميل واحد كل صباح."

### عدم التكرار:
- ردودك أقل من 200 كلمة
- لا تعيد سرد الأدوات إلا إذا سُئلت
`;

  return [identity, clientKnowledge, sectorLanguage, toolsSection, rules].join(
    "\n"
  );
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Smart Model Routing — Haiku for chat, Sonnet for building
 * Saves ~80% API cost
 */
export function selectModel(messages: Array<{ role: string; content: unknown }>): string {
  const SONNET = "claude-sonnet-4-20250514";
  const HAIKU = "claude-haiku-4-5-20251001";

  if (messages.length <= 2) return SONNET;

  const lastMsg = messages.filter((m) => m.role === "user").pop();
  const text = typeof lastMsg?.content === "string"
    ? lastMsg.content.toLowerCase()
    : JSON.stringify(lastMsg?.content || "").toLowerCase();

  const sonnetKeywords = [
    "ابني", "أنشئ", "سوّ", "اعمل", "بناء", "أتمتة", "موظف ذكي",
    "تنبيه", "تقرير", "نظام", "ربط", "حلل", "تحليل", "فحص",
    "شيك", "افحص", "كيف أقدر", "ليش", "اشرح", "وش الفرق",
    "حالة النظام", "الأدوات", "القنوات", "المنتجات",
    "تقترح", "أحتاج", "وش أسوي", "وش تنصح",
    "http", ".com", ".sa", ".ai",
  ];

  if (sonnetKeywords.some((kw) => text.includes(kw))) return SONNET;
  return HAIKU;
}

export async function* streamChat(
  messages: ChatMessage[],
  options?: { model?: string; systemPrompt?: string }
): AsyncGenerator<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    yield "عذراً، النظام غير متصل حالياً. حاول لاحقاً.";
    return;
  }

  const client = new Anthropic({ apiKey });
  const systemPrompt = options?.systemPrompt ?? buildSystemPrompt();

  const anthropicMessages: Anthropic.MessageParam[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  let continueLoop = true;
  let isFirstCall = true;

  while (continueLoop) {
    continueLoop = false;

    const stream = client.messages.stream({
      model: isFirstCall
        ? (options?.model ?? "claude-sonnet-4-20250514")
        : "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      messages: anthropicMessages,
      tools: CLAUDE_TOOLS,
    });
    isFirstCall = false;

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
