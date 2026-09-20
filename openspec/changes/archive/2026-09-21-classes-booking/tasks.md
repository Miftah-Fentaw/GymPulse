## 1. Schema and booking

- [ ] 1.1 Migration for sessions and bookings with UUID PKs from Go — verify: migrate up
- [ ] 1.2 Staff create/list sessions, gym/branch scoped — verify: HTTP tests
- [ ] 1.3 Member book with capacity lock; full class rejected — verify: concurrent or sequential tests filling capacity
- [ ] 1.4 Member cancel before cutoff; staff cancel anytime; capacity freed — verify: tests
- [ ] 1.5 Expired membership cannot book — verify: uses MembershipGrantsAccess

## 2. OpenAPI and integration

- [ ] 2.1 Update `openapi.yaml` for classes/bookings and `make generate` — verify: generate is clean
- [ ] 2.2 Create session, book, cancel, book again — verify: `go test` against local Postgres 16 (TEST_DATABASE_URL)

## 3. Types, recurrence, waitlist (MVP)

- [ ] 3.1 Class types CRUD — verify: gym-scoped
- [ ] 3.2 Recurring schedules generate sessions — verify: members can book generated sessions
- [ ] 3.3 Waitlist join/leave/list; notify via outbox on free spot — verify: full class waitlist row; capacity unchanged
- [ ] 3.4 Session attendance mark — verify: trainer of session can mark

## 4. Later

- [ ] 4.1 Rooms and equipment — verify: documented Later
