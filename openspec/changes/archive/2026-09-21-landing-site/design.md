## Context

See proposal.md — Why. Leads API exists. Admin/app are React. Landing is Astro + React islands.

## Goals / Non-Goals

**Goals:**
- Crawlable plans HTML; React island for trial form (and live schedule if needed)
- i18n catalogs; api-client; no credentials

**Non-Goals:**
- SPA landing, CMS, auth cookies

## Decisions

### Decision 1: Astro static/hybrid + React islands

Static HTML for SEO. React islands share form/query patterns with admin/app without making landing a SPA.

### Decision 2: Public GETs

`GET /v1/public/plans` and `GET /v1/public/schedule` if not already in openapi.yaml.

### Decision 3: No credentials

Landing origin is not on the credentialed CORS allowlist.

## Risks / Trade-offs

- [Stale static plans] → rebuild or hybrid for that page.

## Migration Plan

Replace landing tooling. Additive public routes if missing.

## Open Questions

None.
