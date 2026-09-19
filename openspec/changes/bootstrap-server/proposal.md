## Why

The repository has an empty Go module and no runnable API. We need a shippable skeleton: config, JSON logs, health, pgx, OpenAPI codegen, Makefile, and a pnpm workspace—before schema or domain work.

## What Changes

- `cmd/gympulse` entrypoint; chi; `GET /health` and `GET /ready`.
- Typed env config (caarlos0/env), fail-fast; slog JSON with request IDs.
- pgx pool from `DATABASE_URL` (pgx defaults).
- `openapi.yaml` (OpenAPI 3.1) skeleton including health/ready; oapi-codegen chi strict handlers; request validation middleware.
- `packages/api-client` generation (openapi-typescript + openapi-fetch).
- Root Makefile (`dev`, `test`, `lint`, `generate`, `migrate-*`, `build`) and pnpm workspace scaffolding for admin, app, landing, packages/api-client. No frontend feature screens.
- CI check: generate is clean (no diff).
- `.env.example` for variables this slice uses.

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `deployment`: Health, typed env config, standard pgx.
- `http-api`: OpenAPI skeleton, codegen pipeline, validation middleware, shared TS client.

## Impact

- `server/cmd/gympulse/`, `internal/config`, `internal/http`, `internal/db`
- `openapi.yaml`, generate scripts, `packages/api-client`
- `Makefile`, `pnpm-workspace.yaml`, placeholder packages
- CI workflow for generate drift
