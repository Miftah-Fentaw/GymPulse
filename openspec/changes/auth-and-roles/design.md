## Context

See proposal.md — Why. Depends on bootstrap-server and database-migrations. Caddy subdomains: `api.`, `admin.`, `app.`, root landing.

## Goals / Non-Goals

**Goals:**
- argon2id, JWT 15 min (golang-jwt/jwt/v5), opaque rotating refresh with family reuse detection
- Cookie + CORS + CSRF for the Caddy layout
- sqlc; UUIDv7; testcontainers; openapi.yaml auth paths

**Non-Goals:**
- OAuth, frontend screens, member profile table

## Decisions

### Decision 1: argon2id

No bcrypt. Never log passwords.

### Decision 2: JWT 15 minutes

HS256, `AUTH_JWT_SECRET`, claims: `user_id`, `gym_id`, `staff_roles`, `has_member_profile`.

### Decision 3: Opaque refresh + family

Store only a hash. Each row has `family_id`. Rotate on refresh: insert new, mark old rotated. If a rotated token is presented, revoke all rows with that `family_id`.

### Decision 4: Cookies on api. under the Caddy layout

Production hostnames:

- `https://api.example.com` — Go (cookie host)
- `https://admin.example.com`
- `https://app.example.com`
- `https://example.com` — landing, no auth cookies

Cookie: `HttpOnly`; `Secure` in production; `Path=/v1/auth`; **host-only** on the API host (do not set `Domain=.example.com`); `SameSite=Lax` (same eTLD+1). `__Host-` prefix only if Path is `/`.

CORS: credentialed allowlist is `https://admin.<domain>` and `https://app.<domain>` only. Exact `Allow-Origin` + `Allow-Credentials: true`. Landing may call public GETs/lead POST **without** credentials.

CSRF: cookie POSTs to `/v1/auth/refresh` and `/logout` require `Origin` in that allowlist and header `X-GymPulse-Client`.

JSON body refresh is fallback only (not used by first-party apps when cookies work).

### Decision 5: Staff roles table

`user_staff_roles(user_id, role)`. Email unique per gym.

## Risks / Trade-offs

- [Landing CSRF] → landing not credentialed.
- [Token family revoke is blunt] → safer than reuse-as-refresh.

## Migration Plan

Additive. Down local-only.

## Open Questions

None.
