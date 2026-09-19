## Purpose

Staff dashboard for owner, manager, and receptionist to operate GymPulse through the Go REST API only.

## ADDED Requirements

### Requirement: Staff authentication in admin
The admin app SHALL sign in staff with email and password against `POST /v1/auth/login`, store the access token for API calls, and refresh via `POST /v1/auth/refresh`. Members and trainers MUST be refused access to the admin app.

#### Scenario: Owner logs in
- **WHEN** an owner submits valid credentials on the admin login screen
- **THEN** they reach the authenticated shell
- **AND** subsequent API calls send `Authorization: Bearer`

#### Scenario: Member is rejected
- **WHEN** a member account signs in on the admin login screen
- **THEN** the app denies access to staff routes
- **AND** does not show member or trainer PWA screens

### Requirement: API-only data access
The admin app SHALL load and mutate gym data only through the GymPulse HTTP API. It MUST NOT ship a Supabase URL, anon key, or Postgres connection string as a required config value.

#### Scenario: Config
- **WHEN** an operator deploys admin
- **THEN** the required public config is the API base URL
- **AND** no `@supabase` client is imported

### Requirement: Staff workflows
Authenticated staff SHALL be able to use the dashboard to manage members and memberships, record check-ins, record manual payments, and manage class sessions, within their role. Receptionists MUST NOT see owner-only settings if those exist.

#### Scenario: Receptionist check-in
- **WHEN** a receptionist is signed in
- **THEN** they can search a member and record a check-in
- **AND** they cannot access reports reserved for owner/manager if the reporting UI is present

#### Scenario: Unauthenticated redirect
- **WHEN** a browser opens a protected admin route without a session
- **THEN** the app redirects to login
