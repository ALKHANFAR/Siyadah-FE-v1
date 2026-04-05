// ============================================================
// رسائل الخطأ — بالعربي الودي
// لا رسائل إنجليزية تقنية للعميل
// ============================================================

export const ERROR_MESSAGES = {
  // تحليل الموقع
  analysis_failed:
    "ما قدرنا نحلل الموقع — ممكن يكون محمي. عطنا وصف بسيط لعملك.",
  analysis_timeout:
    "التحليل أخذ وقت أطول من المتوقع. نحاول مرة ثانية؟",
  analysis_invalid_url:
    "الرابط اللي أدخلته مو صحيح. تأكد إنه يبدأ بـ https://",

  // الشات
  chat_disconnected: "انقطع الاتصال — نحاول نرجعه...",
  chat_tool_failed: "ما قدرت أنفذ الطلب. ممكن تعيد صياغته؟",
  chat_rate_limited: "طلبات كثيرة! انتظر شوي وحاول مرة ثانية.",

  // الأتمتات
  automation_build_failed:
    "ما قدرت أبني الموظف الذكي. أحاول بطريقة ثانية...",
  automation_needs_connection:
    "أحتاج تربط {channel} أول عشان أقدر أنفذ.",
  automation_test_failed:
    "الاختبار ما نجح. ممكن فيه مشكلة بالإعدادات.",
  automation_not_found: "ما لقيت الموظف الذكي. ممكن يكون محذوف.",

  // القنوات
  connection_failed: "ما قدرنا نربط القناة. حاول مرة ثانية.",
  connection_expired: "الربط انتهت صلاحيته. لازم تعيد الربط.",

  // عام
  network_error: "يبدو فيه مشكلة بالاتصال. تأكد من الإنترنت.",
  unexpected: "صار شي غير متوقع. فريقنا بيتابع الموضوع.",
  rate_limited: "طلبات كثيرة! انتظر دقيقة وحاول مرة ثانية.",
  orchestrator_down:
    "النظام يمر بصيانة سريعة. حاول بعد دقائق.",
} as const;

export type ErrorKey = keyof typeof ERROR_MESSAGES;

export function getErrorMessage(
  key: ErrorKey,
  replacements?: Record<string, string>
): string {
  let message: string = ERROR_MESSAGES[key];
  if (replacements) {
    for (const [k, v] of Object.entries(replacements)) {
      message = message.replace(`{${k}}`, v);
    }
  }
  return message;
}
