## Context

See proposal.md — Why. Depends on members-and-memberships (`MembershipGrantsAccess`) and storage (photo for fallback). PWA cache is implemented in member-trainer-pwa; this change ships the server token API and documents the fallback.

## Goals / Non-Goals

**Goals:**
- 60-second signed QR token + member code
- Idempotent 15-minute window
- Staff search check-in and code+photo fallback
- OpenAPI + testcontainers

**Non-Goals:**
- Hardware turnstiles
- Implementing Workbox (PWA change)

## Decisions

### Decision 1: 60-second HMAC/JWT token

Server issues `GET /v1/me/checkin-qr` (auth member) with token (member_id, gym_id, exp=now+60s) plus the stable `member_code`. PWA polls/refreshes while online. Staff `POST /v1/checkins/qr` with the token.

### Decision 2: Offline fallback (explicit trade-off)

Workbox caches the last QR image/code. Offline, the signed token is stale. Desk looks up `member_code`, compares profile photo, records `code_fallback` or `staff`. **Trade-off:** a photographed static code can be replayed; photo match is the human control. Prefer the signed path whenever the phone is online.

### Decision 3: Idempotency window

Default 15 minutes, same member + branch. Return existing row.

### Decision 4: Kiosk is staff-authenticated

QR consume endpoint requires receptionist/manager/owner (or kiosk staff user).

## Risks / Trade-offs

- [Static code replay] → documented; photo required at desk.
- [Clock skew] → small leeway (e.g. 5s) on exp.

## Migration Plan

Additive attendance + member_code. Down local-only.

## Open Questions

None.
