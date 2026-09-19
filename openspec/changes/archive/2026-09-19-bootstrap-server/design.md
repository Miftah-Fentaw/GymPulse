## Context

See proposal.md — Why. Empty `gympulse-server` module. PostgreSQL 16 runs natively. OpenAPI is the HTTP contract from day one. This slice is server-only. No Docker.

## Goals / Non-Goals

**Goals:**
- Boot from typed env, JSON logs + request ID, health/ready, pgx pool, graceful shutdown
- Startup DB ping with retry; log readiness ping errors at warn
- openapi.yaml skeleton + oapi-codegen (chi, strict) + request validation
- Makefile (`dev`, `run`, `test`, `lint`, `generate`, `build`, `migrate-*`, `db-create`)
- Local Postgres tests via TEST_DATABASE_URL
- CI fails if generated Go is dirty

**Non-Goals:**
- Domain tables (`gyms`/`branches` in database-migrations)
- pnpm workspace, `packages/api-client`, TypeScript generate/CI (admin-app-core)
- Shipping a reverse-proxy process (docs only; native Caddy/nginx)
- Docker, Compose, testcontainers
- Auth, frontend screens; do not create or edit `admin/`, `app/`, or `landing/` contents

## Decisions

### Decision 1: chi + oapi-codegen strict

chi matches oapi-codegen's chi server. Strict handlers keep spec and code aligned. Validation middleware rejects spec-invalid `/v1` requests before domain logic. The skeleton includes health, ready, and a small `POST /v1/echo` so validation can be exercised before domain routes exist.

### Decision 2: caarlos0/env

Typed struct, required tags, fail-fast. No Viper.

### Decision 3: slog JSON + request ID

Middleware assigns a request ID (incoming header or generated UUIDv7) and logs JSON. `/health` and `/ready` stay unauthenticated. Logs MUST NOT include passwords, JWT secrets, or DSNs with credentials. Readiness failures log `err` at warn.

### Decision 4: Native process Makefile

`make generate` runs oapi-codegen. `make dev` is `go run` with `.env` loaded. `make db-create` and `migrate-*` wrap the gympulse CLI. No Docker targets. No pnpm files at the repo root.

### Decision 5: Direct session-mode DATABASE_URL

pgx uses DATABASE_URL with default protocol. The URL MUST be a direct Postgres connection or a session-mode pooler. Transaction-mode poolers and Supabase are unsupported. The process pings at startup because the pool is lazy.

### Decision 6: Local Postgres tests

DB tests read `TEST_DATABASE_URL`, create `gympulse_test_*` databases, migrate, and drop. Missing URL fails the test. No database mocks. No containers.

### Decision 7: OpenAPI catalog, generate only implemented ops

`openapi.yaml` lists the product `/v1` catalog (MVP and Later). `oapi-codegen.yaml` `include-operation-ids` is `getHealth`, `getReady`, `postEcho` until each owning change is applied and adds its operationIds plus handlers.

## Risks / Trade-offs

- [Empty migrations] → `/ready` only needs a pingable Postgres 16 until database-migrations adds SQL.
- [Echo probe] → `POST /v1/echo` is a bootstrap validation probe, not a product feature.

## Migration Plan

None.

## Open Questions

None.
