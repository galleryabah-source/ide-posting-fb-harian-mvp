# Deployment Guide

## 1. Runtime

Target:
- Next.js App Router
- Node.js 24
- Vercel for hosting
- Dedicated Supabase project for this repository

## 2. Required server environment

Set these only in the server environment:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Public configuration:
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_ADSENSE_ENABLED`
- `NEXT_PUBLIC_ADSENSE_CLIENT_ID`
- `SHOPEE_AFFILIATE_ENABLED`

Never expose `SUPABASE_SERVICE_ROLE_KEY` under a `NEXT_PUBLIC_*` variable.

## 3. Database

Apply `supabase/migrations/20260907000000_initial_app_schema.sql` only to the dedicated project for this application.

The migration enables RLS and intentionally provides no direct anonymous table policies. Server routes use the server-only key after request validation.

## 4. Production sequence

1. Create/configure the dedicated Supabase project.
2. Apply the migration.
3. Add environment variables in Vercel.
4. Deploy from `main`.
5. Verify `/`, `/ide-postingan-facebook`, `/ide-postingan-facebook-hari-ini`, `/robots.txt`, and `/sitemap.xml`.
6. Exercise generate/save endpoints.
7. Review logs and error rate.
8. Configure approved AdSense and Shopee Affiliate identifiers/links only after provider onboarding and policy review.

## 5. Monetization safeguards

- AdSense identifiers are configuration, not content data.
- Affiliate URLs are validated server-side.
- The MVP has no Shopee scraping or crawling dependency.
- Affiliate disclosures remain visible where affiliate content is shown.
- Provider failure must not break the core content experience.

## 6. Pre-release gate

`npm run typecheck`

`npm run lint`

`npm test`

`npm run build`

Then perform a browser smoke test on mobile viewport before production promotion.
