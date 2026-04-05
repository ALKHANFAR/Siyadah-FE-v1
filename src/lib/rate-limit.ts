const requests = new Map<string, number[]>();

export function isRateLimited(
  ip: string,
  limit = 30,
  windowMs = 60000
): boolean {
  const now = Date.now();
  const timestamps = requests.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < windowMs);

  if (recent.length >= limit) return true;

  recent.push(now);
  requests.set(ip, recent);
  return false;
}
