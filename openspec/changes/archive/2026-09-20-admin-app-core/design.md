## Context

See proposal.md — Why. After billing-payments. React is decided. Refresh cookies for `admin.` → `api.` behind a host reverse proxy. Bootstrap shipped Go-only generate and a native Go process.

## Goals / Non-Goals

**Goals:**
- pnpm workspace + `packages/api-client` from openapi.yaml
- Document native Caddy or nginx for api/admin/app/landing
- React admin shell + core loop using packages/api-client
- i18n English catalogs

**Non-Goals:**
- Classes, trainers, reports (admin-app-complete)
- PWA and Astro landing feature work
- Docker/Compose
- Embedding a static file server in Go (keep the API process API-only)

## Decisions

### Decision 1: React + Vite + TypeScript

Decided stack. shadcn/ui + Tailwind.

### Decision 2: TanStack Router

Type-safe routes and search params with zod, same family as TanStack Query. React Router would duplicate routing types we already get from TanStack.

### Decision 3: react-i18next

JSON catalogs, English default. No hard-coded UI strings.

### Decision 4: Cookie refresh

`credentials: 'include'` on auth; access JWT in memory.

### Decision 5: pnpm + generated TS client here

`make generate` gains openapi-typescript + openapi-fetch. CI checks TS drift. Do not add this in bootstrap-server.

### Decision 6: Native reverse proxy

Operators install Caddy or nginx on the host. Example config lives in `docs/reverse-proxy.md`. The Go server does not serve SPA files.

## Risks / Trade-offs

- [Replacing Vue scaffold] → delete Vue files in admin/.

## Migration Plan

Frontend workspace + admin core loop.

## Open Questions

None.
