# GymPulse

Self-hostable gym management. The Go server is a plain process. PostgreSQL 16 runs natively on the host. There is no Docker in this repository.

## Requirements

- Go 1.26+
- PostgreSQL 16+
- Node.js 20+ and npm (for the frontend projects)
- `make`

GymPulse does not use Docker. PostgreSQL runs natively on the host.

## PostgreSQL setup

### Fedora

Install and start PostgreSQL 16+:

```bash
sudo dnf install postgresql-server postgresql
sudo postgresql-setup --initdb
sudo systemctl enable --now postgresql
```

Fedora's default `pg_hba.conf` often uses `ident` for local TCP. Password auth from `localhost` needs `scram-sha-256`. Edit `/var/lib/pgsql/data/pg_hba.conf` (path may vary) and change `host` lines for `127.0.0.1/32` and `::1/128` from `ident` or `peer` to `scram-sha-256`, then `sudo systemctl reload postgresql`.

### Ubuntu/Debian

```bash
sudo apt update
sudo apt install postgresql postgresql-client
sudo systemctl enable --now postgresql
```

The configuration is normally under `/etc/postgresql/16/main/`. Update `pg_hba.conf` so local TCP connections use `scram-sha-256`, then run:

```bash
sudo systemctl reload postgresql
```

### macOS

Install PostgreSQL 16 with Homebrew:

```bash
brew install postgresql@16
brew services start postgresql@16
```

Use the same role and database commands below. Windows users should install PostgreSQL 16 from the official installer, ensure the PostgreSQL service is running, and use the same SQL and `.env` configuration.

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
make seed          # demo users — see users.md
make dev           # go run ./cmd/gympulse with .env loaded
```

For a fresh database, the complete backend bootstrap is:

```bash
cp .env.example .env
# Set DATABASE_URL and TEST_DATABASE_URL in .env.
make generate
make db-create
make migrate-up
make seed
make build
make lint
make test
```

Demo accounts (password `GymPulse1!`) are listed in [`users.md`](users.md). Re-run with `make seed`.
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

## Frontend projects

Each frontend is a separate package with its own `node_modules` (no root JS workspace).

```bash
# API (terminal 1)
make generate && make db-create && make migrate-up && make dev

# Admin (terminal 2)
cd packages/api-client && pnpm install && pnpm run generate
cd ../../admin && pnpm install && pnpm run dev
# or: make admin-dev
```

```bash
cd app && pnpm install && pnpm run dev
cd landing && pnpm install && pnpm run dev
```

`make admin-build` for a production admin build. The Go server remains the only database client.

## OpenSpec

Product work is tracked in `openspec/`. Completed changes are stored under `openspec/changes/archive/`; `openspec/specs/` contains the current product specifications. There are currently no active changes.

## Production

1. `make build` → `server/bin/gympulse`
2. Set `DATABASE_URL` to PostgreSQL 16+ (direct or session-mode only)
3. `gympulse db create` if needed, then `gympulse migrate up`. `AUTO_MIGRATE` defaults to false; set `AUTO_MIGRATE=true` only if you want the process to migrate before it listens. `migrate down` is for local development. Production rollback is restore from `pg_dump` (`docs/backup.md`), not `migrate down`.
4. Run the binary under systemd. Example unit: `docs/systemd/gympulse.service`
5. TLS and static frontends: install Caddy or nginx on the host (see `docs/reverse-proxy.md`). The Go process is the API only.
6. Backups: `docs/backup.md` (`pg_dump` cron and restore). Production rollback is restore from dump, not `migrate down`.
