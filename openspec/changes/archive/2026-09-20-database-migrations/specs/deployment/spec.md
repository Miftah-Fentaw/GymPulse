## MODIFIED Requirements

### Requirement: Scheduled database backups
Documentation SHALL include a `pg_dump` cron example with retention and restore steps. Production rollback is restore from those dumps, not `migrate down`. The repository MUST NOT ship a backup container.

#### Scenario: Documented dump
- **WHEN** an operator follows backup docs
- **THEN** they can schedule `pg_dump` of `DATABASE_URL`
- **AND** they are told how to restore and that `migrate down` is local-only
