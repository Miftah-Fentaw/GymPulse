## 1. Module layout

- [x] 1.1 Create `server/cmd/gympulse` and `internal/{config,http,db}` so `go run ./cmd/gympulse` is the documented command — verify: `go list ./cmd/gympulse` from `server/`
- [x] 1.2 Remove empty `server/main.go` — verify: default entry is cmd/gympulse

## 2. Config and logging

- [x] 2.1 Parse env into a typed struct with caarlos0/env; fail-fast on missing `DATABASE_URL` — verify: missing DATABASE_URL exits non-zero naming that field
- [x] 2.2 slog JSON with request IDs; never log DB passwords — verify: start log is JSON, includes listen address, omits password; a request log includes request_id
- [x] 2.3 Root `.env.example` lists `HTTP_ADDR`, `LOG_LEVEL`, `DATABASE_URL`, `TEST_DATABASE_URL`, and states DATABASE_URL must be direct/session-mode (no transaction-mode poolers, not Supabase) — verify: file exists and contains those notes

## 3. Database pool

- [x] 3.1 `pgxpool` from DATABASE_URL with pgx defaults — verify: no SimpleProtocol workaround
- [x] 3.2 Ping used by readiness; log the error at warn on failure — verify: unreachable URL fails ping; logs include err
- [x] 3.3 Startup ping with retry/backoff; fail fast if unreachable — verify: process does not serve if Postgres never answers

## 4. HTTP

- [x] 4.1 `GET /health` 200 without DB — verify: 200 when the process is up
- [x] 4.2 `GET /ready` 200/503 from pool ping — verify: 200 against local Postgres 16; 503 when Postgres is stopped
- [x] 4.3 Graceful shutdown on SIGINT/SIGTERM — verify: process exits after Shutdown and pool Close

## 5. OpenAPI and generate

- [x] 5.1 Add `openapi.yaml` (OpenAPI 3.1) skeleton including health/ready and `/v1` (include `POST /v1/echo` so validation is testable) — verify: file parses as OpenAPI 3.1
- [x] 5.2 oapi-codegen chi strict server + request validation middleware wired on `/v1` — verify: `make generate` writes Go files; a spec-invalid `POST /v1/echo` is rejected without invoking the handler
- [x] 5.3 CI job fails when `make generate` produces a Go diff — verify: workflow file exists and the step is present

## 6. Makefile, CLI, tests, docs

- [x] 6.1 Makefile targets: `dev`, `run`, `test`, `lint`, `generate` (oapi-codegen/Go), `build`, `migrate-up`, `migrate-down`, `migrate-status`, `db-create` — verify: those targets exist; no docker/compose targets
- [x] 6.2 golangci-lint config for the server module — verify: `make lint` runs golangci-lint
- [x] 6.3 `gympulse db create` is idempotent against maintenance database `postgres` — verify: command exists; CREATEDB error is explicit
- [x] 6.4 Test helper uses `TEST_DATABASE_URL`, `gympulse_test_*` databases, embedded migrate, drop on cleanup; missing URL fails loudly — verify: helper source; no testcontainers
- [x] 6.5 README (Fedora Postgres, pg_hba scram-sha-256, role snippet), systemd unit, backup and reverse-proxy docs — verify: files exist
- [x] 6.6 Remove Docker: no Dockerfile, compose, or image-build CI — verify: those files are absent

## 7. Integration verification

- [x] 7.1 `make generate` is clean — verify: no git diff after generate
- [ ] 7.2 Run the server locally against local Postgres and verify `/health` and `/ready` (200, then 503 when Postgres is stopped, then 200 again) — verify: curl those states

## 8. HTTP catalog (planning)

- [x] 8.1 Keep planned domain paths in `openapi.yaml` while `oapi-codegen.yaml` `include-operation-ids` is only `getHealth`, `getReady`, `postEcho` until each owning change is applied — verify: `make generate` compiles; yaml contains `/v1/auth/login`
