## MODIFIED Requirements

### Requirement: Environment-based configuration
Runtime configuration SHALL be loaded from the environment (12-factor). A documented `.env.example` MUST list every variable the server reads, including `DATABASE_URL`, `MIGRATION_DATABASE_URL`, `AUTO_MIGRATE`, storage, and auth secrets. The process MUST NOT require a vendor-specific config file to start.

This slice MUST document and load at least: `HTTP_ADDR`, `LOG_LEVEL`, `DATABASE_URL`. Variables introduced by later changes MAY be listed as commented placeholders.

#### Scenario: Start with env
- **WHEN** an operator copies `.env.example`, sets DATABASE_URL and required secrets, and starts the server
- **THEN** the process boots without other config files
- **AND** missing required variables cause a clear startup error

#### Scenario: Missing DATABASE_URL
- **WHEN** the server starts without DATABASE_URL
- **THEN** it exits with a non-zero status and an error naming DATABASE_URL

### Requirement: Health check
The server SHALL expose a health endpoint that reports process liveness and database connectivity so compose, reverse proxies, and operators can probe it.

#### Scenario: Database up
- **WHEN** the server can ping the database
- **THEN** the health endpoint returns success

#### Scenario: Database down
- **WHEN** the database ping fails
- **THEN** the health endpoint reports unhealthy
- **AND** a probe can distinguish ready vs not ready if both live and ready are exposed

#### Scenario: Liveness vs readiness
- **WHEN** a client calls `GET /health`
- **THEN** the server returns HTTP 200 if the process is running, without requiring a successful database ping
- **AND** `GET /ready` returns HTTP 200 only when a database ping succeeds, otherwise HTTP 503

### Requirement: Pooler-aware runtime connections
The pgx pool used for request handling SHALL work on a transaction pooler (simple protocol or no cached prepared statements). Migration connections MUST remain session-level as specified in database-migrations.

#### Scenario: Runtime against transaction pooler
- **WHEN** DATABASE_URL points at a transaction-mode pooler and the server handles queries
- **THEN** requests succeed without prepared-statement or advisory-lock errors from pgx

#### Scenario: Pool is used for readiness
- **WHEN** `/ready` runs
- **THEN** it pings through the same pgx pool used for later request handling

## ADDED Requirements

### Requirement: Structured logging
The server SHALL emit structured logs (`slog`) with a level taken from `LOG_LEVEL`. Logs MUST NOT include passwords, JWT secrets, or full database URLs with credentials.

#### Scenario: Default start logs
- **WHEN** the server starts successfully
- **THEN** it logs listen address and that the database pool is open
- **AND** the log line does not contain the database password
