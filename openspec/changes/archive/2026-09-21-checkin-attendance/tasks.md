## 1. Schema

- [ ] 1.1 `attendance_events` and stable `member_code`; UUID PKs; timestamptz — verify: migrate up via TEST_DATABASE_URL
- [ ] 1.2 sqlc queries — verify: `make generate` includes sqlc

## 2. Signed QR

- [ ] 2.1 Issue 60s signed token + member code; staff consume uses MembershipGrantsAccess — verify: valid token checks in; expired token rejected; frozen membership rejected
- [ ] 2.2 Document fallback in README/API notes: cached code + photo, weaker than signed token — verify: docs mention replay risk

## 3. Staff and idempotency

- [ ] 3.1 Staff search check-in method `staff` — verify: member-only cannot check others in
- [ ] 3.2 Double check-in within 15 minutes returns the same event — verify: one row
- [ ] 3.3 Code+photo fallback records `code_fallback` or `staff` — verify: HTTP test

## 4. History and OpenAPI

- [ ] 4.1 History by gym/branch/day using gym timezone; member sees own only — verify: tests
- [ ] 4.2 Update `openapi.yaml` and `make generate` — verify: no generate diff

## 5. Integration verification

- [ ] 5.1 Member with current membership: issue QR, consume, list today — verify: `go test` against local Postgres 16 (TEST_DATABASE_URL)

## 6. Desk extras (MVP)

- [ ] 6.1 `GET /v1/me/checkin-token` — verify: member only; token expires at 60s
- [ ] 6.2 Attendance correction PATCH (owner/manager) + audit — verify: receptionist 403; voided event excluded from present
- [ ] 6.3 `GET /v1/checkins/present` — verify: gym/branch scoped
- [ ] 6.4 Honor Idempotency-Key on check-in POSTs in addition to the 15-minute window — verify: replay returns same event

## 7. Later

- [ ] 7.1 `GET /v1/checkins/peak-hours` — verify: documented Later; owner/manager only
