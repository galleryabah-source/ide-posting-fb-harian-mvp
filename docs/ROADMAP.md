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

Exit gate:

`typecheck → lint → unit test → build`

## Phase 1 — Core MVP 🔄

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

Status saat ini:

- UI mobile-first: implemented.
- Niche selection: implemented.
- Five deterministic daily ideas: implemented.
- Post generator: implemented.
- Copy: implemented.
- Save: implemented melalui local storage fallback.
- Public SEO page: implemented.

Remaining hardening:

- server persistence,
- stronger validation boundaries,
- production E2E smoke test,
- backend rate limiting,
- real provider configuration.

## Phase 2 — Engine Hardening

Target: kualitas dan reliability lebih penting daripada jumlah fitur.

- Server-side content service.
- Request validation.
- Output schema validation.
- Duplicate/near-duplicate prevention berbasis content fingerprint.
- Deterministic ranking.
- AI adapter dengan graceful fallback.
- Rate limiting.
- Structured logging.
- AI cost guardrail.

Exit gate: unit + integration tests untuk engine dan generation boundary.

## Phase 3 — Monetization Ready

### AdSense

- Production ad slot abstraction.
- Environment-based configuration.
- Public-page placement rules.
- No provider secret in client.
- Privacy/cookie disclosure sesuai kebutuhan implementasi.
- AdSense verification/approval is external and never assumed.

### Shopee Affiliate

- Product/link domain contract.
- Affiliate disclosure.
- Safe outbound URL validation.
- Click event boundary.
- Provider adapter.
- Provider-approved acquisition mechanism only.
- No scraping/crawling dependency.

## Phase 4 — Persistence + Personalization

Only after real usage exists:

- Supabase/PostgreSQL persistence.
- User preferred niche.
- Saved content across devices.
- Recent content history.
- Reduce repeated ideas.
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
