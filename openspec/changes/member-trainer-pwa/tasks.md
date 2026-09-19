## 1. PWA foundation

- [ ] 1.1 React + Vite + TypeScript app using packages/api-client, TanStack Router/Query, Tailwind, shadcn, react-hook-form + zod, react-i18next — verify: `pnpm --filter app build` succeeds
- [ ] 1.2 vite-plugin-pwa/Workbox: precache shell; cache last check-in QR; `/v1` network-first — verify: Workbox config; offline QR scenario documented/tested
- [ ] 1.3 Login, cookie refresh, view switch for member/trainer/combined; staff-only refused — verify: three account shapes

## 2. Member and trainer flows

- [ ] 2.1 Membership, attendance, class book/cancel, workout log, online QR refresh every 60s — verify: happy paths against API
- [ ] 2.2 Trainer clients and workouts for assigned only — verify: unassigned denied
- [ ] 2.3 No hard-coded UI strings outside catalogs — verify: review/locales

## 3. Integration verification

- [ ] 3.1 Manifest emitted; English default — verify: build output
