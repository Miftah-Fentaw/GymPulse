## 1. Schema

- [ ] 1.1 Migration for `attendance_events` (member_id, gym_id, branch_id, method, occurred_at) with RLS — verify: migrate up; table in `gympulse`
- [ ] 1.2 Member QR/token column or table — verify: sqlc generate succeeds

## 2. Check-in

- [ ] 2.1 Staff/kiosk QR validate uses `MembershipGrantsAccess`; success writes event method `qr` — verify: tests for current vs expired/frozen
- [ ] 2.2 Staff search check-in writes method `staff` — verify: receptionist can, member role cannot check others in
- [ ] 2.3 Duplicate window returns the existing event — verify: two check-ins inside the window yield one row

## 3. History

- [ ] 3.1 Staff list by day/branch; member list own only — verify: HTTP tests for scope

## 4. Integration verification

- [ ] 4.1 Create member with current membership, check in, list today — verify: `go test` against Postgres
