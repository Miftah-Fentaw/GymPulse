## Context

See proposal.md — Why. Depends on auth-and-roles. Members are gym-scoped; a member login is a `users` row with role `member` plus a profile.

## Goals / Non-Goals

**Goals:**
- CRUD-ish member profiles for staff, own-profile for members
- Plans and membership lifecycle including freeze/upgrade/cancel/expiry
- A single function/service other domains call: `MembershipGrantsAccess(memberID, at time)`

**Non-Goals:**
- Payments (invoices may be stubbed or omitted until billing-payments)
- Check-in QR
- Frontend

## Decisions

### Decision 1: members table 1:1 with users

`gympulse.members` has `user_id` unique, `branch_id`, status, extra profile fields. Creating a member creates a user with role member (temporary password or invite later; for MVP staff set a password).

### Decision 2: Access helper in the memberships service

Check-in and booking must not reimplement expiry math. Export one method used by later packages.

### Decision 3: One access-granting membership

Enforce in service, not only in UI. Unique partial index if SQL can express "one current membership".

### Decision 4: Money as integer minor units

Store plan price as integer cents (or gym currency minor units) plus `currency` code on gym or plan. Avoid float.

## Risks / Trade-offs

- [Creating users when creating members] → password bootstrap must not email yet (no-op). Staff-set password is acceptable for MVP.
- [Timezone] → store membership dates as date + gym timezone from gyms row; compare in UTC internally.

## Migration Plan

Additive SQL. Down drops new tables.

## Open Questions

None. Invite-by-email waits for notifications.
