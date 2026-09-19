## MODIFIED Requirements

### Requirement: Capture leads
Unauthenticated visitors SHALL submit trial or contact requests (name, contact, optional message) to the server. The server MUST persist a gym-scoped lead. Spam controls MUST exist (at least rate limiting).

#### Scenario: Valid trial form
- **WHEN** a visitor submits a valid trial request for the gym
- **THEN** a lead row is stored
- **AND** the API returns success without creating a full member until staff convert it

#### Scenario: Invalid form
- **WHEN** a visitor omits required fields
- **THEN** no lead is stored
- **AND** the API returns a validation error

### Requirement: Staff manage leads
Owner, manager, and receptionist SHALL list and view leads for their gym. They SHALL be able to mark a lead contacted, dismissed, or converted into a member (conversion MAY reuse members create).

#### Scenario: Receptionist lists leads
- **WHEN** a receptionist lists leads
- **THEN** they see their gym's leads only

#### Scenario: Convert lead
- **WHEN** staff convert a lead into a member with required profile fields
- **THEN** a member profile exists
- **AND** the lead is marked converted and linked to that member
