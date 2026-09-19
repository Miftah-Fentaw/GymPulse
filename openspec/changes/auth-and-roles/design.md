## Context

See proposal.md — Why. Depends on `bootstrap-server` and `database-migrations` (`gyms`, `branches`, gympulse schema).

## Goals / Non-Goals

**Goals:**
- Login, JWT access, rotating refresh, five roles, Go middleware, logout/revoke, first owner
- sqlc queries for users and refresh tokens

**Non-Goals:**
- OAuth, magic links, SSO
- Multiple roles per user
- Frontend screens (admin-app / PWA changes)

## Decisions

### Decision 1: argon2id hashes

Prefer argon2id; bcrypt is acceptable if argon2id is awkward in the standard library set we already have. Never log passwords.

### Decision 2: JWT in Go

HS256 with `AUTH_JWT_SECRET` from env is enough for a self-hosted single gym. Access TTL ~15 minutes; refresh ~7–30 days, stored hashed in `refresh_tokens` with user_id and expiry.

### Decision 3: Cookie + body refresh

`POST /v1/auth/refresh` reads cookie `refresh_token` if present, else JSON `{ "refresh_token": "..." }`. Login sets cookie for browser clients and also returns the token in JSON for the PWA.

### Decision 4: Role in JWT plus DB check on mutate

Put `user_id`, `gym_id`, `role` in access claims. Middleware parses JWT; for authorization-sensitive routes, optionally re-read role from DB if we need instant revoke of role. Session revoke is refresh-token based; access tokens stay short-lived.

### Decision 5: users table, not members

Staff and members both live in `gympulse.users`. Member-specific profile fields arrive in `members-and-memberships` (either extra columns or `members` 1:1 with user).

## Risks / Trade-offs

- [JWT secret in env] → required var, fail fast if missing.
- [Refresh in JSON] → XSS risk on PWA if stored in localStorage; document that the PWA should use memory + refresh rotation; cookie is preferred when same-site.

## Migration Plan

`0002_auth.sql` additive. Down drops auth tables only.

## Open Questions

None. First-owner bootstrap via env (`BOOTSTRAP_OWNER_EMAIL` + `BOOTSTRAP_OWNER_PASSWORD` on empty gym) unless we later add a setup route.
