# Deployment Guide

## 1. Runtime

Target:
- Next.js App Router
- Node.js 24
- Cloudflare Workers for hosting
- Dedicated Supabase project for this repository

Cloudflare deployment uses the vinext path for Next.js. Cloudflare currently recommends vinext as the default way to run Next.js applications on Workers. The repository keeps the regular Next.js development/build path intact while the Cloudflare path is validated separately.

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

## 3. Cloudflare deployment prerequisites

The GitHub workflow `.github/workflows/cloudflare-deploy.yml` is a manual production deploy. It requires these GitHub Actions secrets:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `VINEXT_KV_NAMESPACE_ID`

The KV namespace is created once for the Worker cache and its ID is stored as a secret. The workflow does not create a new KV namespace on every deployment.

The deploy workflow runs:

1. `npm install`
2. `vinext init --platform=cloudflare`
3. required-secret validation
4. KV namespace injection into the generated Wrangler configuration
5. `npm run build:vinext`
6. `@vinext/cloudflare deploy`

Do not place Cloudflare API tokens or Supabase service-role keys in the repository.

## 4. Database

Apply `supabase/migrations/20260907000000_initial_app_schema.sql` only to the dedicated project for this application.

The migration enables RLS and intentionally provides no direct anonymous table policies. Server routes use the server-only key after request validation.

## 5. Health and production verification

After deployment:

1. Open `/api/health`.
2. Expect HTTP 200 with `database: "ok"` when the dedicated Supabase project is configured and healthy.
3. Verify `/`, `/ide-postingan-facebook`, `/ide-postingan-facebook-hari-ini`, `/robots.txt`, and `/sitemap.xml`.
4. Exercise generate/save endpoints.
5. Verify affiliate tracking rejects non-HTTPS or unapproved destinations.
6. Verify repeated generation requests eventually return HTTP 429.
7. Review Cloudflare Worker logs and deployment status for errors.

## 6. Monetization safeguards

- AdSense identifiers are configuration, not content data.
- Affiliate URLs are validated server-side.
- The MVP has no Shopee scraping or crawling dependency.
- Affiliate disclosures remain visible where affiliate content is shown.
- Provider failure must not break the core content experience.

## 7. Pre-release gate

`npm run typecheck`

`npm run lint`

`npm test`

`npm run build`

And for Cloudflare:

`npx vinext@latest check`

`npm run build:vinext`

Then perform a browser smoke test on a mobile viewport before production promotion.

## 8. Rollback

If a deployment is unhealthy, revert the Worker to the last known-good version. Do not modify database structure as a first response to an application deployment failure.
