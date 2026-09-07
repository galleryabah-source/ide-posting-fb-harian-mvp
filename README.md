# IDE POSTING FB HARIAN

Simple daily Facebook content assistant for creators and non-technical users.

## Product principle

Small surface, strong engine, easy on mobile.

Primary flow:

`Pilih tema → dapat 5 ide → pilih ide → buat posting → salin/simpan`

## MVP scope

- Mobile-first homepage
- Niche/theme selection
- Five daily content ideas
- Deterministic content engine using niche + pillar + angle + format
- Post generator
- Copy and save interactions
- Simple content history
- Provider-agnostic advertising and affiliate contracts
- Public SEO/content layer prepared for AdSense review
- Affiliate layer prepared for Shopee Affiliate without scraping/crawling dependency

## Non-goals for MVP

- Native mobile apps
- Complex social publishing integrations
- Marketplace
- Agency/team management
- Large analytics suite
- Autonomous AI agents
- Scraping Shopee

## Architecture

```text
UI
 ↓
Application services
 ↓
Content domain engine
 ↓
Data layer

Monetization:
Ad slots → Advertising provider adapter
Affiliate product/link → Affiliate provider adapter
```

AI, when introduced, must sit behind an adapter and must not be the single point of failure for daily ideas.

## Monetization readiness

### Advertising

Generic ad-slot components are reserved for Google AdSense and future providers. AdSense approval and serving remain subject to Google's review and policies.

### Affiliate

Generic affiliate contracts are reserved for Shopee Affiliate first. Product/link acquisition must use permitted provider mechanisms; the app must not depend on prohibited scraping/crawling.

## Roadmap

See `docs/BLUEPRINT.md` and `docs/ROADMAP.md`.

## Quality gates

Type check → lint → unit tests → integration tests → build → security checks → end-to-end smoke test.
