import test from "node:test";
import assert from "node:assert/strict";
import { checkRateLimit, RATE_LIMIT_MAX_REQUESTS } from "../lib/server/rate-limit";

test("rate limit falls back to local bucket without Supabase", async () => {
  const key = `test-${Date.now()}-${Math.random()}`;
  const visitorId = crypto.randomUUID();
  for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i += 1) {
    const result = await checkRateLimit(key, visitorId, "unit-test");
    assert.equal(result.allowed, true);
  }

  const blocked = await checkRateLimit(key, visitorId, "unit-test");
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfterSeconds >= 1);
});
