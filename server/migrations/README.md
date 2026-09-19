SQL migrations for GymPulse. Applied with `gympulse migrate up` (embedded in the binary).

`gympulse migrate down` is for local development only. Production rollback is restore from `pg_dump` (see `docs/backup.md`).
