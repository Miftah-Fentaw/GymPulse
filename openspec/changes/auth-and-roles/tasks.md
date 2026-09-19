## 1. Schema

- [ ] 1.1 Add a migration for `users` and `refresh_tokens` in schema `gympulse` with RLS enabled and no policies — verify: migrate up on empty+0001 DB; tables exist; RLS on
- [ ] 1.2 Unique email per gym (or globally if emails are the login key—document the choice as unique per gym) — verify: inserting two users with the same email in one gym fails

## 2. Password and JWT

- [ ] 2.1 Hash passwords with argon2id or bcrypt; reject login on mismatch with a generic error — verify: tests for correct login, wrong password, unknown email (same error)
- [ ] 2.2 Sign short-lived access JWTs with `AUTH_JWT_SECRET`; include user_id, gym_id, role — verify: a unit test round-trips claims; missing secret prevents startup

## 3. HTTP

- [ ] 3.1 `POST /v1/auth/login` returns access token, refresh token (JSON + optional cookie), id, gym_id, role, display name — verify: HTTP test with a seeded user
- [ ] 3.2 `POST /v1/auth/refresh` rotates refresh tokens from cookie or body — verify: second use of the old refresh token fails
- [ ] 3.3 `POST /v1/auth/logout` revokes the current refresh token — verify: refresh after logout fails
- [ ] 3.4 Auth middleware + a sample owner-only route (or dedicated `/v1/auth/me`) returns 401 unauthenticated and 403 wrong role — verify: table-driven HTTP tests

## 4. Bootstrap owner

- [ ] 4.1 Create first owner when none exists using documented env vars — verify: test on a migrated DB creates one owner and refuses a second bootstrap

## 5. Integration verification

- [ ] 5.1 End-to-end: migrate, bootstrap owner, login, call `/v1/auth/me`, refresh, logout — verify: `go test` covering this path against Postgres
