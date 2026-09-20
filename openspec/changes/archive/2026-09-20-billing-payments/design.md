## Context

See proposal.md — Why. Depends on members-and-memberships. Amounts are integer minor units.

## Goals / Non-Goals

**Goals:**
- Invoices from membership assignment, manual payments, receipts, overdue list, gateway interface with no-op default

**Non-Goals:**
- Stripe/M-Pesa/Paystack charge APIs
- Accounting exports, tax engines
- Frontend

## Decisions

### Decision 1: Invoice on assign

Creating a paid membership issues an invoice (status issued, due date = start or gym default). Free/zero-price plans create a paid invoice of 0 or skip—prefer a paid 0 invoice for a uniform trail.

### Decision 2: Overdue computed or stored

Store status and also compute: `issued` becomes `overdue` when `due_at < now` and balance > 0. A listing query can compute so we do not need a cron for MVP; an optional startup job can persist status later.

### Decision 3: Gateway interface

```go
type Gateway interface {
    Charge(ctx, ChargeRequest) (ChargeResult, error)
}
```

Manual driver: persist payment only, `Charge` returns unimplemented or is unused. Recording cash does not call `Charge`.

### Decision 4: Receipts

A receipt is a stable number + payment id, not a PDF in this slice (PDF/storage later). JSON is enough.

## Risks / Trade-offs

- [No cron] → overdue list uses query-time comparison.
- [Refunds] → out of scope; void invoice + note.

## Migration Plan

Additive billing tables.

## Open Questions

None. Currency on gym row from members slice or added here if missing.
