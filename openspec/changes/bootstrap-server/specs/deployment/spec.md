## MODIFIED Requirements

### Requirement: Environment-based configuration
Runtime configuration SHALL be loaded from the environment into a typed struct and validated at startup. A documented `.env.example` MUST list every variable the server and compose stack read. Missing or invalid values MUST fail fast.

This slice MUST load at least: `HTTP_ADDR`, `LOG_LEVEL`, `DATABASE_URL`. Later variables MAY be commented placeholders.

#### Scenario: Start with env
- **WHEN** an operator copies `.env.example`, sets required secrets, and starts the server
- **THEN** the process boots without other config files
- **AND** missing required variables cause a clear startup error

#### Scenario: Missing DATABASE_URL
- **WHEN** the server starts without DATABASE_URL
- **THEN** it exits with a non-zero status and an error naming DATABASE_URL

### Requirement: Health check
The server SHALL expose `GET /health` (liveness, no DB) and `GET /ready` (database ping) so Caddy and operators can probe it.

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

## ADDED Requirements

### Requirement: Structured JSON logging
The server SHALL emit slog JSON logs with a request ID on request logs. Logs MUST NOT include passwords, JWT secrets, or database URLs with credentials.

#### Scenario: Default start logs
- **WHEN** the server starts successfully
- **THEN** it logs listen address and that the database pool is open as JSON
- **AND** the log line does not contain the database password
