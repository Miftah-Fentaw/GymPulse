## MODIFIED Requirements

### Requirement: Versioned SQL migrations
Schema changes SHALL live as sequential plain-SQL files in `server/migrations/` (for example `0001_init.sql`). Migrations MUST be valid on standard PostgreSQL. They MUST NOT reference `auth.users`, Supabase-only extensions, or Supabase-only functions.

#### Scenario: Fresh database
- **WHEN** migrations are applied to an empty PostgreSQL database
- **THEN** the `gympulse` schema and application tables exist
- **AND** no object was created that requires Supabase

### Requirement: Embedded runner
Migration files SHALL be embedded in the server binary with `go:embed`. A deployed server MUST be able to migrate without a separate SQL checkout.

#### Scenario: Binary carries schema
- **WHEN** an operator runs the migrate command from a release binary
- **THEN** pending embedded migrations apply
- **AND** the process does not read migration files from an external checkout

### Requirement: Migrate subcommand and AUTO_MIGRATE
The server SHALL expose `gympulse migrate up`, `migrate down`, and `migrate status`. When `AUTO_MIGRATE=true`, the server SHALL apply pending migrations on startup before serving traffic.

#### Scenario: Explicit up
- **WHEN** an operator runs `gympulse migrate up` against a reachable session-level database URL
- **THEN** pending migrations are applied
- **AND** status reports them as applied

#### Scenario: Auto migrate on boot
- **WHEN** AUTO_MIGRATE is true and the server starts
- **THEN** pending migrations run before the process accepts API traffic
- **AND** if migrations fail, the process MUST NOT serve the API as healthy

### Requirement: Concurrent migrate safety
Applying migrations from more than one instance at a time SHALL be safe. The runner MUST use PostgreSQL advisory locks (or equivalent session-level locking). Migrations MUST NOT run through a transaction pooler that breaks advisory locks or prepared statements.

#### Scenario: Two instances start together
- **WHEN** two server processes with AUTO_MIGRATE=true start against the same database
- **THEN** exactly one lock holder applies migrations
- **AND** the other waits and then observes a fully migrated schema (or fails closed if it cannot)

### Requirement: Dedicated schema and tracking table
All application tables SHALL live in schema `gympulse`, created with `CREATE SCHEMA IF NOT EXISTS`. The migration tracking table SHALL also live in `gympulse`. The `public` schema MUST NOT hold GymPulse application tables.

#### Scenario: Schema isolation
- **WHEN** the initial migration has run
- **THEN** `\dn` / information_schema shows schema `gympulse`
- **AND** application tables are not created in `public`

### Requirement: RLS enabled without policies
Every application table SHALL have row level security enabled and MUST have no policies in the baseline. The server role MUST be the table owner or a BYPASSRLS role. The system MUST NOT use `FORCE ROW LEVEL SECURITY`. Correctness of authorization MUST still be implemented in Go.

#### Scenario: Anon-style role cannot read
- **WHEN** RLS is enabled with no policies and a non-owner role without BYPASSRLS selects from a table
- **THEN** the select returns no rows or is denied
- **AND** the server owner role can still select and modify rows

### Requirement: Separate migration DSN
The runner SHALL use `MIGRATION_DATABASE_URL` when set, otherwise `DATABASE_URL`. That URL MUST be a direct or session-pooler connection (PostgreSQL port 5432), never the Supabase transaction pooler (port 6543).

#### Scenario: Fallback
- **WHEN** MIGRATION_DATABASE_URL is unset
- **THEN** migrations use DATABASE_URL

#### Scenario: Transaction pooler is not used for migrate
- **WHEN** documentation and config examples describe migrate
- **THEN** they instruct operators to use direct or session pooler (5432)
- **AND** they warn that port 6543 is unsupported for migrations

### Requirement: Optional combined schema dump
The project MAY generate `schema.sql` from the migrations for pasting into a SQL editor. Generated dumps MUST NOT replace the versioned files as the source of truth.

#### Scenario: Dump is convenience only
- **WHEN** a combined schema.sql is produced in CI or via pg_dump --schema-only
- **THEN** operators can apply it manually if they choose
- **AND** the server still migrates from embedded versioned files

## ADDED Requirements

### Requirement: Baseline gym and branch tables
The first migration SHALL create `gympulse.gyms` and `gympulse.branches` with UUID primary keys, timestamps, and `branches.gym_id` referencing `gyms`. Domain tables in later changes MUST attach to these.

#### Scenario: Init migration
- **WHEN** `0001_init.sql` (or equivalent) is applied
- **THEN** `gyms` and `branches` exist in schema `gympulse`
- **AND** each has RLS enabled and no policies
