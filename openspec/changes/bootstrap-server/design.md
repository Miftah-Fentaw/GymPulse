## Context

See proposal.md — Why. Empty `gympulse-server` module. PostgreSQL 16 via a direct `DATABASE_URL`. OpenAPI is the HTTP contract from day one. This slice is server-only.

## Goals / Non-Goals

**Goals:**
- Boot from typed env, JSON logs + request ID, health/ready, pgx pool, graceful shutdown
- openapi.yaml skeleton + oapi-codegen (chi, strict) + request validation
- Makefile (`dev`, `test`, `lint`, `generate`, `build`), golangci-lint, compose (`server` + `postgres:16`)
- testcontainers-go against real Postgres 16
- CI fails if generated Go is dirty

**Non-Goals:**
- Domain tables, goose, `migrate-*` (database-migrations)
- pnpm workspace, `packages/api-client`, TypeScript generate/CI (admin-app-core)
- Caddy or static frontend serving (admin-app-core)
- Scheduled `pg_dump` (database-migrations)
- Auth, frontend screens; do not create or edit `admin/`, `app/`, or `landing/` contents

## Decisions

### Decision 1: chi + oapi-codegen strict

chi matches oapi-codegen's chi server. Strict handlers keep spec and code aligned. Validation middleware rejects spec-invalid `/v1` requests before domain logic. The skeleton includes health, ready, and a small `POST /v1/echo` so validation can be exercised before domain routes exist.

### Decision 2: caarlos0/env

Typed struct, required tags, fail-fast. No Viper.

### Decision 3: slog JSON + request ID

Middleware assigns a request ID (incoming header or generated UUIDv7) and logs JSON. `/health` and `/ready` stay unauthenticated. Logs MUST NOT include passwords, JWT secrets, or DSNs with credentials.

### Decision 4: Server-only Makefile and compose

`make generate` runs oapi-codegen only. `make dev` is compose up for `server` and `postgres:16`. `migrate-*`, Caddy, backups, and TypeScript generate are later changes. No pnpm files at the repo root.

### Decision 5: Direct session-mode DATABASE_URL

pgx uses DATABASE_URL with default protocol. The URL MUST be a direct Postgres connection or a session-mode pooler. Transaction-mode poolers and Supabase are unsupported. Readiness pings the same pool.

### Decision 6: testcontainers-go from this slice

DB-touching tests (including `/ready`) use testcontainers-go with Postgres 16. No database mocks.

## Risks / Trade-offs

- [No migrations yet] → `/ready` only needs a pingable empty Postgres 16.
- [Echo probe] → `POST /v1/echo` is a bootstrap validation probe, not a product feature; later domain POSTs reuse the same middleware.

## Migration Plan

None.

## Open Questions

None.
