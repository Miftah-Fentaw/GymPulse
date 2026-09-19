## Context

See proposal.md — Why. `admin/` is a Vue 3 + Vite + TS scaffold. Implement only after the matching server APIs exist (auth through classes/billing as needed). Backend-first: do not invent parallel mock backends.

## Goals / Non-Goals

**Goals:**
- Login, router guards, Pinia auth, fetch wrapper, staff pages for members, memberships, check-in, invoices/payments, classes
- Tailwind layout with a sidebar

**Non-Goals:**
- PWA install, trainer views, public landing
- Direct database access

## Decisions

### Decision 1: Stay on Vue 3 + Vite

Matches the existing scaffold and the PWA. Add vue-router, pinia, tailwindcss.

### Decision 2: Cookie refresh when same-site

If admin is served same-site with the API, rely on refresh cookie; still send access JWT in memory. If split origins, use CORS credentials plus explicit refresh body as fallback.

### Decision 3: Incremental pages

Ship login + members first if APIs are ready in that order; do not block the change on reporting/notifications.

## Risks / Trade-offs

- [CORS] → server must allow the admin origin; document env `CORS_ORIGINS` if not already present (add in this change on the server if missing).
- [Token storage] → memory + refresh; avoid localStorage for access tokens if cookie refresh works.

## Migration Plan

Frontend-only plus maybe CORS env. No schema.

## Open Questions

None. Reporting UI can be a follow-up change if reports API is not ready.
