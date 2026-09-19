## 1. App shell

- [ ] 1.1 Add Vue Router, Pinia, Tailwind, and an API client using `VITE_API_URL` only — verify: `npm run build` in `admin/` succeeds and the bundle has no `@supabase` import (`rg` on `admin/src` is empty)
- [ ] 1.2 Login page + auth store (login, refresh, logout) + route guards — verify: visiting `/members` while logged out redirects to login
- [ ] 1.3 Reject member and trainer roles after login — verify: a mocked member token cannot open the shell

## 2. Staff pages

- [ ] 2.1 Member list/create/detail against `/v1/members` — verify: browser or component test: create then see in list (with API running)
- [ ] 2.2 Assign/freeze/cancel membership UI — verify: one happy-path flow against the API
- [ ] 2.3 Check-in (search + submit) — verify: attendance appears in today's list
- [ ] 2.4 Manual payment against an invoice — verify: invoice shows paid
- [ ] 2.5 Class session create + booking list — verify: session appears on the schedule

## 3. Integration verification

- [ ] 3.1 Role-based nav: receptionist cannot open owner-only routes — verify: 403 from API and hidden nav
- [ ] 3.2 Confirm no Supabase client, no DATABASE_URL in admin env sample — verify: `.env.example` in admin lists API URL only
