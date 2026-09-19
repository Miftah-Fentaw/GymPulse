## Why

Gyms need to record money without a card processor. Manual payments (cash, bank transfer, mobile money), invoices, receipts, and overdue lists come first; a gateway interface leaves room for Stripe later.

## What Changes

- Invoices and line items for membership charges.
- Record manual payments; mark invoices paid/partial/overdue.
- Receipts retrievable by staff and by the paying member.
- `PaymentGateway` Go interface with a manual/no-op driver as default.

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `billing-payments`: Invoices, manual payments, receipts, overdue, gateway interface.

## Impact

- Billing migrations and `server/internal/billing/`
- `/v1/invoices`, `/v1/payments`, `/v1/receipts`
- Membership assign/renew hooks to issue invoices
