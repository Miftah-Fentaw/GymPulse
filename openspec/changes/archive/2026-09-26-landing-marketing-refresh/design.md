## Context

Earlier `landing-site` assumed Astro SSR/static with React islands. The shipped marketing site is a Vue 3 + Vite SPA that injects crawlable head tags and generates `sitemap.xml` / `robots.txt` at build. Admin was restyled to the staff design and stripped of non-functional chrome.

## Goals / Non-Goals

**Goals**

- Document and lock the marketing landing behavior operators rely on (SEO shell, sections, responsive layout).
- Lock admin to API-backed workflows only.
- Align `openspec/config.yaml` frontend notes with Vue landing + independent packages.

**Non-Goals**

- Live public schedule/plans API binding (static marketing copy is enough for this refresh).
- Lead form POST wiring (CTAs and contact affordances only until a follow-up).
- PWA or Astro migration.

## Decisions

| Decision | Why |
|---|---|
| Vue 3 + Vite for landing | Matches the FITKIT reference build speed and the existing Vue skill set used for the redesign; SEO via static `index.html` + build plugins instead of Astro. |
| Single-page section anchors | One composition for marketing; hash/section nav for Home, About, Classes, Schedule, Pricing, Blog, Contact. |
| `VITE_SITE_URL` at build | Canonical, OG, Twitter, and JSON-LD URLs must be absolute for social crawlers. |
| Sticky mobile CTA | Phone layouts need Call + Start Free Trial without scrolling to the footer. |
| Functional-only admin | Avoid shipping dead controls that look interactive. |

## Risks / Trade-offs

- Body copy inside the Vue app is less crawlable than Astro HTML. Mitigation: rich static head (description, JSON-LD, OG image) and sitemap; revisit Astro if organic landing SEO becomes a hard KPI.
- Trial CTA without leads POST may under-convert until a form change lands.

## Migration

- Operators build landing with `VITE_SITE_URL` set to the public origin.
- Update deploy docs/reverse-proxy notes if they still say Astro-only.
