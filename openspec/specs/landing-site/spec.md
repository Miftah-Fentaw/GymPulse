## Purpose

Public, crawlable website for a single deployed gym: plans, schedule, contact, and trial signup, using SSR or static generation and only public GymPulse API endpoints.

## Requirements

### Requirement: SEO-oriented delivery
The landing site SHALL be delivered as Astro static or hybrid HTML with React islands only for live parts (trial form, live schedule). Plans and marketing content MUST be crawlable without a client-only SPA shell.

#### Scenario: Crawler sees plans
- **WHEN** an unauthenticated crawler requests the plans URL
- **THEN** the HTML response includes plan names without requiring JavaScript to populate them

### Requirement: Public pages
The landing site SHALL show gym marketing content: home, membership plans, class schedule, and contact. Unauthenticated visitors MUST be able to load these pages.

#### Scenario: Visitor views schedule
- **WHEN** a visitor opens the schedule page
- **THEN** they see upcoming public sessions for the gym
- **AND** they cannot complete a member booking on landing (CTA may link to the PWA)

### Requirement: Trial or contact signup
The site SHALL submit contact and trial requests to the server leads API. The landing app MUST NOT write to Postgres itself.

#### Scenario: Trial form
- **WHEN** a visitor submits a valid trial/contact form
- **THEN** the server stores a lead
- **AND** the visitor sees a success message

#### Scenario: Invalid form
- **WHEN** a visitor submits without required fields
- **THEN** the request is not stored
- **AND** the UI shows a validation error

### Requirement: No privileged API
The landing site MUST NOT ship staff tokens or use credentialed auth cookies. Public API endpoints SHALL be read-only except for the documented lead POST.

#### Scenario: Bundle inspection
- **WHEN** the landing app is built
- **THEN** required env is the public API base URL
- **AND** auth refresh cookies are not used on this origin

### Requirement: Localized UI
All user-visible strings SHALL come from i18n catalogs. English is the default locale. Source MUST NOT hard-code UI sentences outside catalogs.

#### Scenario: English default
- **WHEN** a visitor opens landing with no locale override
- **THEN** visible copy comes from the English catalog
