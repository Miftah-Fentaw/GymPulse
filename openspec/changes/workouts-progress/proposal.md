## Why

Members and their coaches need a place to record workouts and see history. This is the last core server domain before frontends.

## What Changes

- Workout logs owned by a member (and gym).
- Member CRUD on own logs; progress as chronological history.
- Trainers read/write logs only for assigned clients.

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `workouts-progress`: Member logs, progress, trainer access.
- `storage`: Progress photos for members and assigned trainers.

## Impact

- `workout_logs` migration
- `server/internal/workouts/`
- `/v1/workouts`, `/v1/members/{id}/workouts`
