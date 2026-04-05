// ============================================================
// الامتصاص الشامل 360° — يحلل ويبني بروفايل
// يُحقن بعد تحليل الموقع في system prompt
// ============================================================

export function buildAbsorberPrompt(companyData: {
  name: string;
  sector: string;
  country: string;
  strengths: string[];
  painPoints: string[];
  opportunities: string[];
  healthScore: number;
}): string {
  return `## معلومات الشركة الحالية (تم امتصاصها من الموقع):

**الشركة:** ${companyData.name}
**القطاع:** ${companyData.sector}
**الموقع:** ${companyData.country}
**صحة الأعمال:** ${companyData.healthScore}/100

**نقاط القوة:**
${companyData.strengths.map((s) => `- ${s}`).join("\n")}

**نقاط الألم:**
${companyData.painPoints.map((p) => `- ${p}`).join("\n")}

**فرص النمو:**
${companyData.opportunities.map((o) => `- ${o}`).join("\n")}

## تعليمات الامتصاص:
- تكلم مع العميل كأنك تعرف شركته من سنين
- لا تسأل عن معلومات موجودة أعلاه
- استخدم المعلومات لتخصيص اقتراحاتك
- اربط كل اقتراح بنقطة ألم أو فرصة حقيقية
- استخدم مصطلحات القطاع (مثل: "طلبات" للمطعم، "مرضى" للعيادة)
`;
}
