## MODIFIED Requirements

### Requirement: Scheduled database backups
The compose stack SHALL include a scheduled `pg_dump` backup job with retention. Production rollback is restore from those dumps, not `migrate down`.

#### Scenario: Scheduled backups
- **WHEN** the backup service runs
- **THEN** a `pg_dump` of DATABASE_URL is written
- **AND** retention policy deletes dumps older than the configured window
