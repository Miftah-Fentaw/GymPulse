## MODIFIED Requirements

### Requirement: Short-lived signed QR
The member check-in QR SHALL encode a short-lived server-signed token (expiry **60 seconds**) plus a stable member code. The PWA SHALL refresh the token while online. Staff/kiosk SHALL submit the token to the server. Check-in MUST require a current access-granting membership. A successful check-in MUST record member, gym, branch, timestamp, and method `qr`.

#### Scenario: Valid fresh QR
- **WHEN** a receptionist or kiosk submits an unexpired signed token for a member with a current membership at that gym
- **THEN** the server records an attendance event at the current branch
- **AND** the response indicates success

#### Scenario: Expired token is rejected
- **WHEN** a signed token older than 60 seconds is submitted
- **THEN** the server refuses check-in as expired
- **AND** no attendance event is stored unless the desk uses the fallback path

#### Scenario: QR for expired or frozen membership
- **WHEN** a valid token is presented for a member whose membership does not currently grant access
- **THEN** the server refuses check-in
- **AND** no attendance event is stored

### Requirement: Offline static-code fallback
If the PWA cannot refresh the signed token (offline), it SHALL display the last cached member QR/code (Workbox). Desk staff SHALL verify that code together with the member's photo and record check-in as method `staff` or `code_fallback`. This fallback MUST be documented as weaker than the signed token: a photographed code can be replayed unless staff match the photo.

#### Scenario: Offline member shows cached code
- **WHEN** the PWA is offline and a last-known check-in QR is in the cache
- **THEN** the app still displays that QR/code
- **AND** it does not claim the signed token is currently valid

#### Scenario: Desk verifies code plus photo
- **WHEN** a receptionist looks up the member by code, confirms the photo, and records check-in
- **THEN** an attendance event is stored
- **AND** a code-only check-in without photo confirmation is not the automated QR path

### Requirement: Staff-assisted check-in
Owner, manager, and receptionist SHALL be able to check a member in by searching the member directory without a QR.

#### Scenario: Receptionist checks in by search
- **WHEN** a receptionist selects an eligible member and confirms check-in
- **THEN** an attendance event is recorded with method staff
- **AND** the member appears in that day's attendance list for the branch

### Requirement: Idempotent attendance
Scanning or submitting check-in twice for the same member at the same branch within a short configured window (default 15 minutes) MUST NOT create a second attendance row. The server SHALL return the existing event.

#### Scenario: Double scan
- **WHEN** the same member is checked in twice at the same branch inside the window
- **THEN** only one attendance row exists
- **AND** the second response refers to the first event

### Requirement: Attendance history
The system SHALL expose attendance history filtered by gym, and optionally by branch, member, and date range, using the gym IANA time zone for "today". Members SHALL see only their own history. Staff SHALL see their gym's history according to role.

#### Scenario: Member views own history
- **WHEN** a member requests attendance history
- **THEN** the server returns that member's check-ins only

#### Scenario: Staff view a day
- **WHEN** a receptionist requests today's attendance for their branch
- **THEN** the server returns check-ins for that branch and day in the gym time zone
- **AND** does not include other gyms
