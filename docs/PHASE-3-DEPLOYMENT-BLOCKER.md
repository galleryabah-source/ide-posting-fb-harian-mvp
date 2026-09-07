# Phase 3 Deployment Blocker

The application code is ready for a dedicated Supabase-backed deployment, but provider provisioning is intentionally separate from source-code changes.

## Required external setup

1. Dedicated Supabase project for `ide-posting-fb-harian-mvp`.
2. Apply `supabase/migrations/20260907000000_initial_app_schema.sql` to that project.
3. Configure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in Vercel server environment.
4. Configure `NEXT_PUBLIC_SITE_URL` after the production domain is known.
5. Keep AdSense disabled until the public site has passed the provider's review requirements.
6. Add only approved Shopee Affiliate links/provider data.

## Why this remains external

This repository must not reuse an unrelated application's Supabase database. The source contains the migration and adapter boundary, so provisioning can be completed without changing the application design.

## Verification after provisioning

- `/api/health` → `status=ok`, `database=ok`
- Generate → successful response
- Save → persists and is isolated by visitor
- Affiliate click → validates and records
- Rate limit → returns 429 after threshold
- `robots.txt` / `sitemap.xml` → reachable
- Production build and browser smoke test → pass
