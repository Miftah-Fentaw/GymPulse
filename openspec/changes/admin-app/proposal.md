## Why

Staff need a dashboard to run the gym once the server APIs exist. The admin app is the first frontend, for owner, manager, and receptionist only.

## What Changes

- Replace the Vue scaffold in `admin/` with an authenticated SPA: login, shell, member directory, memberships, check-in, billing (manual), class schedule.
- Talk only to the GymPulse REST API (`VITE_API_URL`). No Supabase client.
- Role-based navigation (owner/manager vs receptionist).
- Vue 3 + Vite + Vue Router + Pinia + Tailwind as specified in project context.

## Capabilities

### New Capabilities

- `admin-dashboard`: Staff SPA for operating a single gym via the server API.

### Modified Capabilities

<!-- none — backend requirements already specified; this change adds the staff UI capability -->

## Impact

- `admin/src/` routing, auth store, API client
- Depends on server changes through billing/classes at least for a useful first ship; can ship incrementally behind the same change only after those APIs exist
