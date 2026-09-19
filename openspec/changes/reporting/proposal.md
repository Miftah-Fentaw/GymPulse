## Why

Owners need revenue, churn, and active-member numbers without waiting for the rest of the admin UI. The reporting API can ship after the core loop and before classes.

## What Changes

- Report endpoints for owner/manager: revenue, churn, active members, attendance summary, new signups, class utilization, CSV/JSON export.
- Gym- and optional branch-scoped aggregates from GymPulse tables (not an external processor).
- No frontend in this change (admin-app-complete consumes it).

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `reporting`: Role-gated reports, active/churn, revenue, attendance summary.

## Impact

- `server/internal/reporting/`
- `/v1/reports/...`
- Read-only queries; may use offset pagination
