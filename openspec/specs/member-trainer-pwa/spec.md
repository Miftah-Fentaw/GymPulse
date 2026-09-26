## Purpose

Installable PWA where a single account can use member views, trainer views, or both, using only the GymPulse REST API.

## Requirements

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

### Requirement: Member billing and screenshot pay in the PWA
The PWA SHALL let a signed-in member view their invoices and submit a screenshot payment (provider choice such as Telebirr or CBE, amount, optional reference, evidence image) against an unpaid invoice using the billing APIs. The UI SHALL show pending/approved/rejected status for those payments.

#### Scenario: Member pays with screenshot
- **WHEN** a member selects an unpaid invoice, chooses Telebirr, uploads a screenshot, and submits
- **THEN** a pending payment is created and the PWA shows it as awaiting staff verification

### Requirement: Member check-in entry point
The PWA SHALL expose check-in in primary navigation for member profiles and route to the check-in QR screen.

#### Scenario: Nav to check-in
- **WHEN** a member opens the main app shell
- **THEN** a check-in navigation target is available and opens the QR screen

### Requirement: Email and password only on auth screens
PWA sign-in and sign-up SHALL use email and password only. The UI MUST NOT offer Google, Apple, or other social identity providers. Password fields SHALL include a show/hide control.

#### Scenario: Sign-in without social buttons
- **WHEN** a user opens sign-in or sign-up
- **THEN** only email/password controls are offered and each password field has a visibility toggle

### Requirement: Mobile bottom navigation shell
On phone-width viewports the authenticated PWA SHALL present a persistent bottom navigation bar with Home, Explore, Schedule, and Profile destinations. The active destination MUST be visually indicated using the brand primary color.

#### Scenario: Phone bottom nav
- **WHEN** a signed-in member uses the PWA at a phone-width viewport
- **THEN** Home, Explore, Schedule, and Profile are reachable from a bottom navigation bar
- **AND** the current tab uses the brand primary accent

### Requirement: Tablet and desktop sidebar shell
On tablet and desktop viewports the PWA SHALL present the same four destinations in a persistent left sidebar instead of a bottom bar. Content MUST reflow to multi-column layouts where the design uses lists of cards.

#### Scenario: Desktop sidebar
- **WHEN** a signed-in member uses the PWA at a tablet or desktop viewport
- **THEN** navigation appears in a left sidebar with the same four destinations
- **AND** the bottom navigation bar is not shown

### Requirement: Design-kit member surfaces with GymPulse brand
The PWA SHALL follow the light-version layout structure from the approved PWA design kit (onboarding, home, explore, schedule, profile, workout/trainer detail). Primary actions, active states, and key accents MUST use GymPulse landing brand red (`#e31c23` family), not the kit’s green.

#### Scenario: Brand primary on CTAs
- **WHEN** a visitor views Sign In or a primary Reserve/Confirm button
- **THEN** the primary filled button uses GymPulse brand red
- **AND** the overall chrome remains a light background as in the design kit
