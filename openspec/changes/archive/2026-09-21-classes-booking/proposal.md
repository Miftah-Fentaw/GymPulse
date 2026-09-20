## Why

Group classes are a core gym product. Members need to book without overbooking; staff need a schedule.

## What Changes

- Class types, recurring schedules, sessions (branch, time, capacity, optional trainer), waitlist, session attendance. Rooms/equipment later.
- Member book/cancel; staff cancel; capacity enforced on the server.
- Booking requires `MembershipGrantsAccess`.

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `classes-booking`: Schedule, booking, cancel, access rules.

## Impact

- `classes` / `class_sessions` / `bookings` migrations
- `server/internal/classes/`
- `/v1/classes`, `/v1/bookings`
