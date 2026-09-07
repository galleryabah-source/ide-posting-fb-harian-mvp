# Blueprint — Ide Posting FB Harian

## Vision

Build a small, reliable daily content assistant for Facebook creators and mothers who prefer a simple mobile workflow.

## Core promise

Open → choose theme → get five useful ideas → create one post → copy/save.

## Primary user journey

1. Open home.
2. Choose a theme/niche.
3. Receive five curated ideas.
4. Open one idea.
5. Generate a ready-to-post caption.
6. Copy or save.

## User-facing modules

- Beranda
- Ide
- Rencana
- Disimpan
- Saya

No complex dashboards in MVP.

## Core engine

Input:
- niche
- content pillar
- content angle
- format
- date/season context
- user's recent ideas

Output:
- topic
- hook
- body direction
- CTA
- optional affiliate opportunity

The engine uses structured content data and deterministic rules first. AI is an optional service behind an adapter.

## Content safety and quality

The generator must:
- avoid near-duplicate ideas
- validate required fields
- gracefully handle generation failures
- preserve a usable fallback when AI is unavailable
- avoid unsupported claims and guaranteed-income language

## Monetization architecture

### Advertising

Use generic ad slots in public pages. Keep provider-specific IDs/configuration out of content components. AdSense approval is external and must not be assumed.

### Affiliate

Use a generic product/link contract. Shopee is the first planned provider. Affiliate links and product metadata must come from permitted mechanisms; no scraping/crawling dependency.

Affiliate disclosures must be supported in relevant UI.

## SEO architecture

Public pages are the acquisition layer:
- /ide-postingan-facebook
- /ide-postingan-facebook-hari-ini
- /ide/[niche]
- articles/help pages

Public content must be useful and not mass-generated thin pages.

## Technical principles

- modular monolith
- strict server/client boundary
- service layer between UI and data/provider integrations
- validation at application boundaries
- provider adapters for AI/ads/affiliate
- structured logging
- rate limits for expensive generation endpoints
- no credentials in source code
- production quality gates before merge
