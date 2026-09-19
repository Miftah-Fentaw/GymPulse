## 1. Schema and sqlc

- [ ] 1.1 Migration for `members`, `membership_plans`, `memberships`, `leads` (and membership events as needed), UUID PKs from app — verify: migrate up; tables in default schema
- [ ] 1.2 sqlc queries for members, memberships, leads — verify: `sqlc generate` succeeds

## 2. Members API

- [ ] 2.1 Staff create/list/get/update/archive member, gym-scoped, unique email per gym; attach to existing staff user — verify: HTTP tests for create, duplicate, attach-staff, other-gym 404/403
- [ ] 2.2 Member reads own profile only — verify: member cannot GET another member by id
- [ ] 2.3 Profile photo upload via storage interface — verify: unauthenticated get 401; cross-gym 403

## 3. Plans and memberships

- [ ] 3.1 Owner/manager CRUD plans — verify: receptionist cannot create a plan (403)
- [ ] 3.2 Assign membership; reject a second access-granting membership; freeze/upgrade/cancel; `MembershipGrantsAccess` — verify: table-driven tests

## 4. Leads

- [ ] 4.1 Public POST lead with rate limit; staff list/update/convert — verify: invalid body 400; convert creates member and marks lead

## 5. OpenAPI and integration

- [ ] 5.1 Update `openapi.yaml` for members, plans, memberships, leads and `make generate` — verify: generate is clean
- [ ] 5.2 Staff create member, assign plan, freeze, convert a lead — verify: `go test` with testcontainers Postgres 16
