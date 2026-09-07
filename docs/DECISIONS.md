# ENGINEERING DECISIONS

## 001 — Small surface, strong engine
The MVP intentionally keeps user-facing navigation small. Complexity belongs in domain services and data, not in screens.

## 002 — AI is optional
Daily ideas must remain usable without an AI provider. Deterministic structured content is the baseline; AI improves variation later.

## 003 — Provider agnostic monetization
Advertising and affiliate use generic contracts. AdSense and Shopee are integrations, not the application's domain model.

## 004 — No Shopee scraping dependency
The app will not require crawling or scraping Shopee. Product/link acquisition must use a mechanism permitted by the applicable affiliate program.

## 005 — Public content is separate
Public SEO pages are the acquisition and advertising surface. The core creator workflow remains clean and low-friction.

## 006 — Server boundary for expensive operations
AI generation, persistence, usage accounting, and outbound tracking belong behind server-side application boundaries.

## 007 — Graceful degradation
A provider failure must degrade to a usable deterministic experience rather than a broken page.

## 008 — No guaranteed-income claims
Copy and product messaging must not claim guaranteed virality, sales, commission, or income.

## 009 — No premature scale architecture
Start as a modular monolith. Split services only when actual traffic or operational evidence requires it.
