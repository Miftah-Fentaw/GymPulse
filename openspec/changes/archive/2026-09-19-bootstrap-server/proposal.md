## Why

The repository has an empty Go module and no runnable API. This change ships a server-only skeleton: typed env config, JSON logs, health/ready, pgx, OpenAPI Go codegen, Makefile, native local Postgres 16, and a temp-database test helper. No Docker. Frontend workspace and native reverse-proxy docs for static apps are later changes.

## What Changes

- `cmd/gympulse` entrypoint; chi; `GET /health` and `GET /ready` (ready pings the DB; ping failures log at warn).
- Typed env config (caarlos0/env), fail-fast; slog JSON with request IDs; graceful shutdown.
- pgx pool from a direct/session-mode `DATABASE_URL` (pgx defaults). Startup ping with retry; fail fast if unreachable. No transaction-mode poolers. Supabase is not a target.
- `gympulse db create` / `make db-create`; migrate up/down/status against embedded SQL (domain SQL arrives in database-migrations).
- `openapi.yaml` (OpenAPI 3.1) catalog of `/v1` including planned domain paths; oapi-codegen chi strict handlers limited to implemented operationIds (`getHealth`, `getReady`, `postEcho`) until later changes apply; request validation middleware.
- Root Makefile: `dev` (go run + .env), `run`, `test`, `lint`, `generate` (Go/oapi-codegen), `build`, `migrate-*`, `db-create`. No Docker targets.
- Tests against local Postgres 16 via `TEST_DATABASE_URL` and `gympulse_test_*` databases. No mocks, no testcontainers.
- `.env.example`, golangci-lint, README (Fedora), systemd and backup docs.

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `deployment`: Health, typed env, direct DATABASE_URL, standard pgx, native process + Postgres, db create, isolated test databases.
- `http-api`: OpenAPI skeleton, Go codegen pipeline, validation middleware.

## Impact

- `server/cmd/gympulse/`, `internal/config`, `internal/http`, `internal/db`, `internal/migrate`, `internal/testutil`
- `openapi.yaml`, Makefile, `.env.example`, golangci-lint, CI generate-drift job, `README.md`, `docs/`
