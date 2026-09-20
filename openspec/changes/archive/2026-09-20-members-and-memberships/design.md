## Context

See proposal.md — Why. Depends on auth-and-roles and storage. Members 1:1 with users. Leads are gym-scoped; public POST is rate-limited and does not set auth cookies.

## Goals / Non-Goals

**Goals:**
- Member CRUD, attach profile to existing staff user, plans/memberships, MembershipGrantsAccess, leads capture/convert, profile photo
- UUIDv7 ids from Go

**Non-Goals:**
- Payments (until billing-payments)
- Check-in QR
- Landing UI (only the API)
- Progress photos

## Decisions

### Decision 1: members 1:1 with users

`members.user_id` unique. Creating a member creates a user with no staff roles, or links an existing user in the same gym.

### Decision 2: Access helper

Export `MembershipGrantsAccess(memberID, at time)` for check-in and booking.

### Decision 3: Money as integer minor units

Plan price integer cents plus currency on gym or plan.

### Decision 4: Public leads

`POST /v1/public/leads` identifies gym via config (single gym per deploy) or `gym_slug` query. Rate-limit per IP. No CORS credentials.

### Decision 5: Profile photo

Use storage interface + files row; `members.photo_file_id`.

## Risks / Trade-offs

- [Public POST spam] → rate limit; captcha later behind an interface.

## Migration Plan

Additive. Down drops new tables.

## Open Questions

None.
