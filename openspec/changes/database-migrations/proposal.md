## Why

The server can connect to Postgres but cannot build a schema. Self-hosters need embedded migrations, gym/branch baseline, and compose with Postgres 16, Caddy, and backups.

## What Changes

- Goose Provider API + session locker; embed migrations; `migrate up|down|status`; AUTO_MIGRATE default false; down documented as local-only.
- `gyms` and `branches` in public: UUIDv7 from Go, timestamptz, gym timezone (IANA) and currency (ISO).
- docker-compose: server, postgres:16, caddy, scheduled pg_dump with retention.
- Makefile migrate targets become real. `.env.example` documents every compose/server variable this slice adds.
- Tests via testcontainers-go (Postgres 16).

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `database-migrations`: Embedded goose, default schema, gyms/branches, single DATABASE_URL, forward-only prod.
- `deployment`: Compose stack with Caddy and scheduled backups.

## Impact

- `server/internal/migrate/`, `server/migrations/0001_init.sql`
- `docker-compose.yml`, `Caddyfile`, backup service
- `README.md`, `.env.example`
