## 1. Schema

- [ ] 1.1 Migration for invoices, line items, payments, receipt numbers; UUID PKs from Go — verify: migrate up

## 2. Domain

- [ ] 2.1 Assigning a plan issues an invoice — verify: test from membership service/hook
- [ ] 2.2 Record cash/bank/mobile_money payments; paid vs partial — verify: unit/HTTP tests
- [ ] 2.3 Receipt JSON for staff and owning member — verify: other members 403
- [ ] 2.4 Overdue list uses due date and remaining balance — verify: fixture with past due unpaid vs paid
- [ ] 2.5 `Gateway` interface + manual driver; cash path does not HTTP out — verify: mock/spy shows zero external calls

## 3. OpenAPI and integration

- [ ] 3.1 Update `openapi.yaml` for invoices/payments/receipts and `make generate` — verify: generate is clean
- [ ] 3.2 Member + plan + invoice + cash payment + receipt + overdue list — verify: `go test` against local Postgres 16 (TEST_DATABASE_URL)

## 4. Money extras (MVP)

- [ ] 4.1 Void unpaid invoice; reject void of paid — verify: tests
- [ ] 4.2 Refund with Idempotency-Key; recompute invoice balance — verify: partial refund
- [ ] 4.3 Line discount on unpaid invoice — verify: paid invoice rejected
- [ ] 4.4 Member payment history + daily cash-up — verify: member sees own; cash-up gym-local day
- [ ] 4.5 Idempotency-Key on payment create — verify: double submit one row

## 5. Later

- [ ] 5.1 Promo code CRUD — verify: documented Later; not required for MVP
