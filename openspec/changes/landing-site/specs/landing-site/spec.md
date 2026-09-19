## Purpose

Public website for a single deployed gym: plans, schedule, contact, and trial signup, with no direct database or Supabase access.

## ADDED Requirements

### Requirement: Public pages
The landing site SHALL show gym marketing content: home, membership plans, class schedule, and contact. Unauthenticated visitors MUST be able to load these pages.

#### Scenario: Visitor views plans
- **WHEN** a visitor opens the plans page
- **THEN** they see plans the server marks as public for that gym
- **AND** they are not asked to log in

#### Scenario: Visitor views schedule
- **WHEN** a visitor opens the schedule page
- **THEN** they see upcoming public sessions for the gym
- **AND** they cannot book without becoming a member (booking stays in the PWA or a later CTA)

### Requirement: Trial or contact signup
The site SHALL submit contact and trial requests to the server. The server MUST persist the lead. The landing app MUST NOT write to Postgres itself.

#### Scenario: Trial form
- **WHEN** a visitor submits a valid trial/contact form
- **THEN** the server stores the request
- **AND** the visitor sees a success message

#### Scenario: Invalid form
- **WHEN** a visitor submits without required fields
- **THEN** the request is not stored
- **AND** the UI shows a validation error

### Requirement: No privileged API
The landing site MUST NOT ship staff tokens, service keys, or a Supabase anon key. Public API endpoints SHALL be read-only except for the documented signup/contact POST.

#### Scenario: Bundle inspection
- **WHEN** the landing app is built
- **THEN** required env is the public API base URL
- **AND** there is no Supabase client dependency
