# SECURITY BASELINE

## Secrets

- Never commit provider API keys, service-role keys, cookies, or credentials.
- Client-side environment variables are limited to values that are intentionally public, such as site URL or an advertising publisher ID when required by the provider.
- Server-only credentials will use server environment variables when backend integrations are enabled.

## Input validation

All future server endpoints must validate:

- allowed niche identifiers,
- allowed format identifiers,
- string length limits,
- outbound URLs,
- pagination and usage limits.

## Output validation

Generated content must be checked for required fields and safe size limits before persistence or rendering.

## Rate limiting

AI generation and outbound tracking are potentially expensive endpoints. They must be rate-limited at the server boundary before production activation.

## Affiliate safety

Only HTTPS destination URLs are accepted. Provider data must be sourced through permitted mechanisms. No scraping/crawling dependency is allowed.

## Privacy

Usage analytics should collect only what is necessary. Sensitive personal data is not required for the MVP.

## Logging

Logs should use event names and operational metadata, not secrets or unnecessary personal data.

## Failure behavior

External provider failure must return a safe fallback or non-destructive error state. The user should still be able to use deterministic content generation.
