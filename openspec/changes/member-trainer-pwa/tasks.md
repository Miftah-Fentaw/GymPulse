## 1. PWA foundation

- [ ] 1.1 Add router, pinia, tailwind, vite-plugin-pwa, `VITE_API_URL` client — verify: `npm run build` in `app/` succeeds and a manifest is emitted
- [ ] 1.2 Login, refresh (JSON body), logout; role-based redirect — verify: member vs trainer land on different homes; staff role is refused or sent away

## 2. Member flows

- [ ] 2.1 Membership status, attendance history, class book/cancel, workout log — verify: each against a running API (or e2e) for one happy path

## 3. Trainer flows

- [ ] 3.1 Client list and client workout history for assigned members only — verify: unassigned client route is empty/denied

## 4. Integration verification

- [ ] 4.1 No Supabase client; SW does not cache `/v1` JSON as a source of truth — verify: `rg supabase app/src` empty; SW config network-first for API
