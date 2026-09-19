## Context

See proposal.md — Why. Depends on trainers-clients for trainer access.

## Goals / Non-Goals

**Goals:**
- Persist logs (date, notes, JSONB exercises or text), list, trainer path via `CanTrainerAccessMember`
- Progress photos through the storage interface

**Non-Goals:**
- Fancy analytics, PR charts, public sharing
- Frontend

## Decisions

### Decision 1: JSONB payload

`workout_logs.payload JSONB` plus `logged_on date` and `notes`. Avoid a rigid exercise catalog in this slice.

### Decision 2: Progress = ordered list

`GET .../progress` can alias list-by-date. Computed stats later.

## Risks / Trade-offs

- [Unstructured payload] → catalog/exercises capability can normalize later.

## Migration Plan

Additive.

## Open Questions

None.
