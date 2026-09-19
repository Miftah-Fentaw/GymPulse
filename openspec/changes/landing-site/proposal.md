## Why

A deployed gym needs a public site for plans, schedule, contact, and trial signup without exposing staff tools or the database.

## What Changes

- Turn `landing/` into a public marketing site for **a deployed gym** (not a multi-tenant SaaS catalog).
- Public pages: home, plans, class schedule, contact, trial/signup request.
- Public reads go through the Go API (public endpoints). Trial signup creates a lead or pending member via the server, never via Supabase.

## Capabilities

### New Capabilities

- `landing-site`: Public gym marketing site that uses only public GymPulse API endpoints.

### Modified Capabilities

<!-- none -->

## Impact

- `landing/src/`
- Server may need public, unauthenticated endpoints for published plans and schedule (add in this change if missing)
