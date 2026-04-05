// ============================================================
// كتالوج أدوات سيادة — صاحب المنتج يعدّله بدون برمجة
// كل أداة = قطعة في Activepieces يستخدمها Orchestrator
// الكود يقرأ من هنا — لا أدوات inline
// ============================================================

export type ToolTier = "free" | "freemium" | "paid";

export type Department =
  | "sales"
  | "marketing"
  | "operations"
  | "support"
  | "finance";

export interface SiyadahTool {
  pieceName: string;
  displayNameAr: string;
  displayNameEn: string;
  descriptionAr: string;
  icon: string;
  departments: Department[];
  tier: ToolTier;
  requiresOAuth: boolean;
  requiresApiKey: boolean;
  priority: number;
  enabled: boolean;
}

// ============================================================
// الأدوات — أضف، عدّل، فعّل، عطّل كيف ما تبي
// ============================================================

export const TOOLS_CATALOG: SiyadahTool[] = [
  // ──────────── مجاني ────────────
  {
    pieceName: "@activepieces/piece-gmail",
    displayNameAr: "البريد الإلكتروني",
    displayNameEn: "Gmail",
    descriptionAr: "إرسال واستقبال الإيميلات تلقائياً",
    icon: "📧",
    departments: ["sales", "marketing", "support", "finance"],
    tier: "free",
    requiresOAuth: true,
    requiresApiKey: false,
    priority: 1,
    enabled: true,
  },
  {
    pieceName: "@activepieces/piece-google-sheets",
    displayNameAr: "جداول البيانات",
    displayNameEn: "Google Sheets",
    descriptionAr: "تسجيل وتنظيم البيانات في جداول",
    icon: "📊",
    departments: ["sales", "operations", "finance"],
    tier: "free",
    requiresOAuth: true,
    requiresApiKey: false,
    priority: 2,
    enabled: true,
  },
  {
    pieceName: "@activepieces/piece-google-drive",
    displayNameAr: "التخزين السحابي",
    displayNameEn: "Google Drive",
    descriptionAr: "حفظ ومشاركة الملفات تلقائياً",
    icon: "📁",
    departments: ["operations"],
    tier: "free",
    requiresOAuth: true,
    requiresApiKey: false,
    priority: 5,
    enabled: true,
  },
  {
    pieceName: "@activepieces/piece-google-calendar",
    displayNameAr: "التقويم",
    displayNameEn: "Google Calendar",
    descriptionAr: "إدارة المواعيد والاجتماعات تلقائياً",
    icon: "📅",
    departments: ["operations"],
    tier: "free",
    requiresOAuth: true,
    requiresApiKey: false,
    priority: 6,
    enabled: true,
  },
  {
    pieceName: "@activepieces/piece-webhook",
    displayNameAr: "نظام الاستقبال",
    displayNameEn: "Webhook",
    descriptionAr: "استقبال البيانات من أي مصدر خارجي",
    icon: "🔗",
    departments: ["sales", "marketing", "operations", "support"],
    tier: "free",
    requiresOAuth: false,
    requiresApiKey: false,
    priority: 3,
    enabled: true,
  },
  {
    pieceName: "@activepieces/piece-telegram-bot",
    displayNameAr: "تليقرام",
    displayNameEn: "Telegram",
    descriptionAr: "إرسال تنبيهات ورسائل عبر تليقرام",
    icon: "✈️",
    departments: ["sales", "support"],
    tier: "free",
    requiresOAuth: false,
    requiresApiKey: true,
    priority: 7,
    enabled: true,
  },
  {
    pieceName: "@activepieces/piece-schedule",
    displayNameAr: "المجدول",
    displayNameEn: "Scheduler",
    descriptionAr: "تشغيل المهام في أوقات محددة تلقائياً",
    icon: "⏰",
    departments: ["operations", "marketing"],
    tier: "free",
    requiresOAuth: false,
    requiresApiKey: false,
    priority: 4,
    enabled: true,
  },
  {
    pieceName: "@activepieces/piece-http",
    displayNameAr: "الربط المفتوح",
    displayNameEn: "HTTP",
    descriptionAr: "ربط أي نظام عنده واجهة برمجية",
    icon: "🌐",
    departments: ["sales", "marketing", "operations", "support", "finance"],
    tier: "free",
    requiresOAuth: false,
    requiresApiKey: false,
    priority: 8,
    enabled: true,
  },
  {
    pieceName: "@activepieces/piece-rss",
    displayNameAr: "متابعة الأخبار",
    displayNameEn: "RSS Feed",
    descriptionAr: "متابعة أخبار المنافسين والقطاع تلقائياً",
    icon: "📰",
    departments: ["marketing"],
    tier: "free",
    requiresOAuth: false,
    requiresApiKey: false,
    priority: 12,
    enabled: true,
  },
  {
    pieceName: "@activepieces/piece-math-helper",
    displayNameAr: "الحسابات",
    displayNameEn: "Math",
    descriptionAr: "حسابات تلقائية للأرقام والتقارير",
    icon: "🔢",
    departments: ["finance"],
    tier: "free",
    requiresOAuth: false,
    requiresApiKey: false,
    priority: 14,
    enabled: true,
  },
  {
    pieceName: "@activepieces/piece-groq",
    displayNameAr: "الذكاء الاصطناعي",
    displayNameEn: "Groq AI",
    descriptionAr: "ردود ذكية تلقائية للعملاء",
    icon: "🤖",
    departments: ["support", "sales"],
    tier: "free",
    requiresOAuth: false,
    requiresApiKey: true,
    priority: 9,
    enabled: true,
  },

  // ──────────── محدود مجاناً ────────────
  {
    pieceName: "@activepieces/piece-mailchimp",
    displayNameAr: "حملات الإيميل",
    displayNameEn: "Mailchimp",
    descriptionAr: "إدارة حملات البريد الإلكتروني",
    icon: "💌",
    departments: ["marketing"],
    tier: "freemium",
    requiresOAuth: true,
    requiresApiKey: false,
    priority: 10,
    enabled: true,
  },
  {
    pieceName: "@activepieces/piece-facebook-pages",
    displayNameAr: "فيسبوك",
    displayNameEn: "Facebook Pages",
    descriptionAr: "إدارة منشورات فيسبوك تلقائياً",
    icon: "📘",
    departments: ["marketing"],
    tier: "free",
    requiresOAuth: true,
    requiresApiKey: false,
    priority: 11,
    enabled: true,
  },

  // ──────────── مدفوع ────────────
  {
    pieceName: "@activepieces/piece-hubspot",
    displayNameAr: "إدارة العملاء",
    displayNameEn: "HubSpot",
    descriptionAr: "نظام إدارة علاقات العملاء المتقدم",
    icon: "🏢",
    departments: ["sales"],
    tier: "paid",
    requiresOAuth: true,
    requiresApiKey: false,
    priority: 13,
    enabled: false,
  },
  {
    pieceName: "@activepieces/piece-stripe",
    displayNameAr: "المدفوعات",
    displayNameEn: "Stripe",
    descriptionAr: "إدارة المدفوعات والفواتير",
    icon: "💳",
    departments: ["finance"],
    tier: "paid",
    requiresOAuth: false,
    requiresApiKey: true,
    priority: 15,
    enabled: false,
  },
  {
    pieceName: "@activepieces/piece-slack",
    displayNameAr: "سلاك",
    displayNameEn: "Slack",
    descriptionAr: "إشعارات وتنبيهات فريق العمل",
    icon: "💬",
    departments: ["operations", "support"],
    tier: "freemium",
    requiresOAuth: true,
    requiresApiKey: false,
    priority: 16,
    enabled: true,
  },
];

// ============================================================
// دوال مساعدة — لا تعدّلها
// ============================================================

/** أدوات قسم معين */
export function getToolsByDepartment(dept: Department): SiyadahTool[] {
  return TOOLS_CATALOG.filter((t) => t.enabled && t.departments.includes(dept));
}

/** مرتبة: مجانية أول */
export function getToolsSortedByTier(): SiyadahTool[] {
  const order: Record<ToolTier, number> = { free: 0, freemium: 1, paid: 2 };
  return [...TOOLS_CATALOG]
    .filter((t) => t.enabled)
    .sort((a, b) => order[a.tier] - order[b.tier] || a.priority - b.priority);
}

/** بحث بالاسم */
export function searchTools(query: string): SiyadahTool[] {
  const q = query.toLowerCase();
  return TOOLS_CATALOG.filter(
    (t) =>
      t.enabled &&
      (t.displayNameAr.includes(q) ||
        t.displayNameEn.toLowerCase().includes(q) ||
        t.descriptionAr.includes(q))
  );
}

/** أدوات تحتاج ربط OAuth */
export function getToolsRequiringOAuth(): SiyadahTool[] {
  return TOOLS_CATALOG.filter((t) => t.enabled && t.requiresOAuth);
}

/** أدوات مفعّلة فقط */
export function getEnabledTools(): SiyadahTool[] {
  return TOOLS_CATALOG.filter((t) => t.enabled);
}
