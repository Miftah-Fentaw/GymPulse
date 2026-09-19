## MODIFIED Requirements

### Requirement: Environment-based configuration
Runtime configuration SHALL be loaded from the environment into a typed struct and validated at startup. A documented `.env.example` MUST list every variable the server reads, including `DATABASE_URL` and `TEST_DATABASE_URL`. Missing or invalid values MUST fail fast.

This slice MUST load at least: `HTTP_ADDR`, `LOG_LEVEL`, `DATABASE_URL`.

#### Scenario: Start with env
- **WHEN** an operator copies `.env.example`, sets required secrets, and starts the server
- **THEN** the process boots without other config files
- **AND** missing required variables cause a clear startup error

#### Scenario: Missing DATABASE_URL
- **WHEN** the server starts without DATABASE_URL
- **THEN** it exits with a non-zero status and an error naming DATABASE_URL

### Requirement: Native PostgreSQL and Go process
Operators SHALL run PostgreSQL 16+ as a host service and the GymPulse API as a plain Go process (`make dev` via `go run`, or `make run` / `make build`). The repository MUST NOT require Docker or Compose.

#### Scenario: Local run
- **WHEN** an operator has local Postgres 16, a valid `.env`, and runs `make dev`
- **THEN** the API process listens on `HTTP_ADDR`
- **AND** no container runtime is started

### Requirement: Binary deployment
A production deploy SHALL be: build one Go binary (`make build`), provide `DATABASE_URL` to PostgreSQL 16+, run `gympulse migrate up` (or `AUTO_MIGRATE=true` when that flag exists), and run the binary under systemd. An example unit file MUST live in `docs/`.

#### Scenario: systemd
- **WHEN** an operator installs the example unit and environment file
- **THEN** documentation shows `ExecStart` pointing at the gympulse binary
- **AND** `DATABASE_URL` is supplied via the environment file

### Requirement: Health check
The server SHALL expose `GET /health` (liveness, no DB) and `GET /ready` (database ping) so a reverse proxy and operators can probe it. When the readiness ping fails, the server MUST log the underlying error at warn level. The HTTP response MUST NOT include that error string.

#### Scenario: Database up
- **WHEN** the server can ping the database
- **THEN** `/ready` returns success

#### Scenario: Database down
- **WHEN** the database ping fails
- **THEN** `/ready` returns HTTP 503
- **AND** `/health` still returns HTTP 200 if the process is up
- **AND** the process logs the ping error at warn

#### Scenario: Liveness vs readiness
- **WHEN** a client calls `GET /health`
- **THEN** the server returns HTTP 200 if the process is running, without requiring a successful database ping
- **AND** `GET /ready` returns HTTP 200 only when a database ping succeeds, otherwise HTTP 503

### Requirement: Standard pgx pool
The pgx pool SHALL use pgx defaults against PostgreSQL 16+ via DATABASE_URL. Because pgxpool connects lazily, the server MUST ping the database at startup with a short retry/backoff and MUST fail fast if it stays unreachable. A successful start log MUST mean the database answered a ping.

#### Scenario: Runtime query
- **WHEN** DATABASE_URL points at local Postgres and the server handles queries
- **THEN** requests succeed using the default pgx protocol
- **AND** SimpleProtocol workarounds are not used

#### Scenario: Pool is used for readiness
- **WHEN** `/ready` runs
- **THEN** it pings through the same pgx pool used for later request handling

#### Scenario: Unreachable at boot
- **WHEN** the server starts and Postgres does not answer pings within the retry window
- **THEN** the process exits non-zero without serving traffic

### Requirement: Direct session-mode DATABASE_URL
`DATABASE_URL` SHALL be a direct PostgreSQL connection or a session-mode pooler. Transaction-mode poolers MUST NOT be used. Supabase is not a supported deployment target.

#### Scenario: Documented DSN
- **WHEN** an operator reads `.env.example` and deployment docs
- **THEN** DATABASE_URL is described as a direct or session-mode Postgres URL
- **AND** transaction-mode poolers and Supabase are listed as unsupported

#### Scenario: Runtime uses the same URL
- **WHEN** the server opens its pgx pool
- **THEN** it uses DATABASE_URL as a normal Postgres connection string with pgx defaults

### Requirement: Create application database
`gympulse db create` (and `make db-create`) SHALL connect to the maintenance database `postgres` using `DATABASE_URL` credentials and create the target database if it is missing. The operation MUST be idempotent. The role MUST have `CREATEDB`; otherwise the command MUST print a clear error. Documentation MUST show creating the role once with psql.

#### Scenario: Missing database
- **WHEN** an operator runs `gympulse db create` and the target database does not exist
- **THEN** the database is created
- **AND** a later run succeeds without error

#### Scenario: Missing CREATEDB
- **WHEN** the role cannot create databases
- **THEN** the command exits non-zero with a message that names CREATEDB

### Requirement: Isolated test databases
DB tests SHALL use a real local PostgreSQL 16 via `TEST_DATABASE_URL` (CREATEDB). A shared helper MUST create a uniquely named `gympulse_test_*` database, apply embedded migrations, return a pool, and drop the database on cleanup. Idle leftover `gympulse_test_*` databases MUST be dropped. If `TEST_DATABASE_URL` is unset, tests MUST fail with a message explaining how to set it. Tests MUST NOT skip silently and MUST NOT mock SQL.

#### Scenario: Missing TEST_DATABASE_URL
- **WHEN** a DB test runs without TEST_DATABASE_URL
- **THEN** the test fails with a message that includes how to set the variable

#### Scenario: Test isolation
- **WHEN** a DB test runs with a valid TEST_DATABASE_URL
- **THEN** it uses a `gympulse_test_*` database that is dropped after the test

## ADDED Requirements

### Requirement: Structured JSON logging
The server SHALL emit slog JSON logs with a request ID on request logs. Logs MUST NOT include passwords, JWT secrets, or database URLs with credentials.

#### Scenario: Default start logs
- **WHEN** the server starts successfully
- **THEN** it logs listen address and that the database is reachable as JSON
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
