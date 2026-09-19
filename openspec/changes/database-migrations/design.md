## Context

See proposal.md — Why. Depends on bootstrap-server. Goose Provider + session locker. Default schema. UUIDv7 in Go. testcontainers-go for DB tests. Compose already has `server` and `postgres:16`.

## Goals / Non-Goals

**Goals:**
- Embedded migrate, CLI, AUTO_MIGRATE default false, gyms/branches with timezone+currency
- Scheduled `pg_dump` backup job with retention
- Makefile `migrate-*`

**Non-Goals:**
- Auth tables
- Caddy and static frontend serving (admin-app-core)
- pnpm / frontend apps

## Decisions

### Decision 1: goose Provider + session locker

SQL-only. Version table `goose_db_version` in public.

### Decision 2: Forward-only in production

`migrate down` works locally. README: prod rollback = restore dump.

### Decision 3: Backup service only

Add a `backup` compose service (cron/`ofelia`/simple loop). Do not add Caddy in this change.

### Decision 4: Gym settings on gyms

`timezone` IANA (e.g. `Africa/Nairobi`), `currency` char(3). Money later uses gym currency.

### Decision 5: testcontainers-go

Migration tests use a real Postgres 16 container. No DB mocks.

## Risks / Trade-offs

- [No Caddy yet] → operators hit the server port directly until admin-app-core.

## Migration Plan

0001 on empty DBs. Down local-only.

## Open Questions

None.
