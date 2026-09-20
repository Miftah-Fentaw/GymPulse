## Context

See proposal.md — Why. Extends admin-app-core. React stack is decided.

## Goals / Non-Goals

**Goals:**
- Classes, trainer assignments, reports dashboard
- Keep i18n catalogs; no hard-coded strings

**Non-Goals:**
- PWA, landing, replacing React

## Decisions

### Decision 1: Same app, more TanStack Router routes

Do not split a second admin package.

## Risks / Trade-offs

- [Core loop regressions] → re-click members → pay → check-in.

## Migration Plan

Frontend only.

## Open Questions

None.
