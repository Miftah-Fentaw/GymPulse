## 1. Public API

- [ ] 1.1 Add public GET plans and schedule (published only) and POST lead; rate-limit POST — verify: unauthenticated GET works; unpublished plans omitted; POST persists a row in `gympulse`
- [ ] 1.2 Migration for `leads` with RLS enabled and no policies — verify: migrate up

## 2. Landing UI

- [ ] 2.1 Home, plans, schedule, contact/trial pages using `VITE_API_URL` — verify: `npm run build` in `landing/` succeeds
- [ ] 2.2 Trial form success and validation errors — verify: empty submit does not POST successfully; valid submit shows success
- [ ] 2.3 CTA to PWA/admin as links, not embedded staff UI — verify: no login-as-staff on landing

## 3. Integration verification

- [ ] 3.1 `rg supabase landing/src` is empty; env sample is API URL only — verify: command/output in review
