## Purpose

Installable PWA where members manage their gym use and trainers manage assigned clients, using only the GymPulse REST API.

## ADDED Requirements

### Requirement: Role-based shells
After password login against the server, a member SHALL see the member shell and a trainer SHALL see the trainer shell. Owner, manager, and receptionist MUST be directed to use the admin app rather than staff tools inside the PWA.

#### Scenario: Member login
- **WHEN** a member signs in
- **THEN** they see membership status, their bookings, attendance, and workouts
- **AND** they do not see other members' directory

#### Scenario: Trainer login
- **WHEN** a trainer signs in
- **THEN** they see their assigned clients and can open those clients' workouts
- **AND** they do not see the full gym member directory

### Requirement: PWA install and API-only
The app SHALL be installable as a PWA (web app manifest + service worker). Runtime data MUST come from the GymPulse API base URL only.

#### Scenario: Build
- **WHEN** `app` is built
- **THEN** a web app manifest is produced
- **AND** source does not import a Supabase client

### Requirement: Member booking and workouts
A signed-in member SHALL book/cancel classes and log workouts through the PWA using the existing server endpoints.

#### Scenario: Book a class
- **WHEN** a current member books an open session in the PWA
- **THEN** the booking appears in their list
- **AND** a full class shows as unavailable

### Requirement: Refresh on mobile origins
The PWA SHALL refresh access tokens via `POST /v1/auth/refresh` using the JSON body token when a cookie is not available cross-site.

#### Scenario: Refresh
- **WHEN** the access token expires and a valid refresh token is held
- **THEN** the PWA obtains a new access token without asking for the password
