## 1. Assignments

- [ ] 1.1 Migration for `trainer_assignments` with UUID PKs from Go — verify: migrate up
- [ ] 1.2 Owner/manager assign and unassign; receptionist cannot mutate — verify: HTTP 403 for receptionist POST
- [ ] 1.3 Trainer lists only assigned members; GET unassigned is 404/403 — verify: tests
- [ ] 1.4 Cross-gym assign rejected — verify: test

## 2. OpenAPI and integration

- [ ] 2.1 Update `openapi.yaml` for trainer assignments and `make generate` — verify: generate is clean
- [ ] 2.2 Assign, list as trainer, unassign, list empty — verify: `go test` with testcontainers Postgres 16
