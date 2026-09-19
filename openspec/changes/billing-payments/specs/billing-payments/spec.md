## MODIFIED Requirements

### Requirement: Invoices
The system SHALL create invoices for chargeable events (at least membership assignment or renewal). An invoice MUST have gym_id, member_id, amounts, status (draft, issued, paid, overdue, void), and line items.

#### Scenario: Membership creates an invoice
- **WHEN** staff assign a paid plan to a member
- **THEN** an issued invoice is created for that member
- **AND** staff can retrieve it by id and by member

### Requirement: Manual payments
Staff SHALL record manual payments against an invoice: cash, bank transfer, or mobile money. The payment gateway interface MUST exist but the default driver SHALL be manual/no-op (record only, no charge API).

#### Scenario: Record a cash payment
- **WHEN** a receptionist records a cash payment covering an issued invoice
- **THEN** the payment is stored with method cash, amount, and actor
- **AND** the invoice status becomes paid when the sum of payments meets the invoice total

#### Scenario: Partial payment
- **WHEN** staff record a payment less than the invoice total
- **THEN** the invoice remains unpaid (not paid)
- **AND** the remaining balance is visible to staff

### Requirement: Receipts
The system SHALL issue a receipt for a recorded payment that staff and the member can retrieve.

#### Scenario: Receipt after payment
- **WHEN** a payment is recorded
- **THEN** a receipt is available with payment id, amount, method, and timestamp
- **AND** a member can view receipts for their own payments

### Requirement: Overdue tracking
The system SHALL mark issued invoices overdue when they are unpaid after their due date. Staff SHALL be able to list overdue invoices for the gym.

#### Scenario: Invoice becomes overdue
- **WHEN** an issued unpaid invoice's due date is in the past
- **THEN** listing overdue invoices includes it
- **AND** a paid invoice is not listed as overdue

### Requirement: Payment gateway interface
Chargeable gateways SHALL be invoked only through a Go interface. The default implementation MUST NOT call an external processor. Adding a real gateway MUST be a new driver, not a change to billing rules or frontends talking to the processor directly.

#### Scenario: Default driver records only
- **WHEN** the configured gateway is the manual/no-op driver
- **THEN** recording a payment persists in GymPulse
- **AND** no external HTTP charge call is made
