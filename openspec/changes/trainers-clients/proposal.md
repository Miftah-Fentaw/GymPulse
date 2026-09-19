## Why

Trainers need a client list that is not the whole gym. Assignments are how coaching relationships become authorization.

## What Changes

- Trainer–member assignments, gym-scoped.
- Trainer APIs that list and read only assigned members.
- Owner/manager manage assignments; receptionist read-only.

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `trainers-clients`: Assign, list, unassign, isolation from unassigned members.

## Impact

- `trainer_assignments` migration
- `server/internal/trainers/`
- `/v1/trainers/...` and `/v1/me/clients`
