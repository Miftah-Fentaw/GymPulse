## MODIFIED Requirements

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

#### Scenario: README documents Supabase DSNs
- **WHEN** an operator reads the README deploy section
- **THEN** they are told to migrate on port 5432 (direct or session pooler), never 6543
- **AND** they are told that direct connections may be IPv6-only and to use the session pooler when IPv4 is required
