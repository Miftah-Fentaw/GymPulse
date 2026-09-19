## Purpose

Member directory and profiles for a gym, always scoped to a gym and branch so multi-branch can be enabled later.

## Requirements

### Requirement: Member profiles
The system SHALL store a member profile with identity and contact fields needed to check in, bill, and contact the person. Each member MUST belong to exactly one gym and MUST have a home branch.

#### Scenario: Staff create a member
- **WHEN** an owner, manager, or receptionist submits a valid new member profile
- **THEN** the member is stored under the current gym and a chosen branch
- **AND** the member can be retrieved by staff of that gym

#### Scenario: Duplicate contact
- **WHEN** staff create a member with an email that already exists in the same gym
- **THEN** the server rejects the create
- **AND** no second member row is written

### Requirement: Gym and branch scope
Member reads and writes SHALL be scoped by gym_id. Branch-local staff views MAY filter by branch_id. A client MUST NOT read or mutate members of another gym by supplying a different gym id.

#### Scenario: Cross-gym access is denied
- **WHEN** an authenticated staff user requests a member whose gym_id is not their gym
- **THEN** the server responds as not found or forbidden
- **AND** no member data from the other gym is returned

### Requirement: Member status
A member SHALL have a status (at least active and archived). Archived members MUST remain in history (check-ins, invoices) but MUST NOT appear as active for check-in or new bookings by default.

#### Scenario: Archive a member
- **WHEN** a manager or owner archives a member
- **THEN** the member no longer appears in the default active member list
- **AND** past attendance and invoices for that member remain queryable by staff
