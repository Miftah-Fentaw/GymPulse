# Proposal: Finish the remaining backend domain slices

## Why
The Go backend already includes the bootstrap, auth, membership, attendance, storage, and initial billing primitives. The remaining backend domains are the last major slices needed to ship the GymPulse MVP and make the API complete for staff and member workflows. Without them, the server still exposes an incomplete product surface and stops short of the business workflows defined in the project spec.

## What Changes
- Finish invoice lifecycle work: issue, apply discount, refund, receipt generation, overdue tracking, and cash-up reporting.
- Complete class session and booking management for staff workflows and member reservations.
- Finish trainer and client coordination: trainer assignments, availability, and scheduler-facing APIs.
- Complete workout and progress tracking: workout records, measurements, logs, and file/photo handling.
- Add signed private file downloads and authorization-safe access to stored media.
- Extend reporting with branch/gym filters, richer exports, and operator-specific views.
- Add the public landing API behavior for unauthenticated public pages and access to limited gym metadata.
- Reconcile the backend API contract with generated OpenAPI and client artifacts so the server and its contracts stay aligned.

## Capabilities
### New Capabilities
- `backend-leftovers`

### Modified Capabilities
- `billing-payments`
- `classes-booking`
- `trainers-clients`
- `workouts-progress`
- `storage`
- `reporting`
- `http-api`

## Scope
This change is intentionally backend-only. It does not add new frontend screens or redesign the apps. It completes the remaining server-side workflows needed to support the product as specified.

## Out of Scope
- payment gateway integrations with external processors
- SMS delivery or notification infrastructure
- multi-gym SaaS and multi-branch enterprise UX
- native mobile applications
- frontend UI work beyond API compatibility
