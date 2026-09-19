## 1. Goose runner

- [ ] 1.1 goose Provider + Postgres session locker, embed `server/migrations/*.sql` — verify: package compiles and embed includes a `.sql` file
- [ ] 1.2 DATABASE_URL only; version table in public — verify: `goose_db_version` in default schema

## 2. Initial SQL

- [ ] 2.1 `0001_init.sql`: `gyms`, `branches`, UUID PKs no DB default, timestamptz, gym `timezone` and `currency` — verify: apply via testcontainers Postgres 16; insert without id fails
- [ ] 2.2 No custom schema — verify: no `CREATE SCHEMA gympulse`

## 3. CLI and AUTO_MIGRATE

- [ ] 3.1 `gympulse migrate up|down|status` and Makefile `migrate-*` — verify: up then status shows 0001; down works on throwaway DB
- [ ] 3.2 AUTO_MIGRATE default false; true migrates before listen; docs say down is local-only — verify: unset does not migrate; README mentions pg_dump for prod rollback

## 4. Compose and docs

- [ ] 4.1 docker-compose: server, postgres:16, caddy, backup job with retention — verify: `docker compose config` lists those services
- [ ] 4.2 Caddyfile for `api.`, `admin.`, `app.`, and root landing; `.env.example` lists every new variable — verify: files exist and mention the four hostnames

## 5. Tests

- [ ] 5.1 testcontainers-go applies embedded migrations and asserts gyms/branches — verify: `go test` passes with real Postgres 16
