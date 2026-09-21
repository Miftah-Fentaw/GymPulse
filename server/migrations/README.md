# GymPulse database migrations

SQL migrations are embedded into the Go binary and applied with `gympulse migrate up`.

## Local workflow

From the repository root:

```bash
make db-create
make migrate-up
make migrate-status
```

The current migration set is:

1. `0001_init.sql` - gyms, branches, hours, and holidays
2. `0002_auth.sql` - users, roles, refresh tokens, and auth tokens
3. `0003_auth_audit_outbox.sql` - audit and outbox records
4. `0004_members_memberships_leads.sql` - members, plans, memberships, and leads
5. `0005_backend_domains.sql` - files, attendance, billing, classes, trainers, and workouts
6. `0006_backend_completion.sql` - refunds, invoice adjustments, trainer availability, and workout attachments

Tests use `TEST_DATABASE_URL` to create temporary `gympulse_test_*` databases. The test role needs `CREATEDB` and `CREATE` on the `public` schema in PostgreSQL's `template1` database.

`gympulse migrate down` is for local development only. Production rollback is restore from `pg_dump`; see `docs/backup.md`.
