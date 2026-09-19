## 1. Schema and booking

- [ ] 1.1 Migration for sessions and bookings with RLS — verify: migrate up
- [ ] 1.2 Staff create/list sessions, gym/branch scoped — verify: HTTP tests
- [ ] 1.3 Member book with capacity lock; full class rejected — verify: concurrent or sequential tests filling capacity
- [ ] 1.4 Member cancel before cutoff; staff cancel anytime; capacity freed — verify: tests
- [ ] 1.5 Expired membership cannot book — verify: uses MembershipGrantsAccess

## 2. Integration verification

- [ ] 2.1 Create session, book, cancel, book again — verify: `go test` against Postgres
