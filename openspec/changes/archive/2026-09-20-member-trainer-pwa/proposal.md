## Why

Members and trainers need a PWA. One account can hold a member profile, trainer role, or both. Offline, the last check-in QR stays on screen.

## What Changes

- React + Vite PWA (vite-plugin-pwa / Workbox): cache app shell + last-known check-in QR; authenticated `/v1` network-first and not cached long-term; logout clears all caches.
- TanStack Router/Query, shadcn, react-hook-form + zod, react-i18next, packages/api-client.
- View switcher; member and trainer flows; 60s QR refresh while online.

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `member-trainer-pwa`: View switching, Workbox cache, booking/workouts, refresh, i18n.

## Impact

- Replace Vue scaffold in `app/`
