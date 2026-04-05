// ============================================================
// DNA الشركة — التخصيص الفائق
// يُحقن بعد بناء البروفايل
// ============================================================

export function buildPersonalizationPrompt(companyDNA: {
  name: string;
  sector: string;
  country: string;
  city?: string;
  currency: string;
  products?: string[];
  competitors?: string[];
  style?: string;
}): string {
  return `## التخصيص الفائق:

### طبقة القطاع:
القطاع: ${companyDNA.sector}
(استخدم مصطلحات ومشاكل هالقطاع — مطعم ≠ عيادة ≠ متجر)

### طبقة الموقع:
الدولة: ${companyDNA.country}
${companyDNA.city ? `المدينة: ${companyDNA.city}` : ""}
العملة: ${companyDNA.currency}
(استخدم العملة المحلية في الأرقام — لا دولارات)

### طبقة الشركة:
الاسم: ${companyDNA.name}
${companyDNA.products?.length ? `المنتجات: ${companyDNA.products.join("، ")}` : ""}
${companyDNA.competitors?.length ? `المنافسين: ${companyDNA.competitors.join("، ")}` : ""}
${companyDNA.style ? `أسلوب التواصل: ${companyDNA.style}` : ""}

### تعليمات:
- تكلم عن منتجاته بأسمائها الحقيقية
- قارن بمنافسيه الحقيقيين
- استخدم عملته في كل الأرقام
- خصّص KPIs حسب قطاعه
`;
}
