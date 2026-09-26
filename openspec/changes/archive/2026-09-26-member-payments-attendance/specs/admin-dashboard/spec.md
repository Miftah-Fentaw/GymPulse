## ADDED Requirements

### Requirement: Receptionist pending payments UI
The admin app SHALL provide a pending-payment review view usable by receptionist, manager, and owner: list pending screenshot payments (member, amount, provider, evidence preview/link), and approve or reject with reason. Cash-up and invoice list remain available.

#### Scenario: Receptionist reviews queue
- **WHEN** a receptionist opens billing review
- **THEN** pending payments with evidence are listed and each can be approved or rejected

### Requirement: Receptionist QR check-in UI
The admin check-in page SHALL accept a scanned or pasted QR token in addition to directory staff check-in, and SHALL refresh today/present lists from the API after success.

#### Scenario: Desk uses token field
- **WHEN** a receptionist pastes or scans a member check-in token and submits with a branch
- **THEN** check-in succeeds and the today list shows the new event
