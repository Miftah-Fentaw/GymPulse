## ADDED Requirements

### Requirement: Screenshot evidence payments
The system SHALL accept member or staff payment submissions that include an evidence file (payment screenshot) and a provider label (e.g. telebirr, cbe, other). Such payments MUST be created with status `pending` and MUST NOT increase invoice `paid_minor` until approved. Method MUST be `mobile_money` or `bank` for screenshot flows (cash remains immediate approve when recorded by staff without evidence).

#### Scenario: Member submits Telebirr screenshot
- **WHEN** an authenticated member uploads a screenshot file and posts a payment against their unpaid invoice with `method=mobile_money`, `provider=telebirr`, and `evidence_file_id`
- **THEN** the payment is stored as `pending` and the invoice balance is unchanged

#### Scenario: Cash without evidence stays immediate
- **WHEN** staff records a cash payment without `evidence_file_id`
- **THEN** the payment is `approved` and the invoice `paid_minor` increases accordingly

### Requirement: Staff payment review queue
Owner, manager, and receptionist SHALL list pending payments for the gym and SHALL approve or reject each with an optional reason. Approving MUST set status `approved`, attach reviewer metadata, increase the invoice `paid_minor`, and recompute invoice status (`partial`/`paid`). Rejecting MUST set status `rejected` with reason and MUST NOT change invoice paid amounts. Review MUST be audited.

#### Scenario: Receptionist approves pending payment
- **WHEN** a receptionist approves a pending evidence payment
- **THEN** the payment becomes `approved` and the related invoice paid balance increases by the payment amount

#### Scenario: Receptionist rejects pending payment
- **WHEN** a receptionist rejects a pending payment with a reason
- **THEN** the payment becomes `rejected`, the reason is stored, and the invoice balance is unchanged

### Requirement: Member lists own invoices and payments
An authenticated member SHALL list their own unpaid/issued invoices and payment history (including pending and rejected). Members MUST NOT see other members' billing rows.

#### Scenario: Member opens billing in PWA
- **WHEN** a member requests their invoices and payments
- **THEN** only rows for that member's profile are returned
