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
- [ ] 3.2 Member + plan + invoice + cash payment + receipt + overdue list — verify: `go test` with testcontainers Postgres 16
