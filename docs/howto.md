# How-to guide

Practical recipes for GymPulse development. For product overview see the [root README](../README.md). For stack details see [tech-stack.md](tech-stack.md).

---

## First-time machine setup

### 1. Install prerequisites

- Go **1.26+**
- PostgreSQL **16+** (native host install — not Docker)
- Node.js **20+** and **pnpm**
- `make`

### 2. Create the Postgres role

```bash
sudo -u postgres psql -c "CREATE ROLE gympulse LOGIN PASSWORD 'gympulse' CREATEDB;"
sudo -u postgres psql -c "CREATE DATABASE gympulse OWNER gympulse;"
```

Ensure local TCP auth uses `scram-sha-256` (see root README OS notes).

### 3. Configure env

```bash
cp .env.example .env
```

Minimum for local API:

| Variable | Purpose |
|:---|:---|
| `DATABASE_URL` | App DB (direct / session-mode only) |
| `TEST_DATABASE_URL` | Maintenance DB with `CREATEDB` for tests |
| `AUTH_JWT_SECRET` | JWT signing secret |
| `AUTH_COOKIE_SECURE=false` | Local HTTP cookies |
| `CORS_ORIGINS` | Include admin/app origins (e.g. `http://localhost:5173`) |

### 4. Bootstrap

```bash
make generate
make db-create
make migrate-up
make seed
make dev
```

Demo logins: [users.md](../users.md) (password `GymPulse1!`).

---

## How to run the full stack locally

```bash
# Terminal 1 — API
make generate && make migrate-up && make seed && make dev

# Terminal 2 — Admin (http://localhost:5173)
cd packages/api-client && pnpm install && pnpm run generate
cd ../../admin && pnpm install && pnpm run dev
# or: make admin-dev

# Terminal 3 — Member PWA
cd app && pnpm install && pnpm run dev

# Terminal 4 — Landing
cd landing && pnpm install && pnpm run dev
```

Health: `GET /health` (liveness), `GET /ready` (Postgres).

---

## How to change an API endpoint

1. Edit `openapi.yaml`.
2. Run `make generate` (Go + `packages/api-client`).
3. Implement handlers in `server/` (generated strict handlers and/or domain fallback).
4. Consume via `@gympulse/api-client` in admin/app — never hand-roll paths that diverge from the spec.
5. Add/adjust OpenSpec requirements if behavior is user-visible ([openspec.md](openspec.md)).

---

## How to add a database migration

1. Add a new SQL file under `server/migrations/` (goose Up/Down).
2. `make migrate-up` locally.
3. Keep production **forward-only**; rollback via backup restore, not `migrate down`.

```bash
make migrate-status
make migrate-up
make migrate-down   # local only
```

---

## How to re-seed demo data

```bash
make seed
```

Idempotent: resets demo passwords and fills missing demo content. Accounts listed in [users.md](../users.md).

---

## How to test

```bash
# TEST_DATABASE_URL must allow CREATEDB
export TEST_DATABASE_URL=postgres://gympulse:gympulse@localhost:5432/postgres?sslmode=disable
make test
make lint
```

Tests create `gympulse_test_*` databases, migrate, then drop them. Do not mock SQL.

---

## How to build for production

```bash
make generate
make build                 # → server/bin/gympulse
make admin-build           # admin static assets
cd app && pnpm run build
cd landing && pnpm run build
```

Then:

1. Set production `DATABASE_URL`, `AUTH_JWT_SECRET`, `AUTH_COOKIE_SECURE=true`, `CORS_ORIGINS`.
2. `gympulse db create` (if needed) → `gympulse migrate up` (`AUTO_MIGRATE` defaults false).
3. Run the binary under systemd ([systemd/gympulse.service](systemd/gympulse.service)).
4. Put Caddy/nginx in front ([reverse-proxy.md](reverse-proxy.md)).

---

## How to check in a member (desk)

1. Member opens PWA → Check-in → shows QR from `GET /v1/me/checkin-token`.
2. Receptionist opens Admin → Check-in → pastes/scans token + branch → `POST /v1/checkins`.
3. Or staff selects member + branch → `POST /v1/checkins/staff`.

Requires `Idempotency-Key` header on create.

---

## How to verify a screenshot payment

1. Member: Billing → unpaid invoice → Telebirr/CBE → upload screenshot → pending payment.
2. Receptionist: Admin → Billing → pending queue → approve or reject with reason.
3. Approve updates invoice `paid_minor` / status; reject does not.

---

## How to work with OpenSpec

See **[openspec.md](openspec.md)** for propose / apply / archive. Short version:

```bash
# After creating a change with /opsx-propose (or openspec CLI)
openspec list
openspec status --change "<name>" --json
openspec instructions apply --change "<name>" --json
# implement tasks… then /opsx-archive when done
```

---

## Common pitfalls

| Symptom | Likely cause |
|:---|:---|
| `/ready` not ready | Wrong `DATABASE_URL`, Postgres down, or role missing |
| Admin branch dropdown empty | Older bug: list branches required manager; receptionist needs `authGym` — update server |
| Check-in `validation_error` | Empty `branch_id`, missing `Idempotency-Key`, or bad OpenAPI body shape |
| QR check-in forbidden | Token expired (~60s) or wrong gym secret |
| CORS / refresh fails | `CORS_ORIGINS` missing the Vite origin; `AUTH_COOKIE_SECURE=true` on HTTP |
| `make generate` drift | Commit both `openapi.yaml` and generated outputs together |
| Frontend can’t see money rows | Calling DB or a third-party SDK — must use Go API only |
