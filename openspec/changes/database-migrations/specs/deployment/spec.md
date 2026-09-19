## MODIFIED Requirements

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
