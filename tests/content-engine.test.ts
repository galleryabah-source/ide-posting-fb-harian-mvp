import test from "node:test";
import assert from "node:assert/strict";
import { generateDailyIdeas, generatePost } from "../lib/content-engine";

test("generateDailyIdeas returns five deterministic ideas", () => {
  const date = new Date("2026-09-07T00:00:00+07:00");
  const first = generateDailyIdeas("rumah-tangga", date);
  const second = generateDailyIdeas("rumah-tangga", date);
  assert.equal(first.length, 5);
  assert.deepEqual(first, second);
  assert.equal(new Set(first.map((idea) => idea.title)).size, 5);
});

test("generatePost contains hook and CTA", () => {
  const idea = generateDailyIdeas("masakan", new Date("2026-09-07T00:00:00+07:00"))[0];
  const post = generatePost(idea);
  assert.ok(post.includes(idea.hook));
  assert.ok(post.includes(idea.cta));
});

test("different niches produce niche-specific output", () => {
  const home = generateDailyIdeas("rumah-tangga", new Date("2026-09-07T00:00:00+07:00"));
  const fashion = generateDailyIdeas("fashion", new Date("2026-09-07T00:00:00+07:00"));
  assert.notDeepEqual(home.map((idea) => idea.title), fashion.map((idea) => idea.title));
});
