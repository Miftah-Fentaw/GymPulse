## Context

See proposal.md — Why. Depends on members-and-memberships (`MembershipGrantsAccess`).

## Goals / Non-Goals

**Goals:**
- Server-validated QR (or opaque code), staff check-in, history
- Idempotency window so double-scan the same minute does not create two visits (define a short duplicate window)

**Non-Goals:**
- Hardware turnstiles, native camera app (PWA later)
- Realtime dashboard (notifications change)

## Decisions

### Decision 1: Opaque member check-in token

Store a random secret per member (or signed JWT with member id + gym + expiry). Prefer HMAC/JWT issued by the server so staff kiosks do not hold a DB of codes. Rotate by re-issuing.

### Decision 2: Duplicate window

If the same member checks in at the same branch within N minutes (e.g. 15), return the existing event (200/OK) rather than inserting a second row. Document N in config.

### Decision 3: Kiosk auth

QR submit endpoint requires a staff (or dedicated kiosk) access token so a stolen QR cannot be replayed from the public internet without staff context. Member-self check-in at the door can wait; MVP is staff/kiosk.

## Risks / Trade-offs

- [Printed QR leakage] → codes should expire or rotate; staff-assisted path always available.
- [Timezone for "today"] → use gym timezone.

## Migration Plan

Additive attendance table. Down drops it.

## Open Questions

None. Self-scan from PWA can be a later additive endpoint.
