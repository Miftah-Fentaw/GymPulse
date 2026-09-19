## Context

See proposal.md — Why. `app/` is a Vue 3 Vite scaffold. Apply after server APIs and preferably after admin-app patterns (shared fetch ideas can be copied, not a monorepo package unless we add one later).

## Goals / Non-Goals

**Goals:**
- vite-plugin-pwa, login, member and trainer routes, API client, installability
- Refresh token in memory/body

**Non-Goals:**
- Native iOS/Android wrappers
- Staff features
- Real web-push until notifications change is applied (register UI can wait)

## Decisions

### Decision 1: Same Vue stack as admin

Avoid React/Next. Add vue-router, pinia, tailwind, vite-plugin-pwa.

### Decision 2: Separate deployable

No shared npm workspace required in this change. Duplicate a thin `api.ts` rather than couple builds.

## Risks / Trade-offs

- [Service worker caching API] → do not cache authenticated JSON in SW; network-first for `/v1/*`.

## Migration Plan

Frontend only.

## Open Questions

None.
