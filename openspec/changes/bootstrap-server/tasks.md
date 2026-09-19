## 1. Module layout

- [x] 1.1 Create `server/cmd/gympulse` and `internal/{config,http,db}` so `go run ./cmd/gympulse` is the documented command — verify: `go list ./cmd/gympulse` from `server/`
- [x] 1.2 Remove empty `server/main.go` — verify: default entry is cmd/gympulse

## 2. Config and logging

- [x] 2.1 Parse env into a typed struct with caarlos0/env; fail-fast on missing `DATABASE_URL` — verify: missing DATABASE_URL exits non-zero naming that field
- [x] 2.2 slog JSON with request IDs; never log DB passwords — verify: start log is JSON, includes listen address, omits password; a request log includes request_id
- [x] 2.3 Root `.env.example` lists at least `HTTP_ADDR`, `LOG_LEVEL`, `DATABASE_URL`, and states DATABASE_URL must be direct/session-mode (no transaction-mode poolers, not Supabase) — verify: file exists and contains those notes

## 3. Database pool

- [x] 3.1 `pgxpool` from DATABASE_URL with pgx defaults — verify: no SimpleProtocol workaround
- [x] 3.2 Ping used by readiness — verify: unreachable URL fails ping

## 4. HTTP

- [x] 4.1 `GET /health` 200 without DB — verify: curl 200 with Postgres down
- [x] 4.2 `GET /ready` 200/503 from pool ping — verify: 200 against Postgres 16; 503 when Postgres is stopped
- [x] 4.3 Graceful shutdown on SIGINT/SIGTERM — verify: process exits after Shutdown and pool Close

## 5. OpenAPI and generate

- [x] 5.1 Add `openapi.yaml` (OpenAPI 3.1) skeleton including health/ready and `/v1` (include `POST /v1/echo` so validation is testable) — verify: file parses as OpenAPI 3.1
- [x] 5.2 oapi-codegen chi strict server + request validation middleware wired on `/v1` — verify: `make generate` writes Go files; a spec-invalid `POST /v1/echo` is rejected without invoking the handler
- [x] 5.3 CI job fails when `make generate` produces a Go diff — verify: workflow file exists and the step is present

## 6. Makefile, lint, compose, tests

- [x] 6.1 Root Makefile targets only: `dev`, `test`, `lint`, `generate` (oapi-codegen/Go), `build` — verify: those targets exist; `migrate-*` and TypeScript generate do not
- [x] 6.2 golangci-lint config for the server module — verify: `make lint` runs golangci-lint
- [x] 6.3 docker-compose with only `server` and `postgres:16` — verify: `docker compose config --services` lists exactly those two
- [x] 6.4 testcontainers-go test setup against real Postgres 16 for pool ping and `/ready` — verify: `make test` starts Postgres 16 and does not mock SQL

## 7. Integration verification

- [x] 7.1 `make generate` is clean, then `make lint` and `make test` pass — verify: no git diff after generate; lint and tests exit 0
- [ ] 7.2 `docker compose up`: `/health` OK; `/ready` OK with DB; `/ready` not-ready when postgres is stopped — verify: curl those three states
