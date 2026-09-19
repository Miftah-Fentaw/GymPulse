## Purpose

Front-desk and member check-in, including QR check-in, with an attendance history staff and members can query.

## Requirements

### Requirement: QR check-in
The system SHALL let a current member check in by presenting a gym-issued QR (or equivalent code) that the server validates. A successful check-in MUST record member, gym, branch, timestamp, and method.

#### Scenario: Valid QR for a current member
- **WHEN** a receptionist or kiosk submits a valid, unexpired QR for a member with a current membership at that gym
- **THEN** the server records an attendance event at the current branch
- **AND** the response indicates success

#### Scenario: QR for expired or frozen membership
- **WHEN** a QR is presented for a member whose membership does not currently grant access
- **THEN** the server refuses check-in
- **AND** no attendance event is stored

### Requirement: Staff-assisted check-in
Owner, manager, and receptionist roles SHALL be able to check a member in by searching the member directory without a QR.

#### Scenario: Receptionist checks in by search
- **WHEN** a receptionist selects an eligible member and confirms check-in
- **THEN** an attendance event is recorded with method staff
- **AND** the member appears in that day's attendance list for the branch

### Requirement: Attendance history
The system SHALL expose attendance history filtered by gym, and optionally by branch, member, and date range. Members SHALL see only their own history. Staff SHALL see their gym's history according to role.

#### Scenario: Member views own history
- **WHEN** a member requests attendance history
- **THEN** the server returns that member's check-ins only

#### Scenario: Staff view a day
- **WHEN** a receptionist requests today's attendance for their branch
- **THEN** the server returns check-ins for that branch and day
- **AND** does not include other gyms
