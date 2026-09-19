## Context

See proposal.md — Why. Depends on auth-and-roles and members. Trainers are `users.role = trainer`.

## Goals / Non-Goals

**Goals:**
- Assignment table, trainer client list, deny unassigned reads (reuse members GET with extra check)

**Non-Goals:**
- Payroll, trainer calendars beyond class sessions
- Frontend

## Decisions

### Decision 1: Many-to-many

`trainer_assignments(trainer_user_id, member_id, gym_id)` unique pair.

### Decision 2: Authorization helper

`CanTrainerAccessMember(trainerID, memberID)` used by workouts-progress later.

## Risks / Trade-offs

- [Class roster vs clients] → trainers teaching a class still should not see billing; roster visibility is a later add.

## Migration Plan

Additive.

## Open Questions

None.
