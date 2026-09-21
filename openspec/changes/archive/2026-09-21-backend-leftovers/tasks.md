# Tasks

## Backend completion

- [ ] Implement remaining invoice lifecycle behavior: discounts, refunds, receipts, overdue logic, and cash-up reporting.
  - Verify: service-level tests for invoice balances, refund idempotency, cash-up totals, and authorization boundaries.

- [ ] Complete class session and booking management.
  - Verify: booking creation, capacity enforcement, duplicate prevention, and session history queries against Postgres fixtures.

- [ ] Complete trainer/client availability and assignments.
  - Verify: availability queries exclude conflicts, assignment rows are gym-scoped, and unauthorized cross-gym requests fail.

- [ ] Finish workout and progress tracking with measurements and attachments.
  - Verify: member-only access, measurement history retention, and trainer visibility rules.

- [ ] Implement signed file download access for private storage.
  - Verify: valid signed URLs succeed, expired tokens are rejected, and unauthorized access is denied.

- [ ] Complete rich reporting filters and export behavior.
  - Verify: date/branch/member filters, access checks, and exported row correctness match report queries.

- [ ] Add public landing API behavior for non-authenticated metadata surfacing.
  - Verify: public routes return only public metadata and protected routes remain blocked without auth.

- [x] Update OpenAPI contract and regenerate generated API clients.
  - Verify: `make generate` produces no diff, the server compiles, and the generated client matches route behavior.

- [ ] Run the backend validation suite and fix regressions.
  - Verify: `make test` passes with a valid `TEST_DATABASE_URL`, and `make lint` or equivalent project validation remains green.
