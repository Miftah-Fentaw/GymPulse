## Context

See proposal.md — Why. After billing-payments. React is decided. Refresh cookies for `admin.` → `api.`. Bootstrap shipped Go-only generate and compose without Caddy.

## Goals / Non-Goals

**Goals:**
- pnpm workspace + `packages/api-client` from openapi.yaml
- Caddy serving api/admin/app/landing hostnames
- React admin shell + core loop using packages/api-client
- i18n English catalogs

**Non-Goals:**
- Classes, trainers, reports (admin-app-complete)
- PWA (member-trainer-pwa) and Astro landing (landing-site) feature work beyond placeholders Caddy can serve
- Database backups (already database-migrations)

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

### Decision 6: Caddy here

Compose adds `caddy`. Caddyfile: `api.` reverse_proxy server; `admin.`, `app.`, root serve built static assets or placeholders.

## Risks / Trade-offs

- [Replacing Vue scaffold] → delete Vue files in admin/.

## Migration Plan

Frontend workspace + Caddy + admin core loop.

## Open Questions

None.
