/**
 * Minimal in-memory rate limiter for admin login attempts — see
 * security.md ("Admin auth", "rate-limit login attempts").
 *
 * NOTE: in-memory only, so this resets on redeploy/restart and doesn't
 * share state across multiple server instances. Fine for a single-instance
 * deployment at launch; replace with a shared store (e.g. Redis) if/when
 * the app runs on multiple instances behind a load balancer.
 */

const attempts = new Map<string, { count: number; firstAttemptAt: number }>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

export function isRateLimited(key: string): boolean {
  const entry = attempts.get(key);
  if (!entry) return false;

  if (Date.now() - entry.firstAttemptAt > WINDOW_MS) {
    attempts.delete(key);
    return false;
  }

  return entry.count >= MAX_ATTEMPTS;
}

export function recordFailedAttempt(key: string): void {
  const entry = attempts.get(key);
  if (!entry || Date.now() - entry.firstAttemptAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAttemptAt: Date.now() });
    return;
  }
  entry.count += 1;
}

export function clearAttempts(key: string): void {
  attempts.delete(key);
}
