## Context

See proposal.md — Why. Empty `gympulse-server` module. PostgreSQL 16 via DATABASE_URL. OpenAPI is the HTTP contract from day one.

## Goals / Non-Goals

**Goals:**
- Boot from typed env, JSON logs + request ID, health/ready, pgx pool
- openapi.yaml skeleton + oapi-codegen + TS client + Makefile + pnpm workspace
- testcontainers-ready layout (DB tests land with migrations)

**Non-Goals:**
- Domain tables, goose, compose/Caddy (database-migrations)
- Auth, frontend screens

## Decisions

### Decision 1: chi + oapi-codegen strict

chi matches oapi-codegen's chi server. Strict handlers keep spec and code aligned. Validation middleware rejects spec-invalid requests before domain logic.

### Decision 2: caarlos0/env

Typed struct, required tags, fail-fast. No Viper.

### Decision 3: slog JSON + request ID

Middleware assigns a request ID (incoming header or generated UUIDv7) and logs JSON. `/health` and `/ready` stay unauthenticated.

### Decision 4: pnpm workspace now, apps later

Scaffold `admin`, `app`, `landing`, `packages/api-client` package.json files so generate has a home. Do not replace Vue HelloWorld with React screens yet—that is admin-app-core / PWA / landing changes. Workspace + generate must work.

### Decision 5: Makefile at repo root

`make generate` runs sqlc (no-op until queries exist), oapi-codegen, and openapi-typescript. `migrate-*` can error with a message until database-migrations lands, or be thin wrappers.

## Risks / Trade-offs

- [Empty sqlc] → generate skips sqlc until queries/ exist.
- [Compose not in this slice] → `/ready` needs an external Postgres 16 for a green ping.

## Migration Plan

None.

## Open Questions

None.
