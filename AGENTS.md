# GymPulse

Self-hostable gym management. Spec-driven with OpenSpec.

## Before you change behavior

1. Read `openspec/config.yaml` (project context) and the relevant files under `openspec/specs/`.
2. Every non-trivial change needs an OpenSpec proposal. Wait for the user to approve before implementing.
3. Apply changes in the order listed in `openspec/config.yaml`.
4. HTTP changes update `openapi.yaml` and `make generate`.

## Architecture that you must not violate

- `server/` (Go) is the only database client. Authorization is enforced in Go.
- Frontends talk only to the REST API via `packages/api-client` (from `openapi.yaml`).
- PostgreSQL 16+, default schema, single `DATABASE_URL`, UUIDv7 in Go.
- admin/app: React + Vite. landing: Astro with React islands.
- Backend first. Local run: `make generate && make migrate-up && make dev`.

## OpenSpec commands

| Command | What it does |
|---|---|
| `/opsx-propose` | Create a change and generate planning artifacts |
| `/opsx-explore` | Think through a problem without writing code |
| `/opsx-apply` | Implement tasks from an approved change |
| `/opsx-archive` | Archive a completed change into main specs |
