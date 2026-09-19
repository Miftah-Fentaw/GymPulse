## Why

The repository has an empty Go module and no runnable API. We need a small, shippable server skeleton—config, logs, health, and a pooler-aware database pool—before any schema or domain work.

## What Changes

- Replace the placeholder `server/main.go` with `cmd/gympulse` (serve by default).
- Load 12-factor env config; add `.env.example` for the variables this slice uses.
- Structured logging via `log/slog`.
- HTTP server with chi: `GET /health` (liveness) and `GET /ready` (database ping).
- pgx pool wired from `DATABASE_URL`, using the simple protocol so a transaction pooler is safe.
- No migrations, no domain tables, no auth in this change.

## Capabilities

### New Capabilities

<!-- none — deployment-portability already exists as a main spec -->

### Modified Capabilities

- `deployment-portability`: Make health, env config, and pooler-aware pgx concrete in the running server.

## Impact

- `server/cmd/gympulse/`: new entrypoint
- `server/internal/config/`, `server/internal/http/`, `server/internal/db/`
- `server/go.mod`: chi, pgx
- Root or `server/.env.example` (server variables only)
- Placeholder `server/main.go` removed or reduced to a pointer
