## ADDED Requirements

### Requirement: Functional-only staff UI
The admin app SHALL expose only controls and screens that perform a real staff action against the GymPulse API (or navigate to such a screen). Decorative or placeholder controls that look interactive but do nothing MUST NOT ship in the authenticated shell.

#### Scenario: No dead chrome
- **WHEN** a staff user opens the authenticated admin shell
- **THEN** visible primary actions either call the API, open a working staff route, or are omitted
- **AND** non-functional decorative controls are not presented as actionable

#### Scenario: Login remains the gate
- **WHEN** a browser opens a protected admin route without a session
- **THEN** the app redirects to login
