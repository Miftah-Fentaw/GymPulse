## Purpose

Run GymPulse with docker-compose (server, Postgres 16, Caddy, scheduled backups), env-based config, and HTTPS subdomains.

## Requirements

### Requirement: Environment-based configuration
Runtime configuration SHALL be loaded from the environment into a typed struct and validated at startup. A documented `.env.example` MUST list every variable the server and compose stack read. Missing or invalid values MUST fail fast.

#### Scenario: Start with env
- **WHEN** an operator copies `.env.example`, sets required secrets, and starts the server
- **THEN** the process boots without other config files
- **AND** missing required variables cause a clear startup error

### Requirement: Compose stack
The repository SHALL provide docker-compose services: the Go server, PostgreSQL 16, Caddy, and a scheduled `pg_dump` backup job with retention. Caddy SHALL reverse-proxy `api.` to the server and serve the static admin, app, and landing builds. Subdomains SHALL be `api.`, `admin.`, `app.`, and the root domain for landing. Caddy SHALL obtain automatic HTTPS in production.

#### Scenario: Local compose
- **WHEN** an operator runs `make dev` (or compose up)
- **THEN** Postgres 16, the server, and Caddy are available
- **AND** HTTP to the documented hostnames reaches the API and frontends (placeholders until those apps exist)

#### Scenario: Scheduled backups
- **WHEN** the backup service runs
- **THEN** a `pg_dump` of DATABASE_URL is written
- **AND** retention policy deletes dumps older than the configured window

### Requirement: Health check
The server SHALL expose `GET /health` (liveness, no DB) and `GET /ready` (database ping) so Caddy and operators can probe it.

#### Scenario: Database up
- **WHEN** the server can ping the database
- **THEN** `/ready` returns success

#### Scenario: Database down
- **WHEN** the database ping fails
- **THEN** `/ready` returns HTTP 503
- **AND** `/health` still returns HTTP 200 if the process is up

### Requirement: Standard pgx pool
The pgx pool SHALL use pgx defaults against PostgreSQL 16+ via DATABASE_URL.

#### Scenario: Runtime query
- **WHEN** DATABASE_URL points at compose Postgres and the server handles queries
- **THEN** requests succeed using the default pgx protocol

### Requirement: Frontends never touch the database
admin, app, and landing SHALL be configurable with only the public API origin (and similar public settings). They MUST NOT accept a Postgres URL.

#### Scenario: Admin env
- **WHEN** an operator deploys the admin app
- **THEN** configuration is the GymPulse API origin
- **AND** no DATABASE_URL is required
