## 1. Client and shell

- [ ] 1.1 Run `make generate` and depend on `packages/api-client` from admin — verify: admin imports the generated client; `pnpm` workspace resolves it
- [ ] 1.2 Replace admin with React + Vite + TypeScript, TanStack Router, TanStack Query, Tailwind, shadcn/ui, react-hook-form + zod, react-i18next (English catalog) — verify: `pnpm --filter admin build` succeeds; `rg` finds no hard-coded button labels outside `locales/`
- [ ] 1.3 Login, cookie refresh, logout, route guards; reject member-only and trainer-only — verify: logged-out `/members` redirects; member-only cannot open shell

## 2. Core pages

- [ ] 2.1 Member list/create/detail via api-client — verify: create then list against running API
- [ ] 2.2 Assign/freeze/cancel membership — verify: happy path
- [ ] 2.3 Check-in search + submit and today's list — verify: attendance appears
- [ ] 2.4 Invoice + cash payment — verify: invoice shows paid
- [ ] 2.5 Leads list (read/convert) — verify: lead appears after public POST

## 3. Integration verification

- [ ] 3.1 Core loop click-through: create member, assign plan, pay, check in — verify: each step in UI
- [ ] 3.2 Admin env sample is API origin only — verify: `.env.example`
