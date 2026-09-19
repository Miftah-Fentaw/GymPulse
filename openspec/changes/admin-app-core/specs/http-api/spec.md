## MODIFIED Requirements

### Requirement: Shared TypeScript client
admin, app, and landing SHALL call the API through `packages/api-client` generated with openapi-typescript and openapi-fetch. They MUST NOT hand-roll fetch wrappers that bypass those types for `/v1` resources. TypeScript generation lands with the first frontend workspace, not the server bootstrap.

#### Scenario: Admin uses generated client
- **WHEN** the admin app loads members
- **THEN** the call goes through packages/api-client

#### Scenario: Generate TypeScript client
- **WHEN** an operator runs `make generate` after the frontend workspace exists
- **THEN** `packages/api-client` is written from `openapi.yaml` using openapi-typescript and openapi-fetch

#### Scenario: CI detects TypeScript generate drift
- **WHEN** CI runs generate and the TypeScript generated files differ from the working tree
- **THEN** the check fails
