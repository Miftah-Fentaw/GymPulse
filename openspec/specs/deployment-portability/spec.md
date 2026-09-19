## Purpose

Run GymPulse on a laptop with Docker Postgres or against any hosted Postgres (including Supabase) by changing environment variables, with the same binary and the same migrations.

## Requirements

### Requirement: Environment-based configuration
Runtime configuration SHALL be loaded from the environment (12-factor). A documented `.env.example` MUST list every variable the server reads, including `DATABASE_URL`, `MIGRATION_DATABASE_URL`, `AUTO_MIGRATE`, storage, and auth secrets. The process MUST NOT require a vendor-specific config file to start.

#### Scenario: Start with env
- **WHEN** an operator copies `.env.example`, sets DATABASE_URL and required secrets, and starts the server
- **THEN** the process boots without other config files
- **AND** missing required variables cause a clear startup error

### Requirement: Compose profiles
The repository SHALL provide docker-compose with a profile that runs a local Postgres container and a profile that does not start Postgres and instead uses an external `DATABASE_URL`. The README MUST document both, including Supabase connection-string rules (session vs transaction pooler, IPv6-only direct connections, IPv4 session pooler).

#### Scenario: Local profile
- **WHEN** an operator starts the local-postgres compose profile
- **THEN** a Postgres instance is available
- **AND** the server can migrate and serve against it

#### Scenario: External profile
- **WHEN** an operator starts the external-database profile with DATABASE_URL pointing at hosted Postgres
- **THEN** compose does not require a local Postgres container
- **AND** the same server image talks to that URL

### Requirement: Health check
The server SHALL expose a health endpoint that reports process liveness and database connectivity so compose, reverse proxies, and operators can probe it.

#### Scenario: Database up
- **WHEN** the server can ping the database
- **THEN** the health endpoint returns success

#### Scenario: Database down
- **WHEN** the database ping fails
- **THEN** the health endpoint reports unhealthy
- **AND** a probe can distinguish ready vs not ready if both live and ready are exposed

### Requirement: Pooler-aware runtime connections
The pgx pool used for request handling SHALL work on a transaction pooler (simple protocol or no cached prepared statements). Migration connections MUST remain session-level as specified in database-migrations.

#### Scenario: Runtime against transaction pooler
- **WHEN** DATABASE_URL points at a transaction-mode pooler and the server handles queries
- **THEN** requests succeed without prepared-statement or advisory-lock errors from pgx

### Requirement: Frontends never touch the database
admin, app, and landing SHALL be configurable with only the server API base URL (and public app settings). They MUST NOT accept a Postgres URL, Supabase URL, or anon key as a required runtime dependency.

#### Scenario: Admin env
- **WHEN** an operator deploys the admin app
- **THEN** configuration is the GymPulse API origin and similar public settings
- **AND** no DATABASE_URL or Supabase anon key is required

### Requirement: Identical binary on Postgres and Supabase
The same server binary and the same frontend builds SHALL run against plain Postgres and against Supabase. Switching providers MUST be env-only.

#### Scenario: Switch DATABASE_URL
- **WHEN** an operator points DATABASE_URL from local Postgres to a Supabase session or direct URL (and MIGRATION_DATABASE_URL accordingly)
- **THEN** migrations and API behavior remain the same
- **AND** no rebuild with different tags is required
