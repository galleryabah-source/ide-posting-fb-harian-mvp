import test from "node:test";
import assert from "node:assert/strict";
import { generateRequestSchema, savePostSchema } from "../lib/validation";
import { checkRateLimit } from "../lib/server/rate-limit";

test("generate request accepts a known niche and idea", () => {
  const result = generateRequestSchema.safeParse({ niche: "rumah-tangga", ideaId: "rumah-tangga-1-123" });
  assert.equal(result.success, true);
});

test("generate request rejects unknown niche", () => {
  const result = generateRequestSchema.safeParse({ niche: "unknown", ideaId: "x" });
  assert.equal(result.success, false);
});

test("saved post rejects oversized content", () => {
  const result = savePostSchema.safeParse({
    ideaId: "idea",
    niche: "masakan",
    title: "Judul",
    postText: "x".repeat(12_001),
  });
  assert.equal(result.success, false);
});

test("rate limiter blocks the 21st request in a single window", () => {
  const key = `test-${Date.now()}-${Math.random()}`;
  for (let i = 0; i < 20; i += 1) assert.equal(checkRateLimit(key).allowed, true);
  const blocked = checkRateLimit(key);
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfterSeconds > 0);
});
