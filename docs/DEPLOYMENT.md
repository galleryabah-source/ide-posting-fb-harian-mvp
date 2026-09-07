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

## 4. Health and production verification

After deployment:

1. Open `/api/health`.
2. Expect HTTP 200 with `database: "ok"` when the dedicated Supabase project is configured and healthy.
3. Verify `/`, `/ide-postingan-facebook`, `/ide-postingan-facebook-hari-ini`, `/robots.txt`, and `/sitemap.xml`.
4. Exercise generate/save endpoints.
5. Verify affiliate tracking rejects non-HTTPS or unapproved destinations.
6. Verify repeated generation requests eventually return HTTP 429.
7. Review Vercel runtime logs for errors.

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

Then perform a browser smoke test on a mobile viewport before production promotion.

## 7. Rollback

If a deployment is unhealthy, revert to the last known-good Vercel deployment. Do not modify database structure as a first response to an application deployment failure.
