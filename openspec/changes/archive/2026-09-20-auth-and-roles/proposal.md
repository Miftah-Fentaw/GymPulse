## Why

The server has a database but no identity. Later capabilities need password login, 15-minute JWTs, rotating opaque refresh tokens with family reuse detection, and Go-enforced capabilities.

## What Changes

- `users`, `user_staff_roles`, `refresh_tokens` (hashed, family id). UUIDv7 ids.
- argon2id; JWT 15 min via golang-jwt/jwt/v5; opaque rotating refresh; reuse revokes family.
- Login/refresh/logout, me, password change/reset, staff invite, staff directory, gym/branch settings, audit log in `openapi.yaml`; oapi-codegen handlers; cookie on `api.` for `admin.` and `app.`.
- CORS + CSRF per design (native reverse-proxy subdomain layout).
- First-owner bootstrap.

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `auth-and-roles`: Login, tokens, multi-capability accounts, logout, cookie/CORS/CSRF, me, invites, staff directory, gym settings HTTP, audit log.

## Impact

- Auth migration, `server/internal/auth/`
- openapi.yaml, generate
- Env: AUTH_JWT_SECRET, CORS origins, cookie flags
