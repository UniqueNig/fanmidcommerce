/**
 * Best-effort in-memory rate limiter for public API routes.
 *
 * NOTE: on serverless (Vercel) this is per-instance and resets on cold start,
 * so it's a soft guard, not bulletproof. Combined with the form honeypots it
 * stops the vast majority of casual spam. For hard limits, back this with a
 * shared store (e.g. Upstash Redis) later.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const rec = hits.get(key);
  if (!rec || now > rec.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (rec.count >= limit) return false;
  rec.count++;
  return true;
}

/** Pull a best-guess client IP from request headers. */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}
