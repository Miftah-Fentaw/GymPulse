## Why

Staff need to click through the daily loop (member, membership, payment, check-in) before classes and reports exist. This change also introduces the frontend workspace: pnpm and the generated TypeScript API client. Static builds are served by a native reverse proxy (Caddy or nginx on the host), not by Compose.

## What Changes

- pnpm workspace (`admin`, `app`, `landing`, `packages/api-client`). Generate TypeScript with openapi-typescript + openapi-fetch. CI fails if TS generate drifts. Extend `make generate` with the TypeScript half.
- Document native Caddy/nginx for `api.`, `admin.`, `app.`, and the site root. Do not add a reverse-proxy process to the repo.
- Replace Vue scaffold in `admin/` with React + Vite + TypeScript (TanStack Router, TanStack Query, Tailwind, shadcn/ui, react-hook-form + zod, react-i18next).
- Core loop screens: members, memberships/plans, invoices/manual payments, check-in, leads.
- Cookie refresh per auth design. English catalogs only (no hard-coded strings).

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `admin-dashboard`: Staff auth, generated client, core staff loop, i18n.
- `http-api`: Shared TypeScript client and TS generate/CI.
- `deployment`: Native reverse proxy documentation.

## Impact

- `pnpm-workspace.yaml`, `packages/api-client`, `docs/reverse-proxy.md`
- Replace Vue scaffold in `admin/` with React
- Depends on billing-payments APIs
