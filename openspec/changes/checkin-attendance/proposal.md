## Why

Front desk needs reliable check-in. Members present a 60-second signed QR while online; offline they show a cached static code that staff match to a photo. Attendance must be idempotent.

## What Changes

- Short-lived signed token (60s) plus stable member code; PWA refreshes while online.
- Offline fallback: Workbox-cached last QR/code; desk verifies code + photo.
- Staff search check-in; idempotent window (default 15 minutes).
- History APIs; issue-token endpoint; corrections; who-is-present; gym IANA timezone for "today". Peak hours later.
- openapi.yaml updates.

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `checkin-attendance`: Signed QR, offline fallback, staff check-in, idempotent attendance, history.

## Impact

- attendance migration, `server/internal/checkin/`
- PWA cache behavior specified here; implemented in member-trainer-pwa
