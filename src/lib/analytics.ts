export function trackEvent(name: string, data?: Record<string, unknown>) {
  if (process.env.NODE_ENV === "development") {
    console.log("[Analytics]", name, data);
  }
}
