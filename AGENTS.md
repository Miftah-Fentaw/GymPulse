# GymPulse

Self-hostable gym management. Spec-driven with OpenSpec.

## Before you change behavior

1. Read `openspec/config.yaml` (project context) and the relevant files under `openspec/specs/`.
2. Every non-trivial change needs an OpenSpec proposal (`proposal.md`, spec deltas, `design.md`, `tasks.md`). Wait for the user to approve before implementing.
3. Keep changes small and independently shippable. Archive when the user confirms the work is done.

## Architecture that you must not violate

- `server/` (Go) is the only database client and the only place authorization is enforced.
- `admin/`, `app/`, and `landing/` are separate frontends. They talk only to the server REST API.
- Never use the Supabase client, Supabase Auth, PostgREST, or Supabase Realtime from a frontend (or from Go). Supabase is hosted Postgres.
- Schema lives in `server/migrations/`, schema `gympulse`, embedded and applied by the server. Identical migrations on plain Postgres and Supabase.
- Backend first: server → admin → PWA → landing.

## OpenSpec commands

| Command | What it does |
|---|---|
| `/opsx-propose` | Create a change and generate planning artifacts |
| `/opsx-explore` | Think through a problem without writing code |
| `/opsx-apply` | Implement tasks from an approved change |
| `/opsx-archive` | Archive a completed change into main specs |

Planning lives in `openspec/changes/<name>/`. Main specs live in `openspec/specs/`.
