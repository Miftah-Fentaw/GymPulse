## Context

See proposal.md — Why. Depends on bootstrap-server. Goose Provider + session locker. Default schema. UUIDv7 in Go. testcontainers-go for DB tests.

## Goals / Non-Goals

**Goals:**
- Embedded migrate, CLI, AUTO_MIGRATE default false, gyms/branches with timezone+currency, compose with Caddy and backups

**Non-Goals:**
- Auth tables, frontend apps (Caddy may serve placeholders)

## Decisions

### Decision 1: goose Provider + session locker

SQL-only. Version table `goose_db_version` in public.

### Decision 2: Forward-only in production

`migrate down` works locally. README: prod rollback = restore dump.

### Decision 3: Compose services

`server`, `postgres:16`, `caddy`, `backup` (cron/`ofelia`/simple loop). Caddyfile: `api.` reverse_proxy server; `admin.`, `app.`, root serve `./dist-*` or placeholders.

### Decision 4: Gym settings on gyms

`timezone` IANA (e.g. `Africa/Nairobi`), `currency` char(3). Money later uses gym currency.

### Decision 5: testcontainers-go

Migration tests use a real Postgres 16 container. No DB mocks.

## Risks / Trade-offs

- [Caddy HTTPS locally] → HTTP or internal CA in dev; automatic HTTPS in production.

## Migration Plan

0001 on empty DBs. Down local-only.

## Open Questions

None.
