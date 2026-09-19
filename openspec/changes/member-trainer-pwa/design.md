## Context

See proposal.md — Why. React is decided. Check-in token API already exists. Cookies for `app.` → `api.`.

## Goals / Non-Goals

**Goals:**
- React PWA, Workbox shell + last QR, view switch, i18n
- Refresh 60s QR while online; offline shows cached code only

**Non-Goals:**
- Native apps, staff tools, web-push (notifications later)

## Decisions

### Decision 1: Same React stack as admin

TanStack Router, Query, shadcn, api-client, react-i18next.

### Decision 2: Workbox cache list

Precache app shell. Cache last check-in QR asset/data in Cache Storage. Authenticated `/v1/*` network-first and not cached long-term. On logout, delete all caches.

## Risks / Trade-offs

- [Cached QR is static code] → matches checkin-attendance fallback; do not treat as a fresh signed token.

## Migration Plan

Frontend only.

## Open Questions

None.
