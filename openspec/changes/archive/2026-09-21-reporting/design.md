## Context

See proposal.md — Why. Depends on billing-payments and checkin-attendance (and memberships).

## Goals / Non-Goals

**Goals:**
- SQL aggregates for revenue, outstanding/overdue, active members, churn, attendance
- Owner/manager only

**Non-Goals:**
- Charts in this change, CSV export, BI tools

## Decisions

### Decision 1: Query-time aggregates

No rollup tables for MVP. Index memberships and payments by gym_id + date.

### Decision 2: Churn definition

Count memberships whose cancel effective date or end date falls in the range and that are not renewed onto a successor in-range. Document the exact SQL in a comment next to the query.

## Risks / Trade-offs

- [Definition bikeshed] → freeze the definition in the spec scenarios; change later via OpenSpec.

## Migration Plan

None required if indexes can live in a small additive migration.

## Open Questions

None.
