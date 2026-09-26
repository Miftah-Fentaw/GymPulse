## Context

See proposal.md — Why. Backend already has pending payments when `evidence_file_id` is set, payment review transitions, HMAC check-in tokens, staff/QR check-in POST, and file upload. Gaps are OpenAPI alignment, invoice-balance on approve, PWA/admin UX, rich seed including pending evidence rows, and removing unsupported social buttons.

## Goals / Non-Goals

**Goals:**
- End-to-end screenshot payment: member upload → pending → receptionist approve/reject → invoice balance + receipt.
- End-to-end QR attendance: member QR → receptionist scan → attendance row + present list.
- Seed dense enough that admin and PWA lists show real DB rows after `make seed`.
- PWA auth: email/password only + password visibility.

**Non-Goals:**
- Live Telebirr/CBE gateway charge APIs (manual evidence only).
- Native camera SDKs beyond browser `getUserMedia` / file input / QR decode in-browser.
- Google/Apple OAuth providers.
- Multi-branch kiosk hardware integration.

## Decisions

1. **Provider as free-text on `mobile_money` / `bank`**  
   Keep DB enum (`cash|bank|mobile_money|card|gateway`). UI offers Telebirr, CBE, other → stored in `provider`.  
   *Alt:* add enum values for each operator — rejected (schema churn; operators vary by gym).

2. **Evidence via existing `POST /v1/files` then payment create**  
   Member uploads image, then creates payment with `evidence_file_id` → server forces `pending`.  
   *Alt:* multipart payment endpoint — rejected (storage already separate).

3. **Approve MUST update invoice `paid_minor` and status**  
   Fix review path so approve applies the same balance logic as immediate cash capture.

4. **OpenAPI + domainFallback**  
   Document evidence + review + list-pending in `openapi.yaml`; implement in domain handlers until full codegen include-list expands. Validator already loads full `openapi.yaml`.

5. **QR in PWA**  
   Render token string as QR (client library); poll/refresh token before expiry (~60s). Desk enters scanned token into admin form or uses camera QR decode into `POST /v1/checkins` with `token`.

6. **Seed**  
   Expand demo_data: more sessions/bookings, unpaid invoices, 2–3 pending payments with placeholder evidence files (or skip binary file and use note-only pending via provider without file only when evidence required — prefer creating minimal PNG via seed or file row with local object). Prefer inserting `files` row pointing at a small seeded asset under storage root when possible; if storage path awkward, seed pending payments still work if we allow pending with `provider`+`reference` and optional evidence for demo — **spec will require evidence for screenshot path**; seed can write a tiny PNG into the configured local storage dir.

## Risks / Trade-offs

- [Risk] Fake/screenshot fraud → Mitigation: receptionist visual verify + reject reason; no auto-approve.
- [Risk] QR library size on PWA → Mitigation: small dependency; lazy-load check-in route.
- [Risk] Seed file paths differ per deploy → Mitigation: seed writes under configured local storage root or skips evidence file and uses staff-visible pending with reference text if file write fails (document in tasks).

## Migration Plan

No schema migration if existing `payments`/`files`/`attendance_events` columns suffice. Deploy: migrate (noop), `make generate` if OpenAPI changed, restart API, `make seed` for demo. Rollback: revert app/admin; pending payments remain in DB harmlessly.
