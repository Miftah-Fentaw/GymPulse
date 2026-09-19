## 1. API

- [ ] 1.1 Owner/manager report endpoints for revenue, churn, active members, attendance; 403 for others — verify: HTTP tests
- [ ] 1.2 Branch filter on attendance and counts — verify: fixture with two branches

## 2. OpenAPI and integration

- [ ] 2.1 Update `openapi.yaml` for report endpoints and `make generate` — verify: generate is clean
- [ ] 2.2 Seed member, payment, check-in; reports match expected totals — verify: `go test` against local Postgres 16 (TEST_DATABASE_URL)

## 3. Extra reports (MVP)

- [ ] 3.1 Signups and class utilization endpoints — verify: receptionist 403
- [ ] 3.2 Report export csv/json — verify: trainer 403
