## 1. Module layout

- [ ] 1.1 Create `server/cmd/gympulse` as the process entrypoint and remove or stub the empty `server/main.go` so `go run ./cmd/gympulse` is the documented command — verify: `go list ./cmd/gympulse` succeeds from `server/`
- [ ] 1.2 Add `internal/config`, `internal/http`, `internal/db` packages with empty or minimal files so later domains have a home — verify: `go list ./internal/...` succeeds

## 2. Config and logging

- [ ] 2.1 Load `HTTP_ADDR`, `LOG_LEVEL`, and `DATABASE_URL` from the environment with fail-fast on missing `DATABASE_URL` — verify: running without `DATABASE_URL` exits non-zero and prints that name
- [ ] 2.2 Initialize `slog` from `LOG_LEVEL` and log start without printing DB credentials — verify: a start log line contains the listen address and does not contain the password from `DATABASE_URL`
- [ ] 2.3 Add `server/.env.example` listing at least `HTTP_ADDR`, `LOG_LEVEL`, `DATABASE_URL` — verify: the file exists and mentions those three names

## 3. Database pool

- [ ] 3.1 Open a `pgxpool` from `DATABASE_URL` with simple protocol / no statement cache — verify: the pool config in code sets simple protocol or equivalent; `go test` for the db package compiles
- [ ] 3.2 Expose a `Ping` used by readiness — verify: unit or integration test fails ping when the URL is invalid

## 4. HTTP

- [ ] 4.1 Mount chi with `GET /health` returning 200 without a DB ping — verify: `curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:<port>/health` is `200` with Postgres stopped or URL pointing at a closed port
- [ ] 4.2 Mount `GET /ready` that pings the pool: 200 on success, 503 on failure — verify: 200 against a real Postgres; 503 against a bad URL while the process still serves `/health`

## 5. Integration verification

- [ ] 5.1 `go test ./...` from `server/` passes with the checks above — verify: command exit code 0
