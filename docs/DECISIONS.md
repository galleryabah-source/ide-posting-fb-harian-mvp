# Engineering Decisions

## 001 — Small surface, strong engine
The MVP intentionally has a very small user-facing feature set. Complexity belongs in domain services, not in navigation.

## 002 — AI is optional
Daily ideas must remain functional without an AI provider. Structured templates and deterministic rules provide the baseline output.

## 003 — Monetization is provider-agnostic
Advertising and affiliate integrations use adapters/contracts. Provider IDs and credentials never live in content components or client code.

## 004 — No Shopee scraping dependency
The product will not depend on crawling or scraping Shopee. Affiliate product/link data must be obtained through mechanisms permitted by the provider/program.

## 005 — Public content is separate from the app
Public SEO pages are the acquisition/advertising surface. Authenticated app pages prioritize usability and should not be overloaded with advertisements.

## 006 — Server boundary for expensive operations
AI generation, affiliate click tracking, and future persistence must execute through server-side application boundaries with validation and rate limits.
