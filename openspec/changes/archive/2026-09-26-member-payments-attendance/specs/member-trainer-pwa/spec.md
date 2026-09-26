## ADDED Requirements

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
