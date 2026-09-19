## 1. Module layout

- [ ] 1.1 Create `server/cmd/gympulse` and `internal/{config,http,db}` so `go run ./cmd/gympulse` is the documented command — verify: `go list ./cmd/gympulse` from `server/`
- [ ] 1.2 Remove or stub empty `server/main.go` — verify: default entry is cmd/gympulse

## 2. Config and logging

- [ ] 2.1 Parse env into a typed struct with caarlos0/env; fail-fast on missing `DATABASE_URL` — verify: missing DATABASE_URL exits non-zero naming that field
- [ ] 2.2 slog JSON with request IDs; never log DB passwords — verify: start log is JSON, includes listen address, omits password; a request log includes request_id
- [ ] 2.3 Root `.env.example` lists at least `HTTP_ADDR`, `LOG_LEVEL`, `DATABASE_URL` — verify: file exists

## 3. Database pool

- [ ] 3.1 `pgxpool` from DATABASE_URL with pgx defaults — verify: no SimpleProtocol workaround
- [ ] 3.2 Ping used by readiness — verify: bad URL fails ping

## 4. HTTP health

- [ ] 4.1 `GET /health` 200 without DB — verify: curl 200 with Postgres down
- [ ] 4.2 `GET /ready` 200/503 from pool ping — verify: 200 against Postgres 16; 503 on bad URL

## 5. OpenAPI and generate

- [ ] 5.1 Add `openapi.yaml` (OpenAPI 3.1) skeleton including health/ready and `/v1` placeholder — verify: file parses as OpenAPI 3.1
- [ ] 5.2 oapi-codegen chi strict server + request validation middleware wired on `/v1` — verify: `make generate` writes Go files; a spec-invalid `/v1` request (once a POST exists, or a documented dummy) is rejected
- [ ] 5.3 Generate `packages/api-client` with openapi-typescript + openapi-fetch — verify: generate writes TS types
- [ ] 5.4 CI job fails when `make generate` produces a diff — verify: workflow file exists and the step is present

## 6. Makefile and pnpm workspace

- [ ] 6.1 Root Makefile targets: `dev`, `test`, `lint`, `generate`, `migrate-up`, `migrate-down`, `migrate-status`, `build` — verify: `make generate` and `make lint` exist (`migrate-*` may stub until next change)
- [ ] 6.2 pnpm workspace covering `admin`, `app`, `landing`, `packages/api-client` — verify: `pnpm-workspace.yaml` lists them; `pnpm install` works (packages may be placeholders)

## 7. Integration verification

- [ ] 7.1 `go test ./...` from `server/` passes — verify: exit 0
