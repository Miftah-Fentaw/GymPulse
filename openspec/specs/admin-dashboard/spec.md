## Purpose

Staff dashboard for owner, manager, and receptionist to operate GymPulse through the Go REST API only.

## Requirements

### Requirement: Staff authentication in admin
The admin app SHALL sign in staff against the server login API, store the access token for API calls, and refresh via the documented refresh strategy. Accounts that lack owner, manager, or receptionist MUST be refused access to the admin app.

#### Scenario: Owner logs in
- **WHEN** an owner submits valid credentials on the admin login screen
- **THEN** they reach the authenticated shell
- **AND** subsequent API calls send `Authorization: Bearer`

#### Scenario: Member-only is rejected
- **WHEN** an account with only a member profile signs in on the admin login screen
- **THEN** the app denies access to staff routes

### Requirement: API-only data access
The admin app SHALL load and mutate gym data only through `packages/api-client` (generated from openapi.yaml). It MUST NOT accept a Postgres URL as required config.

#### Scenario: Config
- **WHEN** an operator deploys admin
- **THEN** the required public config is the GymPulse API origin

#### Scenario: Generated client
- **WHEN** admin loads members
- **THEN** the call uses packages/api-client

### Requirement: Core staff loop
Authenticated staff SHALL manage members and memberships, record check-ins, and record manual payments, within their capabilities. This loop MUST be usable before classes, trainers, and reports exist in the UI.

#### Scenario: Receptionist check-in
- **WHEN** a receptionist is signed in
- **THEN** they can search a member and record a check-in

#### Scenario: Record a payment
- **WHEN** staff open an issued invoice and record a cash payment
- **THEN** the invoice shows as paid when the amount covers the total

#### Scenario: Unauthenticated redirect
- **WHEN** a browser opens a protected admin route without a session
- **THEN** the app redirects to login

### Requirement: Localized UI
All user-visible strings SHALL come from i18n catalogs (react-i18next). English is the default locale. Source MUST NOT hard-code English UI sentences outside catalogs.

#### Scenario: English default
- **WHEN** a staff user opens admin with no locale override
- **THEN** labels render from the English catalog

### Requirement: Complete staff workflows
The admin app SHALL also manage class sessions, trainer assignments, and the reports dashboard (revenue, churn, active members) for owner and manager. Receptionists MUST NOT see owner-only reports.

#### Scenario: Manager opens reports
- **WHEN** a manager opens the reports dashboard
- **THEN** they see revenue, churn, and active-member figures for their gym

#### Scenario: Receptionist hidden reports
- **WHEN** a receptionist uses admin
- **THEN** report routes are hidden or forbidden

### Requirement: Functional-only staff UI
The admin app SHALL expose only controls and screens that perform a real staff action against the GymPulse API (or navigate to such a screen). Decorative or placeholder controls that look interactive but do nothing MUST NOT ship in the authenticated shell.

#### Scenario: No dead chrome
- **WHEN** a staff user opens the authenticated admin shell
- **THEN** visible primary actions either call the API, open a working staff route, or are omitted
- **AND** non-functional decorative controls are not presented as actionable

#### Scenario: Login remains the gate
- **WHEN** a browser opens a protected admin route without a session
- **THEN** the app redirects to login
