// ============================================================
// كتالوج منتجات سيادة — أنت تتحكم بإطلاقها
// المنتجات = تجارب مُغلّفة جاهزة للعميل
// الأدوات = لبنات بناء مخفية (Gmail, Sheets, HTTP)
// ============================================================

export type ProductStatus = "coming_soon" | "released" | "beta" | "retired";

export interface SiyadahProduct {
  id: string;
  nameAr: string;
  nameEn: string;
  taglineAr: string;
  descriptionAr: string;
  icon: string;
  status: ProductStatus;
  releaseDate: string | null;
  visibleInChat: boolean;
  visibleInDashboard: boolean;
  requiredPlan: "free" | "basic" | "growth" | "pro" | "enterprise";
  targetSectors: string[];
  requiredPieces: string[];
  requiredConnections: string[];
  chatAnnouncement: string;
  chatActivation: string;
  claudePrompt: string;
}

// ============================================================
// المنتجات — أضف، عدّل، أطلق، سحب كيف ما تبي
// ============================================================

export const PRODUCTS_CATALOG: SiyadahProduct[] = [
  // ──────────── مُطلق ────────────
  {
    id: "smart-email-alerts",
    nameAr: "التنبيهات الذكية",
    nameEn: "Smart Email Alerts",
    taglineAr: "كل ليد جديد يوصلك على إيميلك فوراً",
    descriptionAr:
      "نظام تنبيهات ذكي يرسل لك إيميل فوري لكل ليد جديد، مع تفاصيل العميل وتصنيف تلقائي حسب الأولوية.",
    icon: "📧",
    status: "released",
    releaseDate: "2026-04-10",
    visibleInChat: true,
    visibleInDashboard: true,
    requiredPlan: "basic",
    targetSectors: [],
    requiredPieces: [
      "@activepieces/piece-gmail",
      "@activepieces/piece-webhook",
    ],
    requiredConnections: ["gmail"],
    chatAnnouncement:
      "أطلقنا التنبيهات الذكية! الآن كل ليد جديد يوصلك فوراً على إيميلك مع تصنيف تلقائي. تبي أفعّلها لك؟",
    chatActivation:
      "تم تفعيل التنبيهات الذكية ✅ من الآن كل ليد جديد بيوصلك إيميل فوري.",
    claudePrompt:
      "العميل يبي التنبيهات الذكية. ابنِ فلو: Webhook → Gmail notification مع تصنيف الليد.",
  },
  {
    id: "lead-tracker",
    nameAr: "متتبع العملاء",
    nameEn: "Lead Tracker",
    taglineAr: "كل عميل محتمل يتسجّل تلقائياً في جدول منظم",
    descriptionAr:
      "يسجّل كل ليد جديد في Google Sheet منظم مع التاريخ والمصدر والحالة. تقدر تتابع كل عملائك من مكان واحد.",
    icon: "📊",
    status: "released",
    releaseDate: "2026-04-10",
    visibleInChat: true,
    visibleInDashboard: true,
    requiredPlan: "basic",
    targetSectors: [],
    requiredPieces: [
      "@activepieces/piece-google-sheets",
      "@activepieces/piece-webhook",
    ],
    requiredConnections: ["sheets"],
    chatAnnouncement:
      "أطلقنا متتبع العملاء! كل ليد يتسجّل تلقائياً في جدول منظم. تبي أفعّله؟",
    chatActivation:
      "تم تفعيل متتبع العملاء ✅ كل ليد جديد بيتسجّل تلقائياً.",
    claudePrompt:
      "ابنِ فلو: Webhook → Google Sheets (insert row) مع حقول: الاسم، الإيميل، الجوال، المصدر، التاريخ.",
  },

  // ──────────── قادم قريباً ────────────
  {
    id: "competitor-radar",
    nameAr: "رادار المنافسين",
    nameEn: "Competitor Radar",
    taglineAr: "راقب منافسيك تلقائياً واحصل على تنبيهات",
    descriptionAr:
      "يراقب مواقع منافسيك وتقييماتهم على خرائط قوقل. يرسل لك تنبيه فوري إذا غيّروا أسعارهم أو فتحوا فرع جديد.",
    icon: "🔍",
    status: "coming_soon",
    releaseDate: null,
    visibleInChat: true,
    visibleInDashboard: false,
    requiredPlan: "growth",
    targetSectors: ["restaurant", "clinic", "ecommerce"],
    requiredPieces: [
      "@activepieces/piece-http",
      "@activepieces/piece-schedule",
      "@activepieces/piece-gmail",
    ],
    requiredConnections: ["gmail"],
    chatAnnouncement:
      "قريباً: رادار المنافسين! بنراقب منافسيك تلقائياً ونخبرك بكل تحرك.",
    chatActivation:
      "رادار المنافسين قيد التطوير — بنخبرك أول ما يكون جاهز!",
    claudePrompt:
      "المنتج غير متاح بعد. أخبر العميل إنه قادم قريباً واسأله إذا يبي نسجّله في قائمة الانتظار.",
  },
  {
    id: "supplier-finder",
    nameAr: "كاشف الموردين",
    nameEn: "Supplier Finder",
    taglineAr: "اكتشف أفضل الموردين لمنتجاتك في العالم",
    descriptionAr:
      "يبحث عن أفضل الموردين لمنتجاتك، يقارن الأسعار، ويعطيك معلومات التواصل. يرسل لك تقرير يومي بأحدث العروض.",
    icon: "🏭",
    status: "coming_soon",
    releaseDate: null,
    visibleInChat: true,
    visibleInDashboard: false,
    requiredPlan: "pro",
    targetSectors: ["ecommerce", "restaurant"],
    requiredPieces: [
      "@activepieces/piece-http",
      "@activepieces/piece-gmail",
      "@activepieces/piece-schedule",
    ],
    requiredConnections: ["gmail"],
    chatAnnouncement:
      "قريباً: كاشف الموردين! بنلقى لك أفضل الموردين في العالم تلقائياً.",
    chatActivation:
      "كاشف الموردين قيد التطوير — بنخبرك أول ما يكون جاهز!",
    claudePrompt:
      "المنتج غير متاح بعد. اشرح للعميل وش بيسوي واسأله عن المنتجات اللي يبي موردين لها — سجّل المعلومات.",
  },
  {
    id: "review-guardian",
    nameAr: "حارس التقييمات",
    nameEn: "Review Guardian",
    taglineAr: "تنبيه فوري لكل تقييم سلبي + رد تلقائي",
    descriptionAr:
      "يراقب تقييماتك على خرائط قوقل. إذا جاك تقييم سلبي (أقل من 3 نجوم) يرسل لك تنبيه فوري مع اقتراح رد احترافي.",
    icon: "⭐",
    status: "coming_soon",
    releaseDate: null,
    visibleInChat: true,
    visibleInDashboard: false,
    requiredPlan: "growth",
    targetSectors: ["restaurant", "clinic"],
    requiredPieces: [
      "@activepieces/piece-http",
      "@activepieces/piece-gmail",
      "@activepieces/piece-schedule",
    ],
    requiredConnections: ["gmail"],
    chatAnnouncement:
      "قريباً: حارس التقييمات! بنراقب تقييماتك ونخبرك فوراً إذا جاك تقييم سلبي.",
    chatActivation:
      "حارس التقييمات قيد التطوير — بنخبرك أول ما يكون جاهز!",
    claudePrompt:
      "المنتج غير متاح بعد. اشرح للعميل إنه بيراقب تقييماته واسأله عن رابط خرائط قوقل — سجّل المعلومات.",
  },
];

// ============================================================
// دوال مساعدة — لا تعدّلها
// ============================================================

export function getReleasedProducts(): SiyadahProduct[] {
  return PRODUCTS_CATALOG.filter(
    (p) => p.status === "released" && p.visibleInChat
  );
}

export function getComingSoonProducts(): SiyadahProduct[] {
  return PRODUCTS_CATALOG.filter(
    (p) => p.status === "coming_soon" && p.visibleInChat
  );
}

export function getProductsForSector(sectorId: string): SiyadahProduct[] {
  return PRODUCTS_CATALOG.filter(
    (p) =>
      p.visibleInChat &&
      (p.targetSectors.length === 0 || p.targetSectors.includes(sectorId))
  );
}

export function searchProducts(query: string): SiyadahProduct[] {
  const q = query.toLowerCase();
  return PRODUCTS_CATALOG.filter(
    (p) =>
      p.nameAr.includes(q) ||
      p.nameEn.toLowerCase().includes(q) ||
      p.descriptionAr.includes(q)
  );
}

export function isProductAvailable(
  productId: string,
  userPlan: string
): boolean {
  const planOrder = ["free", "basic", "growth", "pro", "enterprise"];
  const product = PRODUCTS_CATALOG.find((p) => p.id === productId);
  if (!product || product.status !== "released") return false;
  return planOrder.indexOf(userPlan) >= planOrder.indexOf(product.requiredPlan);
}

export function getDashboardProducts(): SiyadahProduct[] {
  return PRODUCTS_CATALOG.filter(
    (p) => p.status === "released" && p.visibleInDashboard
  );
}
