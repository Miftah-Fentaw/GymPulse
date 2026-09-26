## 1. Landing marketing site

- [x] Replace landing scaffold with Vue 3 + Vite marketing app and GymPulse branding assets
  - Verify: `cd landing && pnpm run build` succeeds; logo and hero assets load
- [x] Implement section layout (hero, about, classes, schedule, pricing, blog, footer) without BMI widgets
  - Verify: build output serves sections; no BMI UI in source
- [x] Add SEO shell: `VITE_SITE_URL` injection, OG/Twitter/JSON-LD, `robots.txt`, `sitemap.xml`, `og-image.jpg`
  - Verify: built `dist/index.html` contains canonical/OG tags; `dist/robots.txt` and `dist/sitemap.xml` exist
- [x] Align tablet and phone layout (menu nav, stacked grids, sticky Call + trial CTA)
  - Verify: CSS media queries cover ≤1024 / ≤900 / ≤640; sticky CTA present on narrow widths
- [x] Keep landing free of staff auth cookies and privileged API usage
  - Verify: no refresh-cookie auth usage in landing source

## 2. Admin functional UI

- [x] Strip non-functional decorative admin chrome; keep API-backed staff routes
  - Verify: authenticated shell actions map to real routes/API flows
- [x] Confirm admin still uses i18n catalogs and `packages/api-client`
  - Verify: `admin/src` imports `react-i18next` and api-client patterns remain

## 3. Package layout / OpenSpec context

- [x] Keep JS packages independently installable (no root workspace required)
  - Verify: `landing/`, `admin/` each have their own `package.json` / lockfile
- [x] Update `openspec/config.yaml` frontend notes so landing is Vue + Vite (not Astro)
  - Verify: config context mentions Vue landing after sync/archive prep
