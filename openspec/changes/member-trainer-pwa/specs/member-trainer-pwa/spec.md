## MODIFIED Requirements

### Requirement: View switching
After password login, the PWA SHALL show member views when a member profile exists and trainer views when the trainer staff role exists. If both exist, the user SHALL be able to switch views. Owner/manager/receptionist tools MUST NOT appear here (those belong in admin).

#### Scenario: Member login
- **WHEN** an account with only a member profile signs in
- **THEN** they see membership status, bookings, attendance, and workouts
- **AND** they do not see other members' directory

#### Scenario: Combined account
- **WHEN** an account has a member profile and trainer role
- **THEN** the PWA offers member and trainer views
- **AND** trainer view lists only assigned clients

### Requirement: PWA install and API-only
The app SHALL be installable as a PWA (vite-plugin-pwa / Workbox). The service worker SHALL cache the app shell and the member's last-known check-in QR for offline display. Authenticated `/v1` JSON MUST be network-first and MUST NOT be cached long-term as the source of truth. Runtime data MUST come from packages/api-client.

On logout the service worker MUST clear all caches, including cached QR images and any cached API data.

#### Scenario: Build
- **WHEN** `app` is built
- **THEN** a web app manifest is produced

#### Scenario: Offline QR
- **WHEN** the member is offline and a check-in QR was previously cached
- **THEN** that QR/code is still displayed
- **AND** the app does not use a stale signed token as if it were fresh

#### Scenario: Authenticated API is not cached long-term
- **WHEN** the service worker handles an authenticated `/v1` response
- **THEN** it does not store that response as a long-lived cache entry
- **AND** runtime data is fetched network-first

#### Scenario: Logout clears caches
- **WHEN** a signed-in user logs out
- **THEN** the service worker clears all caches, including cached QR and cached API data
- **AND** a later offline visit does not show the previous session's QR

### Requirement: Member booking and workouts
A signed-in member profile SHALL book/cancel classes and log workouts through the PWA using the existing server endpoints.

#### Scenario: Book a class
- **WHEN** a current member books an open session in the PWA
- **THEN** the booking appears in their list
- **AND** a full class shows as unavailable

### Requirement: Refresh on app origin
The PWA SHALL refresh access tokens using the project's refresh-cookie strategy, with JSON body fallback if the cookie is not sent.

#### Scenario: Refresh
- **WHEN** the access token expires and a valid refresh session exists
- **THEN** the PWA obtains a new access token without asking for the password

### Requirement: Localized UI
All user-visible strings SHALL come from i18n catalogs (react-i18next). English is the default locale. Source MUST NOT hard-code UI sentences outside catalogs.

#### Scenario: English default
- **WHEN** a member opens the PWA with no locale override
- **THEN** labels render from the English catalog
