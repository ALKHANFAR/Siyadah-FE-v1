// بروفايل العميل — يتحدّث تلقائياً من المحادثات والتحليل

export interface CompanyDNA {
  name: string;
  sector: string;
  url: string;
  size: "solo" | "small" | "medium" | "large";
  description: string;
  gaps: string[];
  strengths: string[];
  stage: "day1" | "day3" | "week1" | "week3" | "month1";
  facts: string[];
  automationsBuilt: number;
  lastInteraction: string;
}

export function getDefaultDNA(): CompanyDNA {
  return {
    name: "",
    sector: "general",
    url: "",
    size: "small",
    description: "",
    gaps: [],
    strengths: [],
    stage: "day1",
    facts: [],
    automationsBuilt: 0,
    lastInteraction: new Date().toISOString(),
  };
}

export function buildDNAFromAnalysis(
  analysis: Record<string, unknown>
): Partial<CompanyDNA> {
  return {
    name: (analysis.companyName ||
      (analysis.company as Record<string, unknown> | undefined)?.name ||
      "") as string,
    sector: detectSector(analysis),
    url: (analysis.url || "") as string,
    description: (analysis.description || "") as string,
    gaps: (analysis.gaps ||
      (analysis.dna as Record<string, unknown> | undefined)?.gaps ||
      []) as string[],
    strengths: (analysis.strengths ||
      (analysis.dna as Record<string, unknown> | undefined)?.strengths ||
      []) as string[],
  };
}

function detectSector(data: Record<string, unknown>): string {
  const text = JSON.stringify(data).toLowerCase();
  const sectors: Record<string, string[]> = {
    restaurant: ["مطعم", "restaurant", "food", "طعام", "أكل", "menu", "منيو"],
    clinic: ["عيادة", "clinic", "medical", "طبي", "مستشفى", "hospital", "صحي"],
    ecommerce: ["متجر", "shop", "store", "ecommerce", "تسوق", "منتجات"],
    realestate: ["عقار", "real estate", "عقارات", "إيجار", "بيع"],
    education: ["تعليم", "education", "تدريب", "training", "أكاديمي"],
    legal: ["محاماة", "legal", "law", "قانون", "مكتب محاماة"],
    saas: ["saas", "software", "برنامج", "تطبيق", "app", "ai", "ذكاء"],
    services: ["خدمات", "services", "استشار", "consulting"],
    construction: ["مقاول", "بناء", "construction", "تشييد"],
    logistics: ["شحن", "logistics", "توصيل", "delivery"],
  };

  for (const [sector, keywords] of Object.entries(sectors)) {
    if (keywords.some((k) => text.includes(k))) return sector;
  }
  return "general";
}
