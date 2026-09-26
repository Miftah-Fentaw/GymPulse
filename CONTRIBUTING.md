# Contributing to GymPulse

Thanks for contributing. GymPulse is spec-driven: behavior changes go through OpenSpec before code.

## License

By contributing, you agree that your contributions are licensed under the [BSD 2-Clause License](LICENSE).

## Before you start

1. Read [README.md](README.md) for local setup and [docs/](docs/README.md) for deep guides (tech stack, architecture, how-to, OpenSpec).
2. Read [AGENTS.md](AGENTS.md) and `openspec/config.yaml` for architecture rules.
3. Skim current specs under `openspec/specs/`.

### Architecture (do not violate)

- `server/` (Go) is the **only** database client. Authorization is enforced in Go.
- Frontends talk only to the REST API via `packages/api-client` (generated from `openapi.yaml`).
- PostgreSQL 16+, default schema, single `DATABASE_URL`, UUIDv7 in Go.
- No Docker in this repo; Postgres runs on the host.
- admin / app: React + Vite. landing: Vue 3 + Vite.

## Development setup

```bash
cp .env.example .env
# Set DATABASE_URL, TEST_DATABASE_URL, AUTH_JWT_SECRET

make generate
make db-create
make migrate-up
make seed
make dev          # API
make admin-dev    # admin UI (separate terminal)
```

Demo accounts: [users.md](users.md). Tests need a real Postgres 16 (`make test`).

## How we change the product

Non-trivial behavior changes need an OpenSpec proposal **before** implementation.

1. Propose (or discuss): use OpenSpec `/opsx-propose` / `/opsx-explore`, or open an issue describing the change.
2. Wait for maintainer approval of the proposal artifacts under `openspec/changes/<name>/`.
3. Implement with `/opsx-apply` (or follow `tasks.md` in that change).
4. Archive when done: `/opsx-archive`.

### HTTP / API changes

1. Update `openapi.yaml`.
2. Run `make generate` (Go handlers stubs + `packages/api-client`).
3. Implement server logic; frontends use the generated client only.

### Database changes

- Add goose SQL under `server/migrations/`.
- Prefer forward-compatible migrations. `migrate down` is for local use only; production rollback is restore from backup.

## Pull requests

1. Branch from `main`.
2. Keep the PR focused (one change / one OpenSpec change when possible).
3. Include a short summary and how you tested (`make test`, `make lint`, manual check-in/billing paths if relevant).
4. If the change is behavioral, link the OpenSpec change folder or note that it was approved.
5. Do not commit secrets (`.env`), credentials, or large generated binaries.

### Suggested checks before opening a PR

```bash
make generate
make lint
make test
make build
```

For frontend-only work, also build the package you touched (`make admin-build`, or `pnpm run build` in `app/` / `landing/`).

## Code style

- Match surrounding code; prefer small, clear diffs over drive-by refactors.
- Go: `make lint` must pass.
- Do not add frontend DB clients, BaaS SDKs that bypass Go, or Docker-based local stacks.

## Reporting bugs

Open an issue with:

- What you expected vs what happened
- Steps to reproduce
- GymPulse / Go / Postgres / OS versions when relevant
- Logs from the API (redact secrets)

## Questions

Use GitHub issues for design questions and bugs. For large features, start with an OpenSpec proposal rather than a surprise PR.
