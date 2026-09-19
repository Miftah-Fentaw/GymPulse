## Purpose

OpenAPI 3.1 is the source of truth for the GymPulse HTTP API under /v1, driving Go server codegen and the shared TypeScript client.

## Requirements

### Requirement: Spec-first OpenAPI
The repository SHALL keep a versioned `openapi.yaml` (OpenAPI 3.1) that describes all `/v1` HTTP operations. Generated Go and TypeScript artifacts MUST be produced from that file. Hand-written duplicates of those types MUST NOT be the source of truth.

#### Scenario: Generate from spec
- **WHEN** an operator runs `make generate`
- **THEN** Go chi strict server interfaces/types and `packages/api-client` are written from `openapi.yaml`

#### Scenario: CI detects drift
- **WHEN** CI runs generate and the working tree differs
- **THEN** the check fails
- **AND** the developer must commit the regenerated files or fix the spec

### Requirement: Request validation
The server SHALL validate incoming requests against the OpenAPI schema before handler logic runs. Invalid bodies or parameters MUST be rejected with a validation error that matches the standard error envelope.

#### Scenario: Unknown field or missing required
- **WHEN** a client posts a `/v1` body that violates the spec
- **THEN** the handler is not invoked
- **AND** the response is a 4xx with the standard error JSON

### Requirement: Shared TypeScript client
admin, app, and landing SHALL call the API through `packages/api-client` generated with openapi-typescript and openapi-fetch. They MUST NOT hand-roll fetch wrappers that bypass those types for `/v1` resources.

#### Scenario: Admin uses generated client
- **WHEN** the admin app loads members
- **THEN** the call goes through packages/api-client
