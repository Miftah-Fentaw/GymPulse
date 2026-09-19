## MODIFIED Requirements

### Requirement: Spec-first OpenAPI
The repository SHALL keep a versioned `openapi.yaml` (OpenAPI 3.1) that describes all `/v1` HTTP operations. Generated Go artifacts MUST be produced from that file via oapi-codegen (chi server, strict handlers). Hand-written duplicates of those types MUST NOT be the source of truth.

This slice generates Go only. TypeScript client generation is deferred to admin-app-core.

#### Scenario: Generate from spec
- **WHEN** an operator runs `make generate`
- **THEN** Go chi strict server interfaces and types are written from `openapi.yaml`

#### Scenario: CI detects Go generate drift
- **WHEN** CI runs generate and the Go generated files differ from the working tree
- **THEN** the check fails
- **AND** the developer must commit the regenerated files or fix the spec

### Requirement: Request validation
The server SHALL validate incoming requests against the OpenAPI schema before handler logic runs. Invalid bodies or parameters MUST be rejected with a validation error that matches the standard error envelope.

#### Scenario: Unknown field or missing required
- **WHEN** a client posts a `/v1` body that violates the spec
- **THEN** the handler is not invoked
- **AND** the response is a 4xx with the standard error JSON

## ADDED Requirements

### Requirement: Cursor pagination
List endpoints under `/v1` SHALL paginate with an opaque `cursor` and a `limit` (default 20, maximum 100). Report endpoints MAY use offset pagination. Responses MUST include `items` and `next_cursor` (null when no further page exists).

#### Scenario: First page
- **WHEN** a client lists a collection without a cursor
- **THEN** the server returns at most `limit` items
- **AND** `next_cursor` is present when more items exist

#### Scenario: Next page
- **WHEN** a client supplies a `next_cursor` from a previous page
- **THEN** the server returns the following items
- **AND** it does not repeat the previous page's items

### Requirement: Idempotency keys
Unsafe POST operations that create money or attendance side effects SHALL honor an `Idempotency-Key` header. Replays of the same key and equivalent body within the documented window MUST return the original result without a second side effect.

#### Scenario: Payment replay
- **WHEN** staff POST a payment twice with the same Idempotency-Key and body
- **THEN** only one payment row exists
- **AND** both responses refer to that payment

### Requirement: Error envelope and rate limits
Every error response SHALL use `{ "error": { "code", "message", "details" } }`. Public auth and lead capture endpoints SHALL be rate-limited and return 429 with that envelope when exceeded.

#### Scenario: Rate limited login
- **WHEN** a client exceeds the login attempt limit
- **THEN** the server returns 429 with the standard error envelope
- **AND** no session is created

### Requirement: Planned operations in OpenAPI
`openapi.yaml` SHALL list domain `/v1` operations (including those not yet implemented). oapi-codegen SHALL generate handlers only for implemented `operationId`s via `include-operation-ids` until the owning change is applied. Applying a change MUST add its operationIds to that list and implement the handlers.

#### Scenario: Catalog without unimplemented handlers
- **WHEN** an operator runs `make generate` while only health, ready, and echo are implemented
- **THEN** generated Go server interfaces include only those operations
- **AND** `openapi.yaml` still documents the planned domain paths
