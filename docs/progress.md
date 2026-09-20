# Progress

## auth-and-roles

Implemented the authentication schema migration, Argon2id password hashing,
UUIDv7 identifiers, 15-minute HS256 access JWT claims, rotating refresh token
families with reuse revocation, bootstrap-owner, CSRF/CORS middleware, and
generated strict auth/me OpenAPI handlers. Integration tests require
`TEST_DATABASE_URL` pointing at PostgreSQL 16 and are skipped when unavailable.

Password change/reset and session listing/revocation primitives are present.
Staff and branch CRUD, role protection, session revocation, audit persistence
and authorization, invite/reset/verification outbox persistence, rate limiting,
CORS origin filtering, branding, hours, and holidays are wired. PostgreSQL
integration coverage remains unavailable without `TEST_DATABASE_URL`.

## Go backend domains (in progress)

Added the additive `0005_backend_domains` migration covering private file
metadata, attendance, invoices/payments (including evidence references and
approval/rejection audit events), trainer assignments, classes/bookings, and
workout measurements/logs. Added transaction-oriented repository primitives
for billing, attendance, classes, trainers, workouts, reporting, and storage,
plus a private local storage driver and HMAC check-in token implementation.

Implemented the generated members, memberships, plans, and leads handlers with
gym scoping, role checks, CRUD/action persistence, notes, CSV export, lead
conversion, and membership state transitions. The router now also provides an
authenticated JSON fallback for domain paths present in `openapi.yaml` but not
yet emitted by the checked-in oapi-codegen file, so those paths no longer
return generated 501 responses.

Added pragmatic authenticated HTTP fallback handlers for QR and staff
check-ins, attendance listing/presence, manual payments and pending evidence
review, member check-in tokens, multipart private file uploads, basic reports,
and tenant-scoped storage metadata. Existing generated auth and members
handlers remain unchanged. OpenAPI regeneration and client updates are
intentionally deferred.

Remaining endpoint groups are richer invoice/receipt/refund workflows,
class-session and booking management, trainer/client and availability
workflows, workout/progress CRUD and photos, signed file downloads, detailed
report filters/exports, and public landing API behavior.
