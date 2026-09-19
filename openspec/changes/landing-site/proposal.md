## Why

A deployed gym needs a crawlable public site. Astro with React islands for the live trial form and schedule.

## What Changes

- Replace landing scaffold with Astro (static/hybrid) + React islands.
- Public pages; trial POST via packages/api-client; i18n catalogs.
- Public GET plans/schedule in openapi.yaml if missing.
- No auth cookies.

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `landing-site`: Astro SEO delivery, public pages, trial signup, no privileged API, i18n.

## Impact

- `landing/` Astro app
- Optional public routes + generate
