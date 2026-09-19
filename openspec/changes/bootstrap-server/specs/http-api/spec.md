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
