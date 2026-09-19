## 1. Logs

- [ ] 1.1 Migration for `workout_logs` with UUID PKs from Go — verify: migrate up
- [ ] 1.2 Member create/list/update own logs; cannot write others — verify: HTTP tests
- [ ] 1.3 Progress endpoint returns that member's history only — verify: test
- [ ] 1.4 Trainer read/write assigned clients only — verify: assigned 200, unassigned 403/404
- [ ] 1.5 Progress photos via storage for the member and assigned trainer — verify: unassigned trainer 403; unauthenticated 401

## 2. OpenAPI and integration

- [ ] 2.1 Update `openapi.yaml` for workouts/progress photos and `make generate` — verify: generate is clean
- [ ] 2.2 Member logs a workout; trainer assigned can read it; unassign then deny — verify: `go test` with testcontainers Postgres 16
