## Context

See proposal.md — Why. `server/` is an empty `gympulse-server` module (`go 1.26`) and `main.go`. OpenSpec and architecture rules live at the repo root.

## Goals / Non-Goals

**Goals:**
- A process that boots from env, logs, serves health/ready, and holds a pgx pool
- Safe by default on a transaction pooler
- Layout that later domains can plug into (`internal/<domain>`)

**Non-Goals:**
- Migrations, schema, goose, AUTO_MIGRATE
- Auth, JWT, any domain API
- docker-compose (next change)
- Frontends

## Decisions

### Decision 1: chi, not gin or stdlib-only

chi stays on `net/http`, composes middleware explicitly, and does not pull an ORM or validator stack. Handlers stay ordinary `http.Handler`s.

### Decision 2: pgxpool with simple protocol

Set `DefaultQueryExecMode` to `QueryExecModeSimpleProtocol` (or disable prepared statement cache) on the runtime pool so PgBouncer transaction mode and Supabase port 6543 work. Do not run advisory locks on this pool.

### Decision 3: `/health` vs `/ready`

Liveness is process-up; readiness is DB ping. Split endpoints so an orchestrator can restart vs wait. Both are unauthenticated.

### Decision 4: `cmd/gympulse` as the only main

Keep a single binary. `serve` is the default action. `migrate` is added in the next change as a subcommand on the same binary (flag or `os.Args`—prefer a small stdlib/cobra-free switch unless cobra is already justified). Prefer a tiny `switch` on `os.Args` over Cobra for two commands.

### Decision 5: Config package

Plain env with `os.Getenv` and documented defaults (`HTTP_ADDR=:8080`, `LOG_LEVEL=info`). Fail fast on missing `DATABASE_URL`. Do not use Viper.

## Risks / Trade-offs

- [Empty module path `gympulse-server`] → Fine for now; rename only if we publish a module.
- [Ready check on pooler] → A ping (`SELECT 1`) is enough; avoid prepared statements.
- [No compose yet] → Local `DATABASE_URL` must point at an already running Postgres for `/ready` to pass.

## Migration Plan

None. Additive skeleton. Rollback is revert the change.

## Open Questions

None for this slice. Compose profiles wait for `database-migrations`.
