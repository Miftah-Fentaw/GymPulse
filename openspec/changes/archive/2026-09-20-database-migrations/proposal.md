## Why

The server can connect to Postgres but cannot build a schema. Self-hosters need embedded migrations, gym/branch baseline, and documented `pg_dump` restore. Docker is not used.

## What Changes

- Goose Provider API + session locker; embed migrations; `migrate up|down|status`; AUTO_MIGRATE default false; down documented as local-only.
- `gyms` and `branches` in public: UUIDv7 from Go, timestamptz, gym timezone (IANA) and currency (ISO), plus branding, branch hours, and holidays columns/tables.
- Documented host `pg_dump` cron and restore (no backup container).
- Tests use the existing `TEST_DATABASE_URL` helper (`gympulse_test_*`).

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `database-migrations`: Embedded goose, default schema, gyms/branches, single DATABASE_URL, forward-only prod.
- `deployment`: Documented pg_dump backups.

## Impact

- `server/migrations/0001_init.sql`
- `docs/backup.md`, `.env.example` if new vars
