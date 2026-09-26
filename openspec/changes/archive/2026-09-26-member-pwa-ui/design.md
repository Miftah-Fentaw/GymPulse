## Context

`member-trainer-pwa` specified behavior but `app/` was never scaffolded. The design kit is a light, card-based fitness app with green accents; GymPulse brand red from landing replaces green. Mobile is primary; tablet/desktop mirror the same tabs in a left sidebar.

## Goals / Non-Goals

**Goals**

- Ship a polished, installable PWA UI matching the design structure.
- Bottom nav (Home, Explore, Schedule, Profile) on viewports &lt;768px; permanent left sidebar from tablet up.
- Brand red primary actions; light backgrounds; rounded cards as in the kit.
- i18n catalogs; PWA manifest + shell precache; logout clears caches.

**Non-Goals**

- Payment gateway charge APIs (confirmation UI may be presentational).
- Full trainer client CRUD beyond navigation shells.
- Pixel-perfect duplication of every kit screen if GymPulse domain lacks data (use demo fixtures).

## Decisions

| Decision | Why |
|---|---|
| Landing red `#e31c23` instead of kit green | User: branding color as landing; layout as design image |
| Light theme | Matches the design kit “Preview Light Version” |
| Demo fixtures for workouts/trainers lists | Catalog APIs are incomplete; UI must still match design |
| Sidebar = same four destinations as bottom nav | Consistent IA across breakpoints |

## Risks

- Demo data may confuse if mistaken for live API data — label demo where needed in empty states, not on every card.
- Social login buttons are presentational until OAuth exists (email/password is the real path).
