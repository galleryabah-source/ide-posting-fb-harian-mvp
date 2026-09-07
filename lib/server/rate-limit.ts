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

/**
 * Use a shared usage_events window when Supabase is configured. Each accepted
 * request writes a dedicated rate-limit marker, so independent Vercel
 * instances observe the same counter. Local memory remains the dev fallback.
 */
export async function checkRateLimit(
  key: string,
  visitorId: string,
  eventName: string,
): Promise<RateLimitResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return localRateLimit(key);

  const rateEvent = `rate_limit:${eventName}`;
  const cutoff = new Date(Date.now() - WINDOW_MS).toISOString();
  const { count, error } = await supabase
    .from("usage_events")
    .select("id", { count: "exact", head: true })
    .eq("visitor_id", visitorId)
    .eq("event_name", rateEvent)
    .gte("created_at", cutoff);

  if (error) {
    console.error("rate limit persistence check failed", error.message);
    return localRateLimit(key);
  }

  if ((count ?? 0) >= MAX_REQUESTS) {
    return { allowed: false, retryAfterSeconds: Math.ceil(WINDOW_MS / 1000) };
  }

  const { error: markerError } = await supabase.from("usage_events").insert({
    visitor_id: visitorId,
    event_name: rateEvent,
    metadata: {},
  });
  if (markerError) console.error("rate limit marker insert failed", markerError.message);

  return { allowed: true, retryAfterSeconds: 0 };
}

export const RATE_LIMIT_WINDOW_SECONDS = WINDOW_MS / 1000;
export const RATE_LIMIT_MAX_REQUESTS = MAX_REQUESTS;
