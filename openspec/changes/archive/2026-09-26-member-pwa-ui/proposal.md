## Why

The member/trainer PWA is still a stub (`app/` has no React scaffold). Members need an installable mobile-first app that matches the approved PWA design kit, uses GymPulse landing brand red (not the kit’s green), and follows bottom-nav on phones with a sidebar on tablet/desktop.

## What Changes

- Scaffold `app/` as React + Vite + TypeScript PWA (TanStack Router/Query, Tailwind, react-i18next, vite-plugin-pwa).
- Implement the design-kit flows: onboarding/auth, Home, Explore, Schedule, Profile, workout/trainer detail, with mobile bottom nav and tablet/desktop left sidebar.
- Brand tokens from landing (`#e31c23` primary) on the light design layout.
- Wire shell login/refresh/logout patterns toward `packages/api-client`; use local demo content where workout-catalog APIs are not yet available.
- Emit web app manifest; cache app shell; clear caches on logout.

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `member-trainer-pwa`: Mobile bottom-nav / desktop sidebar shell, light design-kit UI with GymPulse brand red, auth and primary member tabs.

## Impact

- `app/` full React PWA replace of stub
- Design reference: `ui design inspiration images/pwa page design.jpg`
- Depends on existing auth/API where available; no server OpenAPI changes required for this UI shell
