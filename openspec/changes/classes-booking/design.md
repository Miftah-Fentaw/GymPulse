## Context

See proposal.md — Why. Depends on members-and-memberships. Trainer assignment is optional on a session; trainers-clients can land after.

## Goals / Non-Goals

**Goals:**
- Sessions, capacity-safe booking (transaction or unique constraint), cancel with cutoff env/gym setting

**Non-Goals:**
- Recurring series UI (can insert many sessions)
- Waitlists
- Frontend

## Decisions

### Decision 1: Serialize capacity

Book inside a transaction: `SELECT ... FOR UPDATE` on the session row, count active bookings, insert. Unique `(session_id, member_id)` where status active.

### Decision 2: Cancel cutoff

Gym setting `booking_cancel_minutes` default 60. Staff bypass.

## Risks / Trade-offs

- [Race on capacity] → row lock, not check-then-act in HTTP handler without TX.

## Migration Plan

Additive.

## Open Questions

None.
