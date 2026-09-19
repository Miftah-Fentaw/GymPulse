## Why

Front desk needs a reliable way to record who entered the gym and to look up attendance. QR plus staff-assisted check-in unblocks daily operations.

## What Changes

- Attendance events: member, gym, branch, timestamp, method (`qr` | `staff`).
- QR (or code) issued per member, validated server-side, refused when membership does not grant access.
- Staff check-in by member search.
- History APIs: staff by gym/branch/day; members see only their own.

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `checkin-attendance`: QR check-in, staff-assisted check-in, attendance history.

## Impact

- Migration for attendance and QR secrets/tokens
- `server/internal/checkin/`
- `/v1/checkins` (and QR issue/validate)
