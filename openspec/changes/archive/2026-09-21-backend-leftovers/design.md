# Design

## Architectural approach
The remaining backend work continues the existing server-first architecture: Go owns the database, auth, and business policy; the frontends remain API consumers only. The design keeps the repository/service patterns and gym-scoped authorization already established in the server codebase.

## Data model and domain boundaries
- Billing: extend the invoice/payment model already introduced for receipt, refund, discount, and cash-up behavior.
- Classes: add or complete session and booking tables with gym/branch scoping and capacity enforcement at the database or service layer.
- Trainers and clients: use the existing gym_id + branch_id boundaries and authorization model to constrain trainer availability and assignment APIs.
- Workouts: continue the measurement and workout logging model with member or trainer write permissions and audit retention.
- Storage: reuse the private local storage driver and signed token enforcement to provide secure file downloads without public exposure.
- Reporting: build on the existing repository/reporting primitives with filters and export patterns matched to the current API conventions.
- Public landing API: restrict the returned data to public metadata and keep member/staff endpoints behind auth checks.

## API contract strategy
- All new or changed routes are authored in `openapi.yaml` before code generation.
- Generated strict handlers remain the contract baseline; fallback handlers may be used only temporarily during transition, with reconciliation required before shipping.
- JSON snake_case, RFC 3339 timestamp handling, JWT access control, and gym-scoped authorization remain unchanged.

## Authorization model
- Staff roles remain the policy gate for operational actions.
- Members can only access their own records or permitted shared assets.
- The backend enforces access in Go rather than trusting frontend or query parameters.
- Public landing endpoints are unauthenticated by design and deliberately restricted to non-sensitive payloads.

## Validation and regression strategy
- Tests remain local PostgreSQL-backed via `TEST_DATABASE_URL`.
- Database tests create temporary `gympulse_test_*` databases and apply migrations, matching existing project conventions.
- Validation includes endpoint-level checks for authorization, gym scoping, idempotency, and refund/payment calculations.

## Rationale for the chosen stack
- Goose: schema evolution and migration discipline already established in the project.
- Chi: router model already used by the server and aligned with generated handlers.
- sqlc + pgx: existing typed query and Postgres access pattern.
- oapi-codegen: server and schema generation remain the single source of truth for API contract validation.
