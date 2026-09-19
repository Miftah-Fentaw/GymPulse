## 1. Schema

- [ ] 1.1 Migration for `users`, `user_staff_roles`, `refresh_tokens` (hash, family_id, rotated_at) with UUID PKs — verify: migrate up via testcontainers; insert requires application id
- [ ] 1.2 Unique email per gym — verify: duplicate email in one gym fails

## 2. Password and JWT

- [ ] 2.1 Hash with argon2id; UUIDv7 ids — verify: login tests; hash is argon2id; ids are v7
- [ ] 2.2 Access JWT 15 min via golang-jwt/jwt/v5; claims user_id, gym_id, staff_roles, has_member_profile — verify: unit round-trip; missing AUTH_JWT_SECRET prevents startup

## 3. HTTP

- [ ] 3.1 Document login/refresh/logout/me in `openapi.yaml` and `make generate` — verify: generate has no unexpected diff; handlers are oapi-codegen strict
- [ ] 3.2 Login sets host-only refresh cookie for api host; returns access token + capabilities — verify: HTTP test with testcontainers
- [ ] 3.3 Refresh rotates; reuse of old token revokes the family — verify: third call with first token fails family
- [ ] 3.4 Logout revokes; Origin allowlist + `X-GymPulse-Client` on cookie POSTs — verify: landing origin rejected
- [ ] 3.5 CORS credentialed allowlist is admin+app only — verify: fixture

## 4. Bootstrap owner

- [ ] 4.1 First owner via env when none exists — verify: second bootstrap rejected

## 5. Integration verification

- [ ] 5.1 migrate, bootstrap, login, me, refresh, logout against Postgres 16 (testcontainers) — verify: `go test` passes
