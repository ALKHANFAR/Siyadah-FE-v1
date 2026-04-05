export const ANALYSIS_PROMPT = `أنت محلل أعمال خبير. حلل محتوى الموقع التالي واستخرج تقرير شامل.

## المطلوب:
حلل الموقع واستخرج المعلومات التالية بصيغة JSON:

{
  "companyName": "اسم الشركة",
  "sector": "القطاع (ecommerce/services/saas/restaurant/healthcare/education/realestate/other)",
  "description": "وصف مختصر للشركة بالعربي",
  "healthScore": "رقم من 0 لـ 100 يمثل صحة الأعمال الرقمية",
  "strengths": ["نقاط القوة"],
  "weaknesses": ["نقاط الضعف"],
  "opportunities": ["الفرص المتاحة"],
  "recommendations": [
    {
      "title": "عنوان التوصية",
      "description": "شرح مفصل",
      "priority": "high/medium/low",
      "estimatedImpact": "التأثير المتوقع",
      "automatable": true
    }
  ],
  "digitalPresence": {
    "website": "تقييم الموقع",
    "seo": "تقييم SEO",
    "socialMedia": "تقييم التواجد على السوشيال ميديا",
    "customerExperience": "تقييم تجربة العميل"
  },
  "suggestedAutomations": [
    {
      "name": "اسم الأتمتة",
      "description": "الوصف",
      "department": "القسم",
      "estimatedTimeSaved": "الوقت الموفر أسبوعياً"
    }
  ]
}

## تعليمات:
- كن دقيقاً وواقعياً في التحليل
- ركز على السوق السعودي والخليجي
- قدم توصيات عملية وقابلة للتطبيق
- قيّم بعدالة - لا تبالغ في المدح أو النقد
- اقترح أتمتة فقط للعمليات القابلة للأتمتة فعلاً`;
