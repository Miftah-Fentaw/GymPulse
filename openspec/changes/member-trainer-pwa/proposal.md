## Why

Members and trainers need a mobile-friendly PWA, not the staff dashboard. One app, role-based views, talking only to the Go API.

## What Changes

- Turn `app/` into a PWA (vite-plugin-pwa) with login, member home (membership, check-in history, book classes, workouts), and trainer home (clients, client workouts).
- Web-push registration can be stubbed if the notifications API is not yet applied; do not add a Supabase client.

## Capabilities

### New Capabilities

- `member-trainer-pwa`: Role-based PWA for members and trainers via the server API.

### Modified Capabilities

<!-- none -->

## Impact

- `app/src/` plus PWA plugin
- Depends on auth, members, memberships, classes, workouts, trainers APIs
