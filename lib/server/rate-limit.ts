type Entry = { count: number; resetAt: number };

const buckets = new Map<string, Entry>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;

export function checkRateLimit(key: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    if (buckets.size > 10_000) prune(now);
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= MAX_REQUESTS) {
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
  }

  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

function prune(now: number): void {
  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) buckets.delete(key);
  }
}

export const RATE_LIMIT_WINDOW_SECONDS = WINDOW_MS / 1000;
export const RATE_LIMIT_MAX_REQUESTS = MAX_REQUESTS;
