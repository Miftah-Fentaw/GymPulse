## Context

See proposal.md — Why. Landing is a Vue 3 Vite scaffold. Public API routes may not exist yet; this change includes adding them on the server (`GET /v1/public/plans`, `GET /v1/public/schedule`, `POST /v1/public/leads`) if missing. Rate-limit the POST.

## Goals / Non-Goals

**Goals:**
- Static-friendly Vue pages, public fetch, lead POST, gym-branding from API or env
- Vue 3 (keep one frontend language; Astro remains an alternative if we rebuild later)

**Non-Goals:**
- CMS, blog, multi-gym marketing of the GymPulse product itself
- Member login on this site (link out to PWA)

## Decisions

### Decision 1: Public endpoints on the Go server

Do not use a headless CMS. Publish flag on plans/sessions. Leads table in `gympulse` with RLS-on-no-policies like everything else.

### Decision 2: Stay on Vue

The scaffold is Vue; switching to Astro is a separate change.

### Decision 3: Rate limit leads

In-memory or simple DB throttle per IP to reduce spam. No-op email driver can log the lead.

## Risks / Trade-offs

- [Spam] → rate limit + optional future captcha behind an interface.
- [Cache] → public GETs can be cached briefly at the CDN; not required in this slice.

## Migration Plan

Additive `leads` table + public routes. Frontend deploy with `VITE_API_URL`.

## Open Questions

None.
