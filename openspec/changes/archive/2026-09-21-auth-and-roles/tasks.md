## 1. Schema

- [x] 1.1 Migration for `users`, `user_staff_roles`, `refresh_tokens` (hash, family_id, rotated_at) with UUID PKs — verify: migrate up via TEST_DATABASE_URL; insert requires application id
- [x] 1.2 Unique email per gym — verify: duplicate email in one gym fails

## 2. Password and JWT

- [x] 2.1 Hash with argon2id; UUIDv7 ids — verify: login tests; hash is argon2id; ids are v7
- [x] 2.2 Access JWT 15 min via golang-jwt/jwt/v5; claims user_id, gym_id, staff_roles, has_member_profile — verify: unit round-trip; missing AUTH_JWT_SECRET prevents startup

## 3. HTTP

- [x] 3.0 Stage-1 openapi.yaml audit: fix status codes, media types, param types, shared components, enums, CursorPageBase, error envelope — verify: `make generate` produces no diff on health/ready/echo; `openspec validate --all --strict` passes
- [x] 3.1 Document login/refresh/logout/me in `openapi.yaml` and `make generate` — verify: generate has no unexpected diff; handlers are oapi-codegen strict
- [x] 3.2 Login sets host-only refresh cookie for api host; returns access token + capabilities — verify: HTTP test against local Postgres 16 (TEST_DATABASE_URL)
- [x] 3.3 Refresh rotates; reuse of old token revokes the family — verify: third call with first token fails family
- [x] 3.4 Logout revokes; Origin allowlist + `X-GymPulse-Client` on cookie POSTs — verify: landing origin rejected
- [x] 3.5 CORS credentialed allowlist is admin+app only — verify: fixture

## 4. Bootstrap owner

- [x] 4.1 First owner via env when none exists — verify: second bootstrap rejected

## 5. Integration verification

- [ ] 5.1 migrate, bootstrap, login, me, refresh, logout against local Postgres 16 (TEST_DATABASE_URL) — verify: `go test` passes

## 6. Account and staff HTTP (MVP)

- [x] 6.1 `GET/PATCH /v1/me`, password change, forgot/reset, invite/accept — verify: OpenAPI operationIds; handlers after this change is applied
- [x] 6.2 `GET /v1/me/sessions` and revoke; owner/manager revoke-sessions — verify: HTTP tests
- [x] 6.3 Staff list/get/patch/roles/deactivate/reactivate; last owner protected — verify: receptionist cannot invite; last owner cannot be stripped
- [x] 6.4 Login rate limit 429 — verify: excess attempts 429, no user enumeration
- [x] 6.5 Audit events table + `GET /v1/audit-events` for owner/manager — verify: role change creates a row; member 403
- [x] 6.6 Gym/branch settings HTTP: `GET/PATCH /v1/gym`, branding, branches CRUD, hours, holidays — verify: receptionist cannot PATCH gym; member can GET public fields

## 7. Later

- [x] 7.1 Email/phone verification start/confirm — verify: documented Later; token confirm marks verified without blocking MVP login
