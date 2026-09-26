# Tech stack

GymPulse is a **self-hostable** gym product: one Go API, PostgreSQL 16 on the host, and three independent frontends. There is **no Docker** in this repository and **no frontend database client**.

## At a glance

| Layer | Choice | Notes |
|:---|:---|:---|
| API | Go 1.26+, Chi, oapi-codegen | Module `gympulse-server` (`server/cmd/gympulse`) |
| DB | PostgreSQL 16+ | Single `DATABASE_URL`, default `public` schema, UUIDv7 in Go |
| Migrations | goose (embedded) | `server/migrations/`, `make migrate-*` |
| HTTP contract | OpenAPI 3.1 (`openapi.yaml`) | Spec-first; `make generate` |
| TS client | openapi-typescript + openapi-fetch | `packages/api-client` |
| Admin | React 19 + Vite 6 + Tailwind 4 | Staff: owner / manager / receptionist |
| Member PWA | React 19 + Vite 6 + vite-plugin-pwa | Members + trainers |
| Landing | Vue 3 + Vite 6 | Marketing + SEO shell |
| Auth | Argon2id + JWT HS256 (15m) + rotating refresh | Refresh: httpOnly cookie (JSON fallback) |
| Money | Integer minor units + ISO currency | Never floats |
| i18n | react-i18next (admin/app) | English catalogs; no hard-coded UI sentences |
| License | BSD 2-Clause | See [LICENSE](../LICENSE) |

## Backend (`server/`)

| Concern | Library / approach |
|:---|:---|
| HTTP router | [chi](https://github.com/go-chi/chi) |
| OpenAPI handlers | [oapi-codegen](https://github.com/oapi-codegen/oapi-codegen) (strict) + kin-openapi request validation |
| DB driver | [pgx/v5](https://github.com/jackc/pgx) pool |
| Config | [caarlos0/env](https://github.com/caarlos0/env) — fail-fast at startup |
| IDs | [google/uuid](https://github.com/google/uuid) UUIDv7 |
| Migrations | [pressly/goose](https://github.com/pressly/goose) Provider API, `go:embed` |
| Logging | `log/slog` JSON + request IDs |
| Passwords | Argon2id |
| Access tokens | JWT HS256, **15 minutes** |
| Refresh tokens | Opaque, hashed at rest, rotation + family revoke on reuse |
| Storage | Interface: local disk default; S3-compatible optional |
| Payments gateway | Interface with manual/no-op default (no charge API in MVP) |
| Lint | gofmt + golangci-lint |
| Tests | Real Postgres via `TEST_DATABASE_URL` → `gympulse_test_*` DBs (no mocks, no containers) |

Domain routes that exist in `openapi.yaml` but are not yet in the checked-in generated mux are served by an authenticated **domain fallback** so the API does not return stub `501`s.

## Frontends

Packages are **independent** (no root JS workspace). Install inside each of `admin/`, `app/`, `landing/`, and `packages/api-client/`.

### Shared (admin + app)

| Concern | Choice |
|:---|:---|
| UI | React 19, TypeScript, Vite 6 |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Routing | TanStack Router |
| Data | TanStack Query |
| Forms | react-hook-form + zod (where used) |
| Icons | lucide-react |
| API | `@gympulse/api-client` (file: link) |
| i18n | i18next + react-i18next |

### Admin only

| Concern | Choice |
|:---|:---|
| Charts | recharts |
| Audience | Staff roles only (`owner`, `manager`, `receptionist`) |
| Dev port | Vite `5173`, proxies `/v1` → Go `:8080` |

### Member / trainer PWA (`app/`)

| Concern | Choice |
|:---|:---|
| PWA | vite-plugin-pwa / Workbox |
| Offline | App shell + last-known check-in QR; **network-first** for authenticated `/v1` |
| Logout | MUST clear Cache Storage |
| QR | `qrcode` package for member check-in display |
| Brand | Align with landing primary red (`#e31c23` family) per PWA UI specs |

### Landing (`landing/`)

| Concern | Choice |
|:---|:---|
| Framework | Vue 3 + Vite |
| SEO | Canonical / OG / JSON-LD / robots / sitemap via `VITE_SITE_URL` at build |
| API | Public endpoints only; never privileged staff APIs |

## Tooling

| Tool | Role |
|:---|:---|
| `make` | generate, db-create, migrate-*, seed, dev, test, lint, build, admin-* |
| OpenSpec CLI | Spec-driven changes under `openspec/` |
| pnpm | Preferred for JS packages in this repo |
| PostgreSQL 16+ | Host install (Fedora / Debian / Homebrew) |

## Explicit non-goals (stack)

- Docker / Compose / testcontainers as the default local path  
- Supabase or transaction-mode PgBouncer as `DATABASE_URL`  
- Frontend talking directly to Postgres or a BaaS  
- Social login (Google / Apple) on the PWA  
- Native iOS/Android apps (PWA only for now)
