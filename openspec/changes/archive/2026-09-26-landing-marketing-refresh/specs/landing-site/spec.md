## Purpose

Public marketing website for a single deployed gym: brand-led home, plans, schedule highlights, contact, and trial CTAs, delivered as a Vue + Vite site with a crawlable SEO shell and no privileged API access.

## MODIFIED Requirements

### Requirement: SEO-oriented delivery
The landing site SHALL ship a static HTML entry with crawlable document metadata (title, description, canonical URL, Open Graph, Twitter cards, and JSON-LD) resolved at build time from `VITE_SITE_URL`. The build MUST emit `robots.txt` and `sitemap.xml` for the public origin. Marketing sections MAY render via a client SPA after load; privileged data MUST NOT be required for the SEO shell.

#### Scenario: Crawler sees metadata
- **WHEN** an unauthenticated crawler requests the landing HTML
- **THEN** the response includes title, description, canonical link, and Open Graph tags without requiring JavaScript
- **AND** `/robots.txt` and `/sitemap.xml` are available at the site origin after build

#### Scenario: Site URL configuration
- **WHEN** operators build landing with `VITE_SITE_URL` set to the public HTTPS origin
- **THEN** canonical, `og:url`, and JSON-LD URLs use that origin

### Requirement: Public pages
The landing site SHALL present gym marketing content as public sections: home (hero), about, classes, schedule, pricing, blog highlights, and contact/footer. Unauthenticated visitors MUST be able to load the site. Membership booking MUST NOT complete on landing (CTAs MAY deep-link to the member app later).

#### Scenario: Visitor browses sections
- **WHEN** a visitor opens the landing site
- **THEN** they can reach home, about, classes, schedule, pricing, and contact content without signing in

#### Scenario: No member booking on landing
- **WHEN** a visitor views the schedule or pricing section
- **THEN** they cannot complete an authenticated member booking on the landing origin

### Requirement: Trial or contact signup
The site SHALL provide a clear free-trial CTA and contact affordances (phone, email, and/or form). When a trial or contact form is present, it MUST submit to the server leads API and MUST NOT write to Postgres from the browser. Until a form is wired, CTAs MAY scroll to pricing or open `tel:` / `mailto:` links.

#### Scenario: Trial CTA visible
- **WHEN** a visitor loads the landing on desktop or phone
- **THEN** a Start Free Trial (or equivalent) CTA is visible in the primary flow
- **AND** on narrow viewports a sticky trial CTA remains available without relying on the footer alone

#### Scenario: Form posts to leads when present
- **WHEN** a visitor submits a valid trial/contact form that is wired to the API
- **THEN** the server stores a lead
- **AND** the visitor sees a success message

### Requirement: No privileged API
The landing site MUST NOT ship staff tokens or use credentialed auth cookies. Public API use SHALL be read-only except for a documented lead POST when a form is present.

#### Scenario: Bundle inspection
- **WHEN** the landing app is built
- **THEN** required public config is the site origin (`VITE_SITE_URL`) and, if used, the public API base URL
- **AND** auth refresh cookies are not used on this origin

### Requirement: Localized UI
All user-visible strings SHALL come from i18n catalogs when catalogs are introduced for landing. English is the default locale. Until catalogs exist, English marketing copy MAY live in the landing source as a temporary exception documented by this change; a follow-up MUST move strings into catalogs.

#### Scenario: English default
- **WHEN** a visitor opens landing with no locale override
- **THEN** visible copy is English

## ADDED Requirements

### Requirement: Responsive marketing layout
The landing site SHALL remain usable on tablet and phone widths: navigation collapses to a menu control, multi-column sections stack or scroll horizontally where needed, and primary CTAs remain reachable.

#### Scenario: Phone navigation
- **WHEN** a visitor opens landing at a phone-width viewport
- **THEN** primary section links are available via a menu control
- **AND** the sticky Call and trial CTAs remain reachable

#### Scenario: Tablet sections
- **WHEN** a visitor opens landing at a tablet-width viewport
- **THEN** hero, about, classes, and footer content reflow without horizontal page scroll (except intentional carousels)

### Requirement: Brand-led hero
The first viewport SHALL present the GymPulse brand as a hero-level signal, one primary headline, short supporting copy, a CTA group, and a dominant hero visual (video and/or image). It MUST NOT bury the brand as nav-only text.

#### Scenario: Brand in first viewport
- **WHEN** a visitor lands on the home section
- **THEN** the GymPulse name or logo is prominent in the first viewport with the primary CTA
