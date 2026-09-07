# ROADMAP — IDE POSTING FB HARIAN

Roadmap ini sengaja ringkas. Kita tidak membangun banyak fitur sebelum core habit, kualitas mesin, dan monetisasi terbukti.

## Phase 0 — Foundation ✅

Target: repository dapat dibangun, diuji, dan dikembangkan tanpa fondasi rapuh.

Deliverables:

- Next.js + TypeScript.
- Mobile-first design system.
- Content domain engine.
- Service/provider boundaries.
- Generic advertising contract.
- Generic affiliate contract.
- Public SEO routes.
- Legal/disclosure routes.
- Environment policy.
- CI quality gate.

## Phase 1 — Core MVP ✅

Target: user menyelesaikan workflow utama dalam beberapa langkah.

```text
Pilih tema
 ↓
5 ide
 ↓
Pilih ide
 ↓
Buat posting
 ↓
Salin / Simpan
```

Status:

- UI mobile-first: implemented.
- Niche selection: implemented.
- Five deterministic daily ideas: implemented.
- Post generator: implemented.
- Copy: implemented.
- Save: local fallback + server endpoint implemented.
- Public SEO page: implemented.

## Phase 2 — Engine Hardening ✅/🔄

Implemented:

- Request validation with Zod.
- Server-side generation boundary.
- Replaceable AI provider boundary.
- Deterministic fallback when AI is unavailable.
- Bounded rate limiting for generation/save/click endpoints.
- Safe anonymous visitor context.
- Server-backed saved posts API.
- Safe affiliate destination validation.
- Unit tests for validation and rate limiting.

Remaining:

- Distributed rate-limit store for multi-instance production.
- Full integration test against a dedicated Supabase project.
- Runtime E2E smoke test.

## Phase 3 — Monetization Ready 🔄

### AdSense

- Generic ad slot abstraction.
- Environment-based configuration.
- Public-page placement rules.
- No provider secret in client.
- Legal/disclosure structure.
- AdSense verification/approval remains an external Google process.

### Shopee Affiliate

- Generic product/link contract.
- Affiliate disclosure.
- Safe outbound URL validation.
- Click tracking endpoint.
- Provider adapter boundary.
- No scraping/crawling dependency.

Remaining:

- Configure real provider identifiers/links in deployment environment.
- Verify provider-specific compliance before launch.

## Phase 4 — Dedicated Persistence + Personalization

Only after real usage exists:

- Dedicated Supabase/PostgreSQL project.
- Saved content across devices.
- Recent content history.
- Preferred niche persistence.
- Reduce repeated ideas using user history.
- Basic personalized recommendations.

## Phase 5 — Revenue Optimization

Focus on economics, not feature count:

- SEO traffic.
- Returning users.
- Ad placement quality.
- Affiliate click-through.
- Affiliate conversion where measurable.
- AI cost per active user.
- Retention.

## Phase 6 — Scale only when justified

Potential later additions:

- richer analytics,
- advanced trend signals,
- paid creator tier,
- PWA enhancements.

Still explicitly deferred until validated:

- native apps,
- broad social auto-publishing,
- marketplace,
- team/agency system,
- autonomous agents.

## Delivery rule

Every phase must leave the previous phase working. No feature is considered complete without its related validation, error handling, and quality gate.
