# RELEASE CHECKLIST — IDE POSTING FB HARIAN

## Application

- [ ] Homepage usable on 360px mobile width.
- [ ] Theme selector works.
- [ ] Exactly five ideas are returned for each supported niche/date.
- [ ] Generated post is readable and bounded in size.
- [ ] Copy works in supported browsers.
- [ ] Save works locally without backend configuration.
- [ ] Save sync works when Supabase is configured.
- [ ] Failure states remain non-destructive.

## Backend

- [ ] `/api/health` returns `status=ok`.
- [ ] `/api/generate` rejects invalid input.
- [ ] `/api/generate` returns 429 after rate limit.
- [ ] `/api/saved` isolates records by visitor cookie.
- [ ] `/api/affiliate/click` rejects non-HTTPS destinations.
- [ ] `/api/affiliate/click` rejects unapproved hosts.
- [ ] Server-only secrets are not exposed to the browser.

## Database

- [ ] Dedicated Supabase project is used.
- [ ] Migration applied successfully.
- [ ] RLS is enabled on application tables.
- [ ] Security advisor has no unresolved critical finding.

## SEO / advertising

- [ ] `robots.txt` loads.
- [ ] `sitemap.xml` loads.
- [ ] Public pages contain useful, non-thin content.
- [ ] Privacy, terms, about, and affiliate disclosure pages are reachable.
- [ ] AdSense identifiers are configured only after provider requirements are satisfied.
- [ ] Ad slots do not obstruct the core user flow.

## Affiliate

- [ ] Affiliate links come from approved provider mechanisms.
- [ ] Disclosure is visible near relevant affiliate content.
- [ ] Click tracking is non-blocking.
- [ ] No scraping/crawling dependency exists.

## Quality gate

Run in order:

`npm run typecheck`

`npm run lint`

`npm test`

`npm run build`

Then perform a production browser smoke test.
