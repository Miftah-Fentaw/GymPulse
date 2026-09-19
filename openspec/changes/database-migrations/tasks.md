## 1. Goose runner

- [ ] 1.1 Add goose as a module dependency and an `internal/migrate` package that embeds `server/migrations/*.sql` — verify: `go test ./internal/migrate` compiles and `embed` includes at least one `.sql` file
- [ ] 1.2 Point goose's version table at `gympulse.goose_db_version` and use a session-level connection from `MIGRATION_DATABASE_URL` falling back to `DATABASE_URL` — verify: after migrate, the table exists in schema `gympulse` not `public`

## 2. Initial SQL

- [ ] 2.1 Write `0001_init.sql` that creates schema `gympulse`, `gyms`, `branches`, enables RLS with no policies, and uses `gen_random_uuid()` (or equivalent) — verify: applying to empty Postgres creates those objects; `pg_tables` shows them in `gympulse`
- [ ] 2.2 Ensure the SQL has no `auth.users` or Supabase-only objects — verify: `rg -n "auth\\.users|supabase" server/migrations` is empty

## 3. CLI and AUTO_MIGRATE

- [ ] 3.1 Implement `gympulse migrate up|down|status` — verify: `up` then `status` shows 0001 applied; `down` removes it on a throwaway DB
- [ ] 3.2 When `AUTO_MIGRATE=true`, run pending migrations before the HTTP server listens; abort listen on failure — verify: test or manual run shows `/health` is not served if migrate fails; success path serves after migrate

## 4. Compose and docs

- [ ] 4.1 Add docker-compose profiles for local Postgres and external DATABASE_URL — verify: `docker compose --profile local-db config` includes a postgres service; `external-db` does not require that service
- [ ] 4.2 Document both profiles, `AUTO_MIGRATE`, `MIGRATION_DATABASE_URL`, port 5432 vs 6543, and IPv6/session-pooler notes in README and `.env.example` — verify: README contains `6543`, `5432`, and `MIGRATION_DATABASE_URL`

## 5. Tests

- [ ] 5.1 Integration test: apply embedded migrations to a plain Postgres (testcontainer or compose) and assert schema, tables, RLS enabled — verify: `go test` with the DB tag/env passes
- [ ] 5.2 Document or test that migrate must not use a transaction pooler; if a pooler DSN is available, assert migrate is configured off that URL — verify: test or README checklist item exists and is checked in review
