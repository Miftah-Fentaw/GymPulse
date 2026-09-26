## Why

Members need to pay invoices from the PWA with a payment screenshot (Telebirr, CBE, and similar), and receptionists need a clear queue to approve or reject those payments. Members also need a live check-in QR, and the front desk needs to scan it into attendance. Demo seed and PWA auth polish (no fake Google/Apple, password visibility) must make both apps feel fully populated and usable end to end.

## What Changes

- Expand `make seed` with richer demo data: more members, classes, invoices, **pending screenshot payments**, and attendance so admin and PWA are never empty when the DB has rows.
- Members submit screenshot-backed payments (`mobile_money` / `bank` + `provider` like telebirr/cbe + evidence file) against their unpaid invoices; status stays `pending` until staff review.
- Receptionist (and owner/manager) review queue: approve/reject pending payments with reason; approve updates invoice balance and receipt.
- PWA check-in screen: live QR from `GET /v1/me/checkin-token` (refresh while online); offline last-token display where already specified.
- Admin check-in: QR/token scan + existing staff directory check-in; present/today lists stay wired to DB.
- **Remove** decorative Google/Apple sign-in buttons from the PWA (email/password only; product does not support social IdP).
- Add password show/hide (eye) on PWA sign-in and sign-up (match admin).
- Align OpenAPI with evidence payment create/review and invoice payment paths; keep Go as source of truth; no external payment gateway charge APIs.

## Capabilities

### New Capabilities

_(none — extend existing capabilities)_

### Modified Capabilities

- `billing-payments`: Screenshot/evidence payments with provider labels (Telebirr, CBE, etc.), pending status, staff approve/reject, member-facing submit from PWA.
- `checkin-attendance`: Member PWA QR surface and receptionist scan UX using existing token + check-in APIs.
- `member-trainer-pwa`: Check-in QR page, member billing/pay-with-screenshot flow, email/password-only auth UI with password visibility, richer catalog from seeded API data.
- `admin-dashboard`: Receptionist billing review queue and QR scan check-in in admin.

## Impact

- `openapi.yaml` + `make generate` (payment evidence, review, list pending; any path alignment for invoice payments).
- `server/internal/http/domain_handlers.go`, billing seed in `server/internal/seed/`.
- `admin` BillingPage + CheckinPage (+ i18n).
- `app` SignIn/SignUp, new Check-in and Pay/Invoices routes, Nav, i18n, catalog/seed consumers.
- No new payment gateway SDKs; file upload via existing storage (`POST /v1/files`).
