## Why

The public landing and admin shell drifted from the product’s visual direction and from OpenSpec (Astro vs the shipped Vue marketing site). Staff UI also carried non-functional chrome. Specs and context need to match what operators actually get: a FITKIT-inspired, SEO-ready landing with tablet/phone layout, and an admin that only exposes working API-backed flows.

## What Changes

- Rebuild `landing/` as a Vue 3 + Vite marketing site (single-page sections) with GymPulse branding, hero video, and stock/custom gym imagery.
- **BREAKING (planning):** Landing is no longer Astro + React islands; project context and `landing-site` requirements update accordingly.
- Ship intensive SEO: canonical URL via `VITE_SITE_URL`, Open Graph/Twitter cards, JSON-LD, `robots.txt`, `sitemap.xml`, and `og-image.jpg` at build time.
- Align tablet and phone layout (nav drawer, stacked sections, sticky mobile CTA).
- Remove BMI and other non-product widgets from landing.
- Admin: keep only functional, API-backed staff surfaces; drop decorative non-working UI.
- Confirm JS packages install independently (no root pnpm workspace); `admin` links `packages/api-client` via `file:`.

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `landing-site`: Vue marketing delivery, SEO build artifacts, responsive public layout, public section content, trial CTAs without privileged auth.
- `admin-dashboard`: Functional-only staff UI (no non-working chrome).

## Impact

- `landing/` (Vue + Vite), `landing/public/` assets, Vite SEO plugin
- `admin/src/` routes and shell
- `openspec/config.yaml` frontend context (landing stack)
- No OpenAPI or server changes in this change
