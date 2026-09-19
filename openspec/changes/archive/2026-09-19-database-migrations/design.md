## Context

See proposal.md — Why. Depends on bootstrap-server (migrate CLI, db create, test helper). Goose Provider + session locker. Default schema. UUIDv7 in Go. Local Postgres 16 via TEST_DATABASE_URL. No Compose.

## Goals / Non-Goals

**Goals:**
- Embedded migrate, AUTO_MIGRATE default false, gyms/branches with timezone+currency
- Documented `pg_dump` backup and restore
- Use existing `make migrate-*` / `gympulse db create` / test helper

**Non-Goals:**
- Auth tables
- Docker/Compose
- Shipping a reverse-proxy process

## Decisions

### Decision 1: goose Provider + session locker

SQL-only. Version table `goose_db_version` in public.

### Decision 2: Forward-only in production

`migrate down` works locally. README: prod rollback = restore dump.

### Decision 3: Backups are host cron

Document `pg_dump` in `docs/backup.md`. No backup service in the repo.

### Decision 4: Gym settings on gyms

`timezone` IANA (e.g. `Africa/Nairobi`), `currency` char(3). Money later uses gym currency.

### Decision 5: Local Postgres tests

Migration tests use `testutil.Pool` (TEST_DATABASE_URL, `gympulse_test_*`). No DB mocks. No containers.

## Risks / Trade-offs

- [No reverse proxy in-repo] → operators hit `HTTP_ADDR` directly or install Caddy/nginx on the host.

## Migration Plan

0001 on empty DBs. Down local-only.

## Open Questions

None.
