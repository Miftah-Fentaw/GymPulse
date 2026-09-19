## Context

See proposal.md — Why. After billing-payments. React is decided. Refresh cookies for `admin.` → `api.`.

## Goals / Non-Goals

**Goals:**
- React shell + core loop using packages/api-client
- i18n English catalogs

**Non-Goals:**
- Classes, trainers, reports (admin-app-complete)
- PWA, landing

## Decisions

### Decision 1: React + Vite + TypeScript

Decided stack. shadcn/ui + Tailwind.

### Decision 2: TanStack Router

Type-safe routes and search params with zod, same family as TanStack Query. React Router would duplicate routing types we already get from TanStack.

### Decision 3: react-i18next

JSON catalogs, English default. No hard-coded UI strings.

### Decision 4: Cookie refresh

`credentials: 'include'` on auth; access JWT in memory.

## Risks / Trade-offs

- [Replacing Vue scaffold] → delete Vue files in admin/.

## Migration Plan

Frontend only.

## Open Questions

None.
