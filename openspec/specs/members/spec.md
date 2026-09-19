## Purpose

Member directory and profiles for a gym, always scoped to a gym and branch. A member profile is attached to a user account that may also hold staff roles.

## Requirements

### Requirement: Member profiles
The system SHALL store a member profile with identity and contact fields needed to check in, bill, and contact the person. Each member MUST belong to exactly one gym, MUST have a home branch, and MUST be linked to a user account.

#### Scenario: Staff create a member
- **WHEN** an owner, manager, or receptionist submits a valid new member profile
- **THEN** the member is stored under the current gym and a chosen branch
- **AND** a user account exists (new or existing) with that member profile
- **AND** the member can be retrieved by staff of that gym

#### Scenario: Duplicate contact
- **WHEN** staff create a member with an email that already exists in the same gym
- **THEN** the server rejects the create
- **AND** no second member row is written

#### Scenario: Existing staff becomes a member
- **WHEN** staff attach a member profile to an existing user in the same gym who has none
- **THEN** that account has both its staff roles and a member profile
- **AND** login still uses the same email and password

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

### Requirement: Member search and filters
Staff member list SHALL support search (`q` against name, email, phone, member_code) and filters for status, branch, and plan. Default list is active members. Results MUST be cursor-paginated.

#### Scenario: Search by code
- **WHEN** a receptionist lists members with q equal to a member_code
- **THEN** that member is in the result
- **AND** unrelated members are not required to appear

### Requirement: Restore archived member
Owner and manager SHALL restore an archived member via `POST /v1/members/{memberId}/restore`. Restore MUST NOT by itself grant check-in access; a current membership is still required.

#### Scenario: Restore
- **WHEN** a manager restores an archived member
- **THEN** the member appears in the default active list
- **AND** history rows are unchanged

### Requirement: Member notes
Owner, manager, and receptionist SHALL add and list internal notes on a member. Members MUST NOT read staff notes.

#### Scenario: Staff note
- **WHEN** a receptionist posts a note on a member
- **THEN** staff of that gym can list it
- **AND** the member cannot read it

### Requirement: Emergency contact
Member profiles SHALL store optional emergency contact name and phone. Staff and the owning member MAY read them. Another member MUST NOT.

#### Scenario: Patch emergency contact
- **WHEN** staff or the member sets emergency contact fields
- **THEN** a later GET of that member includes them
- **AND** another member's GET is denied

### Requirement: Member CSV import and export
Owner and manager SHALL export the gym's members as CSV and import a CSV (with a dry-run query). Import MUST be gym-scoped, MUST reject duplicate emails in the gym, and MUST NOT create users in another gym.

#### Scenario: Export
- **WHEN** a manager exports members
- **THEN** the CSV includes that gym's members
- **AND** another gym's members are omitted
