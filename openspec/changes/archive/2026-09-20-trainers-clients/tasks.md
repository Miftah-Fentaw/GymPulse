## 1. Assignments

- [ ] 1.1 Migration for `trainer_assignments` with UUID PKs from Go — verify: migrate up
- [ ] 1.2 Owner/manager assign and unassign; receptionist cannot mutate — verify: HTTP 403 for receptionist POST
- [ ] 1.3 Trainer lists only assigned members; GET unassigned is 404/403 — verify: tests
- [ ] 1.4 Cross-gym assign rejected — verify: test

## 2. OpenAPI and integration

- [ ] 2.1 Update `openapi.yaml` for trainer assignments and `make generate` — verify: generate is clean
- [ ] 2.2 Assign, list as trainer, unassign, list empty — verify: `go test` against local Postgres 16 (TEST_DATABASE_URL)

## 3. Profile, PT, notes (MVP)

- [ ] 3.1 Trainer profile GET/PATCH — verify: receptionist cannot patch others
- [ ] 3.2 Availability PUT + PT session book/cancel with overlap rejection — verify: second slot booking 409
- [ ] 3.3 Trainer notes on assigned clients — verify: member 403; unassigned trainer 403

## 4. Later

- [ ] 4.1 Commission report — verify: documented Later
