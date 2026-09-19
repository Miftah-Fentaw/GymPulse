## 1. Goose runner

- [x] 1.1 goose Provider + Postgres session locker, embed `server/migrations/*.sql` — verify: package compiles and embed includes a `.sql` file
- [x] 1.2 DATABASE_URL only; version table in public — verify: `goose_db_version` in default schema

## 2. Initial SQL

- [x] 2.1 `0001_init.sql`: `gyms`, `branches`, UUID PKs no DB default, timestamptz, gym `timezone` and `currency` — verify: apply via testutil.Pool (TEST_DATABASE_URL); insert without id fails
- [x] 2.2 No custom schema — verify: no `CREATE SCHEMA gympulse`

## 3. CLI and AUTO_MIGRATE

- [x] 3.1 `gympulse migrate up|down|status` apply 0001 — verify: up then status shows 0001; down works on throwaway DB
- [x] 3.2 AUTO_MIGRATE default false; true migrates before listen; docs say down is local-only — verify: unset does not migrate; README mentions pg_dump for prod rollback

## 4. Docs

- [x] 4.1 `docs/backup.md` has pg_dump cron + restore; no compose backup service — verify: file contents; no docker-compose.yml
- [x] 4.2 `.env.example` lists every new variable this slice adds — verify: file contents

## 5. Tests

- [x] 5.1 testutil.Pool applies embedded migrations and asserts gyms/branches — verify: `go test` against local Postgres 16 (TEST_DATABASE_URL); no SQL mocks

## 6. Gym settings schema (MVP)

- [x] 6.1 Branding columns (or table), branch hours, gym holidays in 0001 or 0002 — verify: migrate up; insert hours/holiday/branding without extra changes
