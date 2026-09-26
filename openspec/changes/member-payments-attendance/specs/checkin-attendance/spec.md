## ADDED Requirements

### Requirement: Member check-in QR in the PWA
The member PWA SHALL provide a check-in screen that calls `GET /v1/me/checkin-token` and displays a scannable QR encoding the signed token (and shows the stable member code). While online, the PWA SHALL refresh the token before expiry so the QR remains valid. While offline, the PWA SHALL show the last cached QR/code per existing offline rules.

#### Scenario: Member shows QR at the desk
- **WHEN** a signed-in member with an active membership opens check-in
- **THEN** a QR for a fresh server-signed token is shown and refreshes while the screen stays open and online

### Requirement: Receptionist QR scan check-in
Owner, manager, and receptionist SHALL submit a scanned or pasted check-in token via `POST /v1/checkins` (method `qr`) for a branch. A successful scan MUST create (or idempotently return) an attendance event and update the present/today lists.

#### Scenario: Desk scans member QR
- **WHEN** a receptionist posts a valid check-in token for a branch
- **THEN** an attendance event with method `qr` is recorded for that member and appears in today's check-ins
