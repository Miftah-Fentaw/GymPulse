## 1. API

- [ ] 1.1 Owner/manager report endpoints for revenue, churn, active members, attendance; 403 for others — verify: HTTP tests
- [ ] 1.2 Branch filter on attendance and counts — verify: fixture with two branches

## 2. OpenAPI and integration

- [ ] 2.1 Update `openapi.yaml` for report endpoints and `make generate` — verify: generate is clean
- [ ] 2.2 Seed member, payment, check-in; reports match expected totals — verify: `go test` with testcontainers Postgres 16
