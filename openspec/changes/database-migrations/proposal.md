## Why

The server can connect to Postgres but cannot build a schema. Self-hosters need embedded migrations, gym/branch baseline, Makefile migrate targets, and a scheduled pg_dump. Caddy and frontend serving wait for admin-app-core.

## What Changes

- Goose Provider API + session locker; embed migrations; `migrate up|down|status`; AUTO_MIGRATE default false; down documented as local-only.
- `gyms` and `branches` in public: UUIDv7 from Go, timestamptz, gym timezone (IANA) and currency (ISO).
- docker-compose adds a scheduled `pg_dump` backup job with retention (keeps existing `server` and `postgres:16`).
- Makefile `migrate-*` targets become real. `.env.example` documents every variable this slice adds.
- Tests via testcontainers-go (Postgres 16).

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `database-migrations`: Embedded goose, default schema, gyms/branches, single DATABASE_URL, forward-only prod.
- `deployment`: Scheduled pg_dump backups.

## Impact

- `server/internal/migrate/`, `server/migrations/0001_init.sql`
- Backup service in docker-compose
- `README.md`, `.env.example`, Makefile `migrate-*`
