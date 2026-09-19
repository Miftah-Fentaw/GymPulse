## Purpose

The Go server owns schema creation through versioned, embedded SQL migrations on standard PostgreSQL 16 or newer, using the default schema.

## Requirements

### Requirement: Versioned SQL migrations
Schema changes SHALL live as sequential plain-SQL files in `server/migrations/` (for example `0001_init.sql`). Migrations MUST be valid on PostgreSQL 16+. They MUST NOT require non-standard extensions beyond what PostgreSQL 16 ships.

#### Scenario: Fresh database
- **WHEN** migrations are applied to an empty PostgreSQL 16 database
- **THEN** application tables exist in the default schema
- **AND** the server can query them via sqlc + pgx using unqualified table names

### Requirement: Embedded goose Provider
Migration files SHALL be embedded with `go:embed`. The runner SHALL use goose's Provider API with the Postgres session locker so concurrent migrate/AUTO_MIGRATE processes are safe. A deployed server MUST migrate without a separate SQL checkout.

#### Scenario: Binary carries schema
- **WHEN** an operator runs `gympulse migrate up` from a release binary
- **THEN** pending embedded migrations apply
- **AND** the process does not read migration files from an external checkout

#### Scenario: Two instances start together
- **WHEN** two server processes with AUTO_MIGRATE=true start against the same database
- **THEN** the session locker serializes migrate
- **AND** both observe a fully migrated schema (or the loser fails closed if it cannot lock)

### Requirement: Migrate subcommand and AUTO_MIGRATE
The server SHALL expose `gympulse migrate up`, `migrate down`, and `migrate status`. `AUTO_MIGRATE` SHALL default to false. When `AUTO_MIGRATE=true`, the server SHALL apply pending migrations on startup before serving traffic. Production deployments MUST be forward-only: `down` is for local development; production rollback is restore from backup. Documentation MUST say so.

#### Scenario: Explicit up
- **WHEN** an operator runs `gympulse migrate up` against DATABASE_URL
- **THEN** pending migrations are applied
- **AND** status reports them as applied

#### Scenario: Auto migrate off by default
- **WHEN** AUTO_MIGRATE is unset
- **THEN** the server does not apply migrations on boot
- **AND** it still serves if the schema is already current (or reports not-ready if required tables are missing)

#### Scenario: Auto migrate on boot
- **WHEN** AUTO_MIGRATE is true and the server starts
- **THEN** pending migrations run before the process accepts API traffic
- **AND** if migrations fail, the process MUST NOT serve the API as healthy

#### Scenario: Down is documented as local-only
- **WHEN** an operator reads migrate docs
- **THEN** they are told `down` is for local development
- **AND** production rollback is restore from pg_dump, not migrate down

### Requirement: Default schema and tracking table
Application tables and the goose version table SHALL live in the default schema (`public`). The server MUST NOT create a custom application schema and MUST NOT depend on changing `search_path` at runtime.

#### Scenario: No custom schema
- **WHEN** the initial migration has run
- **THEN** application tables are visible as unqualified names in the default schema
- **AND** no `gympulse` schema is required for the app to work

### Requirement: Baseline gym and branch tables
The first migration SHALL create `gyms` and `branches` with UUID primary keys (values supplied by the application as UUIDv7), timestamps, `branches.gym_id` referencing `gyms`, and gym settings for IANA time zone and ISO currency code. Domain tables in later changes MUST attach to these. Timestamps SHALL be `timestamptz`.

#### Scenario: Init migration
- **WHEN** `0001_init.sql` (or equivalent) is applied
- **THEN** `gyms` and `branches` exist
- **AND** inserting a row requires the client to supply `id`
- **AND** a gym row can store `timezone` (IANA) and `currency` (ISO 4217)

### Requirement: Single DATABASE_URL
The runner and the request pool SHALL use the same `DATABASE_URL`. There is no separate migration DSN.

#### Scenario: One URL
- **WHEN** DATABASE_URL points at a reachable PostgreSQL 16 server
- **THEN** `gympulse migrate up` and runtime queries both use that URL
