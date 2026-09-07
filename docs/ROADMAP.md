# Roadmap — Ide Posting FB Harian

## Phase 0 — Foundation

Goal: establish a clean, testable, monetization-ready base.

- Next.js + TypeScript
- mobile-first UI shell
- domain/service boundaries
- content data model
- generic advertising adapter
- generic affiliate adapter
- public SEO/content routes
- legal/disclosure structure
- environment/secrets policy

Exit gate: typecheck, lint, build, basic smoke test.

## Phase 1 — Core MVP

Goal: prove the daily habit.

- theme selection
- five daily ideas
- idea detail
- generate post
- copy
- save
- simple history

Success signal: users return and create/copy ideas repeatedly.

## Phase 2 — Engine hardening

- content pillars
- content angles
- deterministic ranking
- duplicate prevention
- validation
- graceful AI fallback
- server-side generation boundary
- rate limiting

Exit gate: unit + integration tests around the content engine and generation endpoint.

## Phase 3 — Monetization ready

Advertising:
- generic ad slot component
- placement rules for public SEO pages
- provider configuration via environment variables

Affiliate:
- generic product/link model
- disclosure component
- click tracking
- provider adapter boundary
- Shopee integration only through permitted mechanisms

SEO:
- useful public niche pages
- metadata/schema basics
- sitemap/robots
- legal pages

## Phase 4 — Personalization

Only after real usage data exists:

- remember preferred themes
- reuse high-performing patterns
- recommend tomorrow's ideas

## Phase 5 — Revenue optimization

- improve SEO traffic
- improve affiliate click-through
- monitor ad performance
- control AI cost per user
- measure retention

## Explicitly deferred

Do not add these until validated by usage:

- native mobile app
- automated cross-platform publishing
- marketplace
- team/agency accounts
- complex analytics suite
- autonomous agents
