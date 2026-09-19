## 1. Schema and sqlc

- [ ] 1.1 Migration for `members`, `membership_plans`, `memberships`, and membership event/history as needed, RLS on, FKs to gyms/branches/users — verify: migrate up; tables in `gympulse`
- [ ] 1.2 sqlc queries for create/get/list members and memberships — verify: `sqlc generate` succeeds

## 2. Members API

- [ ] 2.1 Staff create/list/get/update/archive member, gym-scoped, unique email per gym — verify: HTTP tests for create, duplicate 409, other-gym 404/403
- [ ] 2.2 Member `GET /v1/me` (or equivalent) returns own profile only — verify: member cannot GET another member by id

## 3. Plans and memberships

- [ ] 3.1 Owner/manager CRUD plans — verify: receptionist cannot create a plan (403)
- [ ] 3.2 Assign membership; reject a second access-granting membership — verify: service/HTTP test
- [ ] 3.3 Freeze, upgrade, cancel with audit fields; expiry denies access via `MembershipGrantsAccess` — verify: table-driven tests for current, frozen, expired, cancelled

## 4. Integration verification

- [ ] 4.1 Staff create member, assign plan, freeze, cancel, list — verify: `go test` against Postgres
