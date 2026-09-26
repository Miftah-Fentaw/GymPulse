## 1. Foundation

- [x] 1.1 Scaffold React + Vite + TypeScript in `app/` with Tailwind, TanStack Router/Query, react-i18next, packages/api-client
  - Verify: `cd app && pnpm install && pnpm run build` succeeds
- [x] 1.2 Add vite-plugin-pwa: web manifest, shell precache; logout clears Cache Storage
  - Verify: build emits manifest; logout helper clears caches
- [x] 1.3 Brand tokens (landing red on light kit layout) and shared UI primitives (buttons, inputs, cards)
  - Verify: CSS variables `--brand` ≈ `#e31c23`; primary buttons use it

## 2. App shell

- [x] 2.1 Auth routes: welcome, sign-in, sign-up (email primary; social buttons presentational)
  - Verify: routes render; English strings from i18n catalogs
- [x] 2.2 Authenticated shell: mobile bottom nav + tablet/desktop sidebar for Home / Explore / Schedule / Profile
  - Verify: &lt;768px bottom nav; ≥768px sidebar only

## 3. Member surfaces (design kit)

- [x] 3.1 Home: greeting, trending workouts, workout types, additional training list
  - Verify: sections match design structure with brand accents
- [x] 3.2 Explore: search + class/trainer results list
  - Verify: search field and result cards render
- [x] 3.3 Schedule: horizontal date strip + session timeline + reserve CTA
  - Verify: date strip and list render
- [x] 3.4 Profile: stats header, activities / statistics tabs (chart placeholder ok)
  - Verify: tabs switch; brand accents on active states
- [x] 3.5 Detail flows: workout detail and trainer profile (course/schedule tabs)
  - Verify: navigable from home/explore cards

## 4. i18n and polish

- [x] 4.1 English i18n catalog for all user-visible strings
  - Verify: no hard-coded UI sentences in route components (keys only)
- [x] 4.2 Production build and smoke check of key routes
  - Verify: `pnpm run build` in `app/`
