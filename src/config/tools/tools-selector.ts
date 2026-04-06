// ذكاء اختيار الأداة — حسب القطاع والنية

import { SECTORS } from "../sectors/sector-language";

export const TOOL_PRIORITIES: Record<string, Record<string, number>> = {
  restaurant: {
    webhook_to_email: 9,
    webhook_to_sheet: 8,
    webhook_to_sheet_and_email: 10,
    support_auto_reply: 7,
    marketing_welcome: 6,
    scheduled_report: 5,
  },
  clinic: {
    webhook_to_email: 10,
    webhook_to_sheet: 8,
    support_auto_reply: 9,
    scheduled_report: 7,
    lead_notify_and_confirm: 10,
  },
  ecommerce: {
    webhook_to_email: 8,
    webhook_to_sheet_and_email: 10,
    webhook_to_sheet: 9,
    scheduled_report: 8,
    marketing_welcome: 9,
  },
  saas: {
    webhook_to_email: 9,
    marketing_welcome: 10,
    webhook_to_sheet: 8,
    support_auto_reply: 9,
    scheduled_report: 7,
  },
};

export interface ToolSuggestion {
  template: string;
  name: string;
  reason: string;
  priority: number;
}

export function suggestTools(
  sector: string,
  maxResults = 3
): ToolSuggestion[] {
  const priorities = TOOL_PRIORITIES[sector] || {};
  const sectorProfile = SECTORS[sector] || SECTORS.general;

  const suggestions: ToolSuggestion[] = Object.entries(priorities)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxResults)
    .map(([template, priority]) => ({
      template,
      name: getTemplateNameAr(template),
      reason: `مناسب لقطاع ${sectorProfile.nameAr}`,
      priority,
    }));

  if (suggestions.length === 0) {
    return [
      {
        template: "webhook_to_email",
        name: "تنبيهات فورية",
        reason: "أساسي لأي شركة",
        priority: 10,
      },
      {
        template: "webhook_to_sheet_and_email",
        name: "حفظ + تنبيه",
        reason: "يغطي أهم احتياج",
        priority: 9,
      },
      {
        template: "scheduled_report",
        name: "تقرير يومي",
        reason: "متابعة مستمرة",
        priority: 7,
      },
    ];
  }

  return suggestions;
}

function getTemplateNameAr(template: string): string {
  const names: Record<string, string> = {
    webhook_to_email: "تنبيهات فورية",
    webhook_to_sheet: "تسجيل بيانات",
    webhook_to_sheet_and_email: "حفظ + تنبيه",
    support_auto_reply: "رد تلقائي",
    marketing_welcome: "ترحيب ذكي",
    ops_log_report: "تقرير عمليات",
    lead_notify_and_confirm: "نظام ليدات",
    scheduled_report: "تقرير يومي",
  };
  return names[template] || template;
}
