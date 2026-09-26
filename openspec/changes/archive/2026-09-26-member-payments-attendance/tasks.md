## 1. API contract and server billing

- [x] 1.1 Update `openapi.yaml` for evidence payments: `evidence_file_id` on payment create, `provider` labels, list pending (`GET /v1/payments?status=pending` or dedicated path), and approve/reject (`POST`/`PATCH /v1/payments/{paymentId}`). Verify: `make generate` succeeds (or OpenAPI validates) and paths appear in full `openapi.yaml`.
- [x] 1.2 Implement/align domain handlers: create payment with evidence → `pending`; approve bumps invoice `paid_minor` + status; reject stores reason; list pending for staff. Verify: manual curl or Go test against local DB for pending → approve → invoice balance.
- [x] 1.3 Ensure member can list own invoices/payments (filter by member profile from auth). Verify: member token cannot see another member's rows.

## 2. Rich seed data

- [x] 2.1 Expand `server/internal/seed/demo_data.go` with more members, class sessions/bookings, workouts, unpaid invoices, and at least two **pending** screenshot payments (Telebirr/CBE providers) plus tiny evidence file rows when storage allows. Verify: `make seed` exits 0; SQL counts for invoices/payments/sessions/members are non-trivial.
- [x] 2.2 Update `users.md` with any new demo emails/password reminder. Verify: doc matches seeded accounts.

## 3. Admin receptionist UX

- [x] 3.1 Billing page: pending review queue with evidence preview/link, approve/reject + reason; keep cash-up and invoice pay. Verify: receptionist login shows seeded pending payments and can approve one.
- [x] 3.2 Check-in page: token/QR paste or camera scan field → `POST /v1/checkins` with token + branch; refresh today/present. Verify: token from member endpoint check-ins successfully and appears in today list.
- [x] 3.3 Add i18n keys for new admin strings. Verify: no hard-coded English left in new UI.

## 4. PWA member UX

- [x] 4.1 Remove Google/Apple buttons from SignIn/SignUp; add password eye toggles. Verify: auth screens show email/password only with visibility control.
- [x] 4.2 Add Check-in route + nav: poll `GET /v1/me/checkin-token`, render QR, show member code, refresh before expiry. Verify: logged-in member sees updating QR; desk can check them in.
- [x] 4.3 Add Billing/Pay route: list member invoices/payments; upload screenshot via `POST /v1/files`; submit pending payment with provider (Telebirr/CBE/other). Verify: pending payment appears in admin queue.
- [x] 4.4 i18n catalogs for new PWA strings; wire nav. Verify: English keys resolve on check-in and billing screens.

## 5. End-to-end verification

- [x] 5.1 Run `make seed`, restart API, exercise receptionist approve + QR check-in + member pay screenshot. Verify: admin and PWA show populated DB-backed lists; attendance and payment statuses update as specified.
