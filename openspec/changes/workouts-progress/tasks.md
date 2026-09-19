## 1. Logs

- [ ] 1.1 Migration for `workout_logs` with RLS — verify: migrate up
- [ ] 1.2 Member create/list/update own logs; cannot write others — verify: HTTP tests
- [ ] 1.3 Progress endpoint returns that member's history only — verify: test
- [ ] 1.4 Trainer read/write assigned clients only — verify: assigned 200, unassigned 403/404

## 2. Integration verification

- [ ] 2.1 Member logs a workout; trainer assigned can read it; unassign then deny — verify: `go test` against Postgres
