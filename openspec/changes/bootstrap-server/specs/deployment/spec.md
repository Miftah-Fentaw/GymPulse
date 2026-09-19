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

### Requirement: Compose with server and Postgres
The repository SHALL provide a docker-compose stack whose baseline services are the Go server and PostgreSQL 16. `make dev` SHALL start at least those two services.

#### Scenario: Local compose
- **WHEN** an operator runs `make dev` (or compose up)
- **THEN** Postgres 16 and the server are available
- **AND** the compose file does not require Caddy or a backup job in order to start the API

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
- **AND** SimpleProtocol workarounds are not used

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

## ADDED Requirements

### Requirement: Structured JSON logging
The server SHALL emit slog JSON logs with a request ID on request logs. Logs MUST NOT include passwords, JWT secrets, or database URLs with credentials.

#### Scenario: Default start logs
- **WHEN** the server starts successfully
- **THEN** it logs listen address and that the database pool is open as JSON
- **AND** the log line does not contain the database password

#### Scenario: Request logs include request_id
- **WHEN** the server handles an HTTP request
- **THEN** the request log includes `request_id`
- **AND** the id is taken from an incoming request-id header or generated as UUIDv7

### Requirement: Graceful shutdown
The server SHALL stop accepting new connections on SIGINT/SIGTERM, finish in-flight requests, and close the pgx pool before exit.

#### Scenario: SIGTERM
- **WHEN** the process receives SIGTERM
- **THEN** it shuts down the HTTP server
- **AND** it closes the database pool
