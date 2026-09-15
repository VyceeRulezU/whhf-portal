/**
 * Admin login rate limiter — backed by Cloudflare KV (env.RATE_LIMIT_KV,
 * see wrangler.jsonc) in production, since an in-memory Map doesn't work:
 * Cloudflare Workers runs many isolated instances behind a single Worker,
 * each with its own memory, so a per-isolate counter never reliably caps
 * attempts across all of them. Falls back to an in-memory Map for local
 * `next dev`, where no KV binding is available. See security.md ("Admin
 * auth", "rate-limit login attempts").
 */

interface Entry {
  count: number;
  firstAttemptAt: number;
}

interface KvLike {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
}

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const WINDOW_SECONDS = WINDOW_MS / 1000;
const MAX_ATTEMPTS = 5;

const memoryAttempts = new Map<string, Entry>();

async function getKv(): Promise<KvLike | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext({ async: true });
    return (env as { RATE_LIMIT_KV?: KvLike }).RATE_LIMIT_KV ?? null;
  } catch {
    // Not running on Cloudflare Workers (e.g. local `next dev`) — fall
    // through to the in-memory Map below.
    return null;
  }
}

function isExpired(entry: Entry): boolean {
  return Date.now() - entry.firstAttemptAt > WINDOW_MS;
}

export async function isRateLimited(key: string): Promise<boolean> {
  const kv = await getKv();

  if (!kv) {
    const entry = memoryAttempts.get(key);
    if (!entry) return false;
    if (isExpired(entry)) {
      memoryAttempts.delete(key);
      return false;
    }
    return entry.count >= MAX_ATTEMPTS;
  }

  const raw = await kv.get(key);
  if (!raw) return false;
  const entry = JSON.parse(raw) as Entry;
  if (isExpired(entry)) return false;
  return entry.count >= MAX_ATTEMPTS;
}

export async function recordFailedAttempt(key: string): Promise<void> {
  const kv = await getKv();

  if (!kv) {
    const entry = memoryAttempts.get(key);
    if (!entry || isExpired(entry)) {
      memoryAttempts.set(key, { count: 1, firstAttemptAt: Date.now() });
      return;
    }
    entry.count += 1;
    return;
  }

  const raw = await kv.get(key);
  const entry = raw ? (JSON.parse(raw) as Entry) : null;

  if (!entry || isExpired(entry)) {
    await kv.put(key, JSON.stringify({ count: 1, firstAttemptAt: Date.now() }), {
      expirationTtl: WINDOW_SECONDS
    });
    return;
  }

  entry.count += 1;
  await kv.put(key, JSON.stringify(entry), { expirationTtl: WINDOW_SECONDS });
}

export async function clearAttempts(key: string): Promise<void> {
  const kv = await getKv();

  if (!kv) {
    memoryAttempts.delete(key);
    return;
  }

  await kv.delete(key);
}
