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

## ADDED Requirements

### Requirement: Void invoice
Owner and manager SHALL void an unpaid invoice via `POST /v1/invoices/{invoiceId}/void`. Paid invoices MUST NOT be voided; staff MUST refund instead. Void MUST be audited.

#### Scenario: Void unpaid
- **WHEN** a manager voids an issued unpaid invoice
- **THEN** the invoice status is void
- **AND** it is not listed as overdue

### Requirement: Refund payment
Owner and manager SHALL refund a recorded payment (full or partial) via `POST /v1/payments/{paymentId}/refund` with an Idempotency-Key. Invoice balances MUST be recomputed. Gateways are not charged in the MVP (manual driver).

#### Scenario: Partial refund
- **WHEN** a manager refunds part of a cash payment
- **THEN** a refund record exists
- **AND** the invoice remaining balance increases by that amount

### Requirement: Invoice line discount
Owner and manager SHALL apply a one-off amount or percent discount on an issued unpaid invoice via `POST /v1/invoices/{invoiceId}/discount`. This is not a promo-code engine.

#### Scenario: Discount unpaid invoice
- **WHEN** a manager applies a valid discount to an unpaid invoice
- **THEN** the invoice total decreases
- **AND** a paid invoice is rejected

### Requirement: Promo codes
Promo code CRUD and redemption SHALL be Later. MVP gyms use manual line discounts only.

#### Scenario: Promo later
- **WHEN** a client calls promo-code endpoints before that later slice
- **THEN** the operation is documented as Later in OpenAPI
- **AND** it is not required for MVP billing

### Requirement: Member payment history
Staff and the owning member SHALL list that member's payments via `GET /v1/members/{memberId}/payments`. Other members MUST be denied.

#### Scenario: Member views own payments
- **WHEN** a member lists their payments
- **THEN** only that member's payments are returned

### Requirement: Daily cash-up
Owner, manager, and receptionist SHALL retrieve totals by payment method for a gym-local day (optional branch and method filters) via `GET /v1/billing/cash-up`.

#### Scenario: End of day cash
- **WHEN** a receptionist requests cash-up for today
- **THEN** the response totals recorded cash (and other methods) for that gym-local day
- **AND** another gym's payments are excluded

### Requirement: Payment idempotency
Recording a payment or refund SHALL require or honor `Idempotency-Key`. Replays MUST NOT create a second money row.

#### Scenario: Double submit
- **WHEN** staff record the same payment twice with one Idempotency-Key
- **THEN** one payment exists
- **AND** both responses refer to it
