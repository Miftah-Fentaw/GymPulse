## Context

See proposal.md — Why. Depends on `bootstrap-server` (pgx pool, env, cmd entrypoint). Goose is the chosen migrator (library, SQL-only, embed.FS, advisory locks, table name configurable).

## Goals / Non-Goals

**Goals:**
- Embedded goose runner, CLI, AUTO_MIGRATE, schema `gympulse`, RLS-on-no-policies, gyms/branches, compose profiles, README DSN notes
- Tests that apply migrations on plain Postgres

**Non-Goals:**
- users/auth tables (next change)
- Generating schema.sql in CI unless cheap; a documented make/script is enough
- Live Supabase in CI (document how; test pooler locally with PgBouncer or a second DSN when available)

## Decisions

### Decision 1: goose library, SQL only

Use `pressly/goose/v3` (or current goose v3 module) with `embed.FS`. Set table to `gympulse.goose_db_version` (create schema first in `0001`). Do not use Go migration functions for DDL.

### Decision 2: Session URL for migrate

`migrate.Run` opens a dedicated `pgx` connection (or `database/sql` + pgx stdlib) from `MIGRATION_DATABASE_URL` or `DATABASE_URL` with a session-safe config. Do not reuse the request pool if that pool is simple-protocol on a transaction pooler—migrations need session + advisory locks. Goose's Postgres dialect uses advisory locks; that requires a real session.

### Decision 3: Baseline tables only gyms and branches

Keep 0001 small. Auth users land in `auth-and-roles`. Enable RLS immediately on these two tables so the pattern is copy-paste for later migrations (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`).

### Decision 4: Compose at repo root

`docker-compose.yml` with profiles `local-db` (postgres + server) and `external-db` (server only). Postgres image official, port 5432, volume, `POSTGRES_DB=gympulse`.

### Decision 5: Search path

Set `search_path` to `gympulse` for the server role in migration or connection (optional `SET search_path`). Prefer fully qualified `gympulse.table` in SQL and sqlc later so we never depend on `public`.

## Risks / Trade-offs

- [goose vs golang-migrate] → goose wins for embed + lock + table name; revisit only if we need cross-language migrate CLI.
- [Supabase CI] → may be unavailable; gate an optional test with `SUPABASE_TEST_URL`.
- [down migrations] → `0001` should have a matching down that drops schema `gympulse` CASCADE only in dev; document that prod down is dangerous.

## Migration Plan

Apply 0001 to empty DBs only at this stage. Rollback: `migrate down` in dev.

## Open Questions

None. Live Supabase verification is manual using the README DSN unless a secret is provided later.
