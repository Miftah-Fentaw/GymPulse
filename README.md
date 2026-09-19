# GymPulse

Self-hostable gym management. The Go server is a plain process. PostgreSQL 16 runs natively on the host. There is no Docker in this repository.

## Local setup (Fedora)

Install and start PostgreSQL 16+:

```bash
sudo dnf install postgresql-server postgresql
sudo postgresql-setup --initdb
sudo systemctl enable --now postgresql
```

Fedora's default `pg_hba.conf` often uses `ident` for local TCP. Password auth from `localhost` needs `scram-sha-256`. Edit `/var/lib/pgsql/data/pg_hba.conf` (path may vary) and change `host` lines for `127.0.0.1/32` and `::1/128` from `ident` or `peer` to `scram-sha-256`, then `sudo systemctl reload postgresql`.

Create the role once (superuser / postgres OS user). The application role needs `CREATEDB` so `make db-create` and tests can create databases:

```bash
sudo -u postgres psql -c "CREATE ROLE gympulse LOGIN PASSWORD 'gympulse' CREATEDB;"
sudo -u postgres psql -c "CREATE DATABASE gympulse OWNER gympulse;"
```

If the role already exists, `CREATEDB` is:

```bash
sudo -u postgres psql -c "ALTER ROLE gympulse CREATEDB;"
```

`make db-create` is idempotent: it connects to the maintenance database `postgres` with `DATABASE_URL` credentials and creates the target database if it is missing.

## Configure and run

```bash
cp .env.example .env
# DATABASE_URL and TEST_DATABASE_URL must be a direct or session-mode
# Postgres URL. Do not use a transaction-mode pooler. Supabase is not supported.

make generate
make db-create
make migrate-up
make dev          # go run ./cmd/gympulse with .env loaded
```

`GET /health` is liveness (no DB). `GET /ready` pings Postgres. If readiness fails, the process logs the underlying error at warn; the HTTP body stays `{ "status": "not_ready" }`.

Other targets: `make run` (built `server/bin/gympulse`), `make lint`, `make test`, `make build`, `make migrate-down`, `make migrate-status`.

## Tests

Tests use a real local PostgreSQL 16. They do not mock SQL and do not start containers.

```bash
# TEST_DATABASE_URL must allow CREATEDB (maintenance DB name is usually postgres)
export TEST_DATABASE_URL=postgres://gympulse:gympulse@localhost:5432/postgres?sslmode=disable
make test
```

If `TEST_DATABASE_URL` is unset, DB tests fail with a message explaining how to set it. Each DB test creates a `gympulse_test_*` database, applies embedded migrations, and drops it on cleanup. Idle leftover `gympulse_test_*` databases from crashed runs are dropped first.

## Production

1. `make build` → `server/bin/gympulse`
2. Set `DATABASE_URL` to PostgreSQL 16+ (direct or session-mode only)
3. `gympulse db create` if needed, then `gympulse migrate up`. `AUTO_MIGRATE` defaults to false; set `AUTO_MIGRATE=true` only if you want the process to migrate before it listens. `migrate down` is for local development. Production rollback is restore from `pg_dump` (`docs/backup.md`), not `migrate down`.
4. Run the binary under systemd. Example unit: `docs/systemd/gympulse.service`
5. TLS and static frontends: install Caddy or nginx on the host (see `docs/reverse-proxy.md`). The Go process is the API only.
6. Backups: `docs/backup.md` (`pg_dump` cron and restore). Production rollback is restore from dump, not `migrate down`.
