## Why

The server has a database but no identity. Every later capability needs password login, JWT access plus refresh, and Go-enforced roles.

## What Changes

- `users` (or equivalent) table in schema `gympulse`: email, password hash, role, gym_id, status.
- `POST /v1/auth/login`, `POST /v1/auth/refresh`, `POST /v1/auth/logout`.
- Short-lived JWT access tokens; rotating refresh tokens stored hashed server-side.
- Refresh via httpOnly Secure cookie and via JSON body.
- Middleware that loads the principal and enforces roles. Seed an initial owner (env or first-user) for a fresh gym.
- No Supabase Auth.

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `auth-and-roles`: Implement login, tokens, roles, logout/revocation.

## Impact

- `server/migrations/0002_auth.sql` (name may vary)
- `server/internal/auth/`
- JWT secret and token TTLs in env / `.env.example`
- Integration tests on plain Postgres
