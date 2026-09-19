## Purpose

Run GymPulse with docker-compose, env-based config, and HTTPS subdomains. The Go server is the only database client. PostgreSQL 16 is required. Supabase is not a supported target.

## Requirements

### Requirement: Environment-based configuration
Runtime configuration SHALL be loaded from the environment into a typed struct and validated at startup. A documented `.env.example` MUST list every variable the server and compose stack read. Missing or invalid values MUST fail fast.

#### Scenario: Start with env
- **WHEN** an operator copies `.env.example`, sets required secrets, and starts the server
- **THEN** the process boots without other config files
- **AND** missing required variables cause a clear startup error

### Requirement: Compose with server and Postgres
The repository SHALL provide a docker-compose stack whose baseline services are the Go server and PostgreSQL 16. `make dev` SHALL start at least those two services.

#### Scenario: Local compose
- **WHEN** an operator runs `make dev` (or compose up)
- **THEN** Postgres 16 and the server are available
- **AND** the compose file does not require Caddy or a backup job in order to start the API

### Requirement: Caddy reverse proxy
The compose stack SHALL include Caddy once frontend apps exist. Caddy SHALL reverse-proxy `api.` to the server and serve the static admin, app, and landing builds. Subdomains SHALL be `api.`, `admin.`, `app.`, and the root domain for landing. Caddy SHALL obtain automatic HTTPS in production.

#### Scenario: Hostnames
- **WHEN** an operator runs compose with Caddy enabled
- **THEN** HTTP to the documented hostnames reaches the API and frontends

### Requirement: Scheduled database backups
The compose stack SHALL include a scheduled `pg_dump` backup job with retention. Production rollback is restore from those dumps, not `migrate down`.

#### Scenario: Scheduled backups
- **WHEN** the backup service runs
- **THEN** a `pg_dump` of DATABASE_URL is written
- **AND** retention policy deletes dumps older than the configured window

### Requirement: Health check
The server SHALL expose `GET /health` (liveness, no DB) and `GET /ready` (database ping) so the reverse proxy and operators can probe it.

#### Scenario: Database up
- **WHEN** the server can ping the database
- **THEN** `/ready` returns success

#### Scenario: Database down
- **WHEN** the database ping fails
- **THEN** `/ready` returns HTTP 503
- **AND** `/health` still returns HTTP 200 if the process is up

#### Scenario: Liveness vs readiness
- **WHEN** a client calls `GET /health`
- **THEN** the server returns HTTP 200 if the process is running, without requiring a successful database ping
- **AND** `GET /ready` returns HTTP 200 only when a database ping succeeds, otherwise HTTP 503

### Requirement: Standard pgx pool
The pgx pool SHALL use pgx defaults against PostgreSQL 16+ via DATABASE_URL.

#### Scenario: Runtime query
- **WHEN** DATABASE_URL points at compose Postgres and the server handles queries
- **THEN** requests succeed using the default pgx protocol

#### Scenario: Pool is used for readiness
- **WHEN** `/ready` runs
- **THEN** it pings through the same pgx pool used for later request handling

### Requirement: Direct session-mode DATABASE_URL
`DATABASE_URL` SHALL be a direct PostgreSQL connection or a session-mode pooler. Transaction-mode poolers MUST NOT be used. Supabase is not a supported deployment target.

#### Scenario: Documented DSN
- **WHEN** an operator reads `.env.example` and deployment docs
- **THEN** DATABASE_URL is described as a direct or session-mode Postgres URL
- **AND** transaction-mode poolers and Supabase are listed as unsupported

#### Scenario: Runtime uses the same URL
- **WHEN** the server opens its pgx pool
- **THEN** it uses DATABASE_URL as a normal Postgres connection string with pgx defaults

### Requirement: Frontends never touch the database
admin, app, and landing SHALL be configurable with only the public API origin (and similar public settings). They MUST NOT accept a Postgres URL.

#### Scenario: Admin env
- **WHEN** an operator deploys the admin app
- **THEN** configuration is the GymPulse API origin
- **AND** no DATABASE_URL is required
