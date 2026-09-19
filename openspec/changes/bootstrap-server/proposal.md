## Why

The repository has an empty Go module and no runnable API. This change ships a server-only skeleton: typed env config, JSON logs, health/ready, pgx, OpenAPI Go codegen, Makefile, compose with Postgres 16, and testcontainers. Frontend workspace, Caddy, and backups are later changes.

## What Changes

- `cmd/gympulse` entrypoint; chi; `GET /health` and `GET /ready` (ready pings the DB).
- Typed env config (caarlos0/env), fail-fast; slog JSON with request IDs; graceful shutdown.
- pgx pool from a direct/session-mode `DATABASE_URL` (pgx defaults). No transaction-mode poolers. Supabase is not a target.
- `openapi.yaml` (OpenAPI 3.1) skeleton including health/ready and `/v1`; oapi-codegen chi strict handlers; request validation middleware.
- Root Makefile: `dev`, `test`, `lint`, `generate` (Go/oapi-codegen only), `build`. No `migrate-*` (those arrive with database-migrations).
- CI check: generated Go is up to date (no diff).
- testcontainers-go tests against real Postgres 16.
- `.env.example`, golangci-lint config, docker-compose with only `server` and `postgres:16`.

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `deployment`: Health, typed env, direct DATABASE_URL, standard pgx, compose with server and Postgres 16.
- `http-api`: OpenAPI skeleton, Go codegen pipeline, validation middleware.

## Impact

- `server/cmd/gympulse/`, `internal/config`, `internal/http`, `internal/db`
- `openapi.yaml`, oapi-codegen output, Makefile, docker-compose, `.env.example`, golangci-lint, CI generate-drift job
