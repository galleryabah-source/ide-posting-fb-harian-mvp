import { getSupabaseAdmin } from "./supabase-admin";

type Entry = { count: number; resetAt: number };
type RateLimitResult = { allowed: boolean; retryAfterSeconds: number };

const buckets = new Map<string, Entry>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;

function localRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    if (buckets.size > 10_000) prune(now);
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

function prune(now: number): void {
  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) buckets.delete(key);
  }
}

/**
 * Prefer an atomic PostgreSQL bucket when Supabase is configured so all
 * Vercel instances share one counter. Fall back to memory during local dev.
 */
export async function checkRateLimit(
  key: string,
  visitorId: string,
  eventName: string,
): Promise<RateLimitResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return localRateLimit(key);

  const { data, error } = await supabase.rpc("consume_rate_limit", {
    p_visitor_id: visitorId,
    p_event_name: eventName,
    p_max_requests: MAX_REQUESTS,
    p_window_seconds: WINDOW_MS / 1000,
  });

  if (error) {
    console.error("rate limit RPC failed", error.message);
    return localRateLimit(key);
  }

  const result = Array.isArray(data) ? data[0] : data;
  return {
    allowed: result?.allowed !== false,
    retryAfterSeconds: Number(result?.retry_after_seconds ?? 0),
  };
}

export const RATE_LIMIT_WINDOW_SECONDS = WINDOW_MS / 1000;
export const RATE_LIMIT_MAX_REQUESTS = MAX_REQUESTS;
