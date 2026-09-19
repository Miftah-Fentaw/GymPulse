## Why

The server can connect to Postgres but cannot build a schema. Self-hosters and Supabase users both need the same embedded migrations, a dedicated `gympulse` schema, and operator-safe migrate/startup paths.

## What Changes

- Add goose as a library, embed `server/migrations/`, and run them via `gympulse migrate up|down|status` and `AUTO_MIGRATE=true`.
- Create schema `gympulse`, put the goose table there, enable RLS with no policies on baseline tables.
- Baseline tables: `gyms` and `branches` (UUID PKs, one gym/one branch is enough to seed later).
- Honor `MIGRATION_DATABASE_URL` (fallback `DATABASE_URL`); document session vs transaction pooler.
- docker-compose profiles: local Postgres vs external `DATABASE_URL`.
- README section for both profiles and Supabase DSN rules.
- Optional note/script for generating `schema.sql` (convenience only).

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `database-migrations`: Implement the embedded runner, schema, RLS baseline, and DSN rules.
- `deployment-portability`: Add compose profiles and README connection guidance.

## Impact

- `server/internal/migrate/`, `server/migrations/0001_init.sql`
- `server/cmd/gympulse` subcommand `migrate`
- `docker-compose.yml` at repo root (or `server/`)
- `README.md`, `.env.example` (`AUTO_MIGRATE`, `MIGRATION_DATABASE_URL`)
- Tests against a plain Postgres container; document/verify pooler constraints
