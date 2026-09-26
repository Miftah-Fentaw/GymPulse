# Architecture

## System diagram

```
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│ admin/         │  │ app/ (PWA)     │  │ landing/       │
│ React staff UI │  │ React member/  │  │ Vue marketing  │
│                │  │ trainer        │  │ + SEO shell    │
└───────┬────────┘  └───────┬────────┘  └───────┬────────┘
        │                   │                   │
        │     packages/api-client (from openapi.yaml)
        └───────────────────┼───────────────────┘
                            │  HTTPS /v1
                            ▼
                 ┌──────────────────────┐
                 │ server/ (Go)         │
                 │ Authz on every route │
                 │ Only DB client       │
                 └──────────┬───────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
        PostgreSQL 16   local/S3     optional SMS/
        (single URL)    files        email/gateway
```

## Non-negotiable rules

1. **`server/` is the only database client.** Authorization is enforced in Go.
2. Frontends use **REST only** via `packages/api-client` generated from `openapi.yaml`.
3. **One gym per deployment.** Schema includes `gym_id` / `branch_id` from day one; MVP UX is single branch.
4. **Money** = integer minor units + gym ISO currency. **Time** = `timestamptz` UTC + gym IANA zone for “today”.
5. **IDs** = UUIDv7 generated in Go.

## Auth model

| Concept | Behavior |
|:---|:---|
| User account | Email/password (Argon2id) |
| Access JWT | HS256, 15 minutes, `Authorization: Bearer` |
| Refresh | Opaque token, hashed; httpOnly Secure cookie on API host; JSON body fallback |
| Rotation | Refresh reuse revokes the whole token family |
| Capabilities | Member profile and/or staff roles: `owner`, `manager`, `receptionist`, `trainer` |
| Surfaces | Admin = staff tools. PWA = member and/or trainer views. Never mix staff ops into the PWA. |

CSRF: refresh/logout cookie paths require allowed `Origin` + client header where configured (`CORS_ORIGINS`).

## API shape

- Base path: `/v1`
- Contract: `openapi.yaml` (OpenAPI 3.1)
- Errors: `{ "error": { "code", "message", "details" } }`
- JSON: snake_case
- Pagination: cursor + limit (offset for some reports)
- Mutations that create money / attendance rows: honor `Idempotency-Key` when specified

`make generate` regenerates Go stubs and the TypeScript client. Change the YAML first.

## Data ownership

| Domain | Typical tables / concepts |
|:---|:---|
| Tenancy | `gyms`, `branches`, hours, holidays |
| People | `users`, `user_staff_roles`, `members`, leads |
| Access | memberships, plans |
| Attendance | `attendance_events`, check-in tokens |
| Billing | invoices, payments (incl. `pending` + evidence), refunds |
| Files | `files` metadata + storage driver objects |
| Classes / PT / workouts | sessions, bookings, assignments, logs |

All domain rows are scoped by `gym_id` (and `branch_id` when branch-local).

## Check-in flow

```
Member PWA                    API                         Admin desk
───────────                   ───                         ──────────
GET /v1/me/checkin-token  →   sign short-lived token
show QR (refresh online)                                  paste/scan token
                              ← POST /v1/checkins {token, branch_id}
                              INSERT attendance_events (method=qr)
Staff search path:            POST /v1/checkins/staff {member_id, branch_id}
```

## Screenshot payment flow

```
Member: unpaid invoice → upload file → POST payment (pending, evidence_file_id)
Staff:  GET payments?status=pending → approve/reject
Approve: payment approved + invoice paid_minor / status updated
Reject:  reason stored; invoice unchanged
```

Cash recorded by staff **without** evidence remains immediately approved.

## Deploy topology (production)

Suggested hostnames (see [reverse-proxy.md](reverse-proxy.md)):

| Host | Serves |
|:---|:---|
| `api.<domain>` | Go binary (`gympulse`) |
| `admin.<domain>` | Static admin build |
| `app.<domain>` | Static PWA build |
| `<domain>` | Landing build |

Process manager: systemd ([example unit](systemd/gympulse.service)). Backups: `pg_dump` (production rollback = restore dump, not `migrate down`).

## OpenSpec vs code

| Artifact | Role |
|:---|:---|
| `openspec/specs/*` | Current product behavior contracts |
| `openspec/changes/<name>/` | Active proposals (proposal, design, delta specs, tasks) |
| `openspec/changes/archive/` | Completed changes |
| `openapi.yaml` | HTTP wire contract |
| Code | Implements approved specs |

See [openspec.md](openspec.md) for the full workflow.
