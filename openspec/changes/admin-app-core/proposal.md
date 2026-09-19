## Why

Staff need to click through the daily loop (member, membership, payment, check-in) before classes and reports exist. A thin React admin unblocks real usage.

## What Changes

- First: generate/use `packages/api-client` and a React + Vite + TypeScript app shell (TanStack Router, TanStack Query, Tailwind, shadcn/ui, react-hook-form + zod, react-i18next).
- Then core loop screens: members, memberships/plans, invoices/manual payments, check-in, leads.
- Cookie refresh per auth design. English catalogs only (no hard-coded strings).

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `admin-dashboard`: Staff auth, generated client, core staff loop, i18n.

## Impact

- Replace Vue scaffold in `admin/` with React
- Depends on billing-payments APIs
