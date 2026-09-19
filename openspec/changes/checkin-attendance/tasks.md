## 1. Schema

- [ ] 1.1 `attendance_events` and stable `member_code`; UUID PKs; timestamptz — verify: testcontainers migrate up
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

- [ ] 5.1 Member with current membership: issue QR, consume, list today — verify: `go test` testcontainers Postgres 16
