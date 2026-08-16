<div align="center">

# 🏋️ GymPulse

**Full-stack gym management platform — monorepo**

A complete fitness platform covering mobile apps, admin portals, e-commerce, sport content management, and AI-powered features — all built on a single unified Go backend and Supabase.

[![Go](https://img.shields.io/badge/Go-1.22-00ADD8?logo=go)](https://go.dev)
[![Flutter](https://img.shields.io/badge/Flutter-3.19-02569B?logo=flutter)](https://flutter.dev)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com)
[![pnpm](https://img.shields.io/badge/pnpm-9-F69220?logo=pnpm)](https://pnpm.io)
[![Turbo](https://img.shields.io/badge/Turborepo-2-EF4444?logo=turborepo)](https://turbo.build)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Monorepo Structure](#monorepo-structure)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Admin Roles](#admin-roles)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Docker](#docker)
- [Scripts](#scripts)
- [Contributing](#contributing)

---

## Overview

GymPulse is a multi-tenant gym management platform with four distinct user-facing surfaces:

| Surface | Description |
|---------|-------------|
| **Mobile App** (Flutter) | End-user app — workouts, programs, shop, profile |
| **web-system-admin** (Next.js) | Super admin — full platform control |
| **web-user-admin** (Next.js) | User admin — manage app users |
| **web-shop** (Next.js) | Shop admin — manage products, orders |

All surfaces talk to one unified **Go backend** (port `8080`). Authentication and database are handled by **Supabase**.

---

## Monorepo Structure

```
gympulse/
│
├── apps/
│   ├── backend/                 # ★ Unified Go API — port 8080
│   ├── mobile/                  # Flutter mobile app
│   ├── web-system-admin/        # Next.js — super admin portal
│   ├── web-user-admin/          # Next.js — user management portal
│   ├── web-shop/                # Next.js — shop admin portal
│   └── web-landing/             # Next.js — public landing page
│
├── services/
│   ├── go-shared/               # ★ Shared Go library (gympulse/shared)
│   │   ├── audit/               #   Fire-and-forget audit log writer
│   │   ├── middleware/          #   JWT auth + role enforcement
│   │   ├── pagination/          #   page/per_page → PostgREST fragments
│   │   ├── response/            #   Standardised JSON envelopes
│   │   ├── storage/             #   Multipart upload to Supabase Storage
│   │   ├── supabase/            #   Auth API + PostgREST + Storage client
│   │   └── validator/           #   Input validation helpers
│   ├── notification-service/    # Node.js — SMTP + Firebase push
│   └── ai-service/              # Python/FastAPI — AI features
│
├── packages/
│   ├── shared-types/            # TypeScript types shared across web apps
│   ├── shared-utils/            # Shared utilities
│   ├── supabase-client/         # Shared Supabase JS client
│   └── ui/                      # Shared component library
│
├── supabase/
│   ├── migrations/              # SQL migrations (run in order)
│   │   ├── 20240001000000_init_schema.sql
│   │   └── 20240002000000_missing_policies_and_buckets.sql
│   ├── functions/               # Supabase Edge Functions
│   └── config.toml              # Local dev configuration
│
├── .github/workflows/           # CI/CD pipelines
├── go.work                      # Go workspace (links backend + go-shared)
├── docker-compose.yml
├── package.json                 # Root scripts via Turborepo
└── .env.example
```

> **Go workspace** — `go.work` links `apps/backend` and `services/go-shared` so the backend imports `gympulse/shared/...` directly without publishing. Any future Go service just adds itself to `go.work`.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend API | Go 1.22, chi router, golang-jwt |
| Database & Auth | Supabase (PostgreSQL 15) |
| Storage | Supabase Storage |
| Mobile | Flutter 3.19 / Dart |
| Web Apps | Next.js 14 / TypeScript |
| Notification | Node.js, Nodemailer, Firebase Admin |
| AI Service | Python 3.11, FastAPI |
| Monorepo tooling | pnpm 9, Turborepo 2 |
| Containerisation | Docker, Docker Compose |
| CI/CD | GitHub Actions |

---

## Architecture

```
                     ┌─────────────────────────────────┐
                     │         Supabase Cloud           │
                     │  PostgreSQL · Auth · Storage      │
                     └──────────────┬──────────────────┘
                                    │ service-role key
                     ┌──────────────▼──────────────────┐
                     │    apps/backend  (Go · :8080)    │
                     │                                   │
                     │  /auth/*          mobile auth     │
                     │  /profile/*       user profile    │
                     │  /workouts/*      public reads    │
                     │  /programs/*      public reads    │
                     │  /content/*       public reads    │
                     │  /shop/*          browse + orders │
                     │  /announcements   notifications   │
                     │                                   │
                     │  /admin/auth/*    all admins      │
                     │  /admin/users/*   user mgmt       │
                     │  /admin/admins/*  admin mgmt      │
                     │  /admin/shop/*    e-commerce      │
                     │  /admin/content/* sport content   │
                     │  /admin/system/*  platform ctrl   │
                     └──┬──────────┬──────────┬─────────┘
                        │          │          │
              ┌─────────▼──┐ ┌─────▼────┐ ┌──▼──────────┐
              │ Mobile App │ │ Web Apps │ │  AI/Notif.  │
              │  Flutter   │ │ Next.js  │ │  Services   │
              └────────────┘ └──────────┘ └─────────────┘
```

---

## Admin Roles

Roles are stored in `auth.users.app_metadata.admin_role` and set by a `super_admin` via `POST /admin/admins`.

| Role | Portal | Permissions |
|------|--------|-------------|
| `super_admin` | web-system-admin | Full access to everything |
| `user_admin` | web-user-admin | List, update, ban/unban app users |
| `shop_admin` | web-shop | Manage own products, view own orders |
| `sport_admin` | web-system-admin (content section) | Manage own workouts, programs, content posts |

---

## API Reference

Base URL: `http://localhost:8080`

All responses follow this envelope:
```json
{ "success": true, "data": {} }
{ "success": false, "error": "message" }
```

### Public endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Liveness probe |
| `POST` | `/auth/signup` | Register — email + password |
| `POST` | `/auth/signin` | Sign in — returns JWT + refresh token |
| `GET` | `/auth/google` | Get Google OAuth redirect URL |
| `POST` | `/auth/refresh` | Refresh access token |
| `POST` | `/auth/reset-password` | Send password reset email |
| `GET` | `/announcements` | Active platform announcements |
| `GET` | `/content` | Published content posts (`?type=&category_id=&page=&per_page=`) |
| `GET` | `/content/categories` | Content categories |
| `GET` | `/content/{id}` | Single post with media blocks |
| `GET` | `/workouts` | Published workouts (`?difficulty=&category_id=`) |
| `GET` | `/workouts/categories` | Workout categories |
| `GET` | `/workouts/{id}` | Workout with exercise list |
| `GET` | `/programs` | Published fitness programs |
| `GET` | `/programs/{id}` | Program with weekly schedule |
| `GET` | `/shop/products` | Active products (`?category_id=&page=&per_page=`) |
| `GET` | `/shop/products/{id}` | Single product |
| `GET` | `/shop/categories` | Product categories |

### Authenticated user (Bearer token)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/auth/signout` | Revoke session |
| `PUT` | `/auth/update-password` | Change password |
| `GET` | `/auth/me` | Own auth user info |
| `GET` | `/profile` | Own profile |
| `PATCH` | `/profile` | Update name, phone, DOB, gender, bio |
| `POST` | `/profile/avatar` | Upload avatar image |
| `GET` | `/shop/orders` | Own orders (`?status=`) |
| `GET` | `/shop/orders/{id}` | Single order with items |
| `POST` | `/shop/orders` | Place an order |
| `POST` | `/shop/orders/{id}/cancel` | Cancel pending/processing order |

### Admin — `/admin/*` (Bearer token + admin_role)

#### Auth (all admin roles)
| Method | Path |
|--------|------|
| `POST` | `/admin/auth/signin` |
| `POST` | `/admin/auth/refresh` |
| `POST` | `/admin/auth/reset-password` |
| `POST` | `/admin/auth/signout` |
| `PUT` | `/admin/auth/update-password` |
| `GET` | `/admin/auth/me` |

#### User management — `user_admin`, `super_admin`
| Method | Path | Notes |
|--------|------|-------|
| `GET` | `/admin/users` | `?search=&page=&per_page=` |
| `GET` | `/admin/users/{id}` | |
| `PATCH` | `/admin/users/{id}` | name, phone, ban status |
| `POST` | `/admin/users/{id}/ban` | |
| `POST` | `/admin/users/{id}/unban` | |
| `DELETE` | `/admin/users/{id}` | `super_admin` only |

#### Admin account management — `super_admin` only
| Method | Path | Notes |
|--------|------|-------|
| `GET` | `/admin/admins` | `?role=shop_admin` to filter |
| `POST` | `/admin/admins` | `{ email, password, full_name, role }` |
| `GET` | `/admin/admins/{id}` | |
| `PATCH` | `/admin/admins/{id}` | change role, name, active |
| `DELETE` | `/admin/admins/{id}` | cannot delete self |

#### Shop — `shop_admin` (own), `super_admin` (all)
| Method | Path | Notes |
|--------|------|-------|
| `GET` | `/admin/shop/products` | `?category_id=&status=active\|inactive` |
| `POST` | `/admin/shop/products` | |
| `GET` | `/admin/shop/products/{id}` | |
| `PATCH` | `/admin/shop/products/{id}` | |
| `DELETE` | `/admin/shop/products/{id}` | |
| `POST` | `/admin/shop/products/{id}/images` | multipart, field `images` |
| `DELETE` | `/admin/shop/products/{id}/images` | `{ url }` |
| `GET` | `/admin/shop/categories` | |
| `POST` | `/admin/shop/categories` | `super_admin` only |
| `GET` | `/admin/shop/orders` | `?status=pending\|processing\|...` |
| `GET` | `/admin/shop/orders/{id}` | |
| `PATCH` | `/admin/shop/orders/{id}/status` | `{ status }` |

#### Sport content — `sport_admin` (own), `super_admin` (all)
| Method | Path | Notes |
|--------|------|-------|
| `GET` | `/admin/content` | `?type=&published=true\|false` |
| `POST` | `/admin/content` | |
| `GET/PATCH/DELETE` | `/admin/content/{id}` | |
| `POST` | `/admin/content/{id}/publish` | |
| `POST` | `/admin/content/{id}/unpublish` | |
| `POST` | `/admin/content/{id}/media` | multipart — images + videos + `text_blocks` JSON |
| `POST` | `/admin/content/{id}/text-block` | `{ text, caption, order }` |
| `DELETE` | `/admin/content/{id}/media/{mediaId}` | |
| `PATCH` | `/admin/content/{id}/media/reorder` | `{ order: [{id, order}] }` |
| `GET/POST` | `/admin/content/categories` | POST = `super_admin` only |
| `POST` | `/admin/content/media/upload/{image\|video}` | standalone file upload |
| `GET/POST` | `/admin/content/workouts` | |
| `GET/PATCH/DELETE` | `/admin/content/workouts/{id}` | |
| `POST` | `/admin/content/workouts/{id}/publish` | |
| `POST` | `/admin/content/workouts/{id}/unpublish` | |
| `GET/POST` | `/admin/content/workouts/{workoutId}/exercises` | |
| `GET/PATCH/DELETE` | `/admin/content/workouts/{workoutId}/exercises/{id}` | |
| `PATCH` | `/admin/content/workouts/{workoutId}/exercises/reorder` | |
| `GET/POST` | `/admin/content/workout-categories` | POST = `super_admin` only |
| `GET/POST` | `/admin/content/programs` | |
| `GET/PATCH/DELETE` | `/admin/content/programs/{id}` | |
| `POST` | `/admin/content/programs/{id}/publish` | |
| `POST` | `/admin/content/programs/{id}/unpublish` | |
| `POST` | `/admin/content/programs/{id}/workouts` | add to schedule |
| `DELETE` | `/admin/content/programs/{id}/workouts/{workoutId}` | |

#### System — `super_admin` only
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/admin/system/dashboard` | Platform-wide counts |
| `GET` | `/admin/system/admins/overview` | Count per admin role |
| `GET/POST` | `/admin/system/announcements` | |
| `DELETE` | `/admin/system/announcements/{id}` | |
| `GET` | `/admin/system/audit-logs` | `?admin_id=&action=` |
| `GET` | `/admin/system/settings` | All platform settings |
| `PATCH` | `/admin/system/settings/{key}` | `{ value }` |
| `GET` | `/admin/system/storage/buckets` | Supabase bucket list |

---

## Getting Started

### Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Go | 1.22+ | [go.dev](https://go.dev/dl) |
| Node.js | 20+ | [nodejs.org](https://nodejs.org) |
| pnpm | 9+ | `npm i -g pnpm` |
| Flutter | 3.19+ | [flutter.dev](https://flutter.dev/docs/get-started/install) |
| Supabase CLI | latest | [supabase.com/docs/guides/cli](https://supabase.com/docs/guides/cli) |
| Docker | latest | [docker.com](https://www.docker.com/products/docker-desktop) |

### 1 — Clone and install

```bash
git clone https://github.com/your-org/gympulse.git
cd gympulse

# Install Node dependencies (web apps, notification service)
pnpm install
```

### 2 — Configure environment

```bash
cp .env.example .env
# Edit .env — fill in SUPABASE_URL, SUPABASE_ANON_KEY,
# SUPABASE_SERVICE_KEY, SUPABASE_JWT_SECRET at minimum
```

`SUPABASE_JWT_SECRET` is found in your Supabase dashboard under **Settings → API → JWT Secret**.

### 3 — Start Supabase locally

```bash
supabase start
# Apply all migrations
supabase db reset
```

Local Supabase services:

| Service | URL |
|---------|-----|
| API / PostgREST | http://localhost:54321 |
| Studio | http://localhost:54323 |
| Inbucket (email) | http://localhost:54324 |

### 4 — Run the backend

```bash
cd apps/backend
go run ./cmd/api/...
# Backend available at http://localhost:8080
```

### 5 — Run a web app

```bash
# Super admin portal
cd apps/web-system-admin && pnpm dev   # http://localhost:3000

# User admin portal
cd apps/web-user-admin && pnpm dev     # http://localhost:3001

# Shop admin portal
cd apps/web-shop && pnpm dev           # http://localhost:3002
```

### 6 — Run the mobile app

```bash
cd apps/mobile
flutter pub get
flutter run
```

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SUPABASE_URL` | ✓ | — | Supabase project URL |
| `SUPABASE_ANON_KEY` | ✓ | — | Supabase anon/public key |
| `SUPABASE_SERVICE_KEY` | ✓ | — | Supabase service-role key |
| `SUPABASE_JWT_SECRET` | ✓ | — | JWT signing secret (from Supabase dashboard) |
| `BACKEND_PORT` | — | `8080` | Go backend port |
| `SPORT_CONTENT_BUCKET` | — | `sport-content` | Supabase bucket for workout media |
| `PRODUCT_IMAGE_BUCKET` | — | `product-images` | Supabase bucket for product images |
| `SMTP_HOST` | — | — | SMTP server for notification service |
| `SMTP_USER` | — | — | SMTP username |
| `SMTP_PASS` | — | — | SMTP password |
| `FIREBASE_CREDENTIALS` | — | — | Path to Firebase service account JSON |
| `OPENAI_API_KEY` | — | — | OpenAI key for AI service |
| `STRIPE_PUBLIC_KEY` | — | — | Stripe publishable key |
| `STRIPE_SECRET_KEY` | — | — | Stripe secret key |

---

## Database

Migrations live in `supabase/migrations/` and run in filename order via `supabase db reset`.

| Migration | Description |
|-----------|-------------|
| `20240001000000_init_schema.sql` | Full schema — profiles, content, workouts, programs, products, orders, audit logs, announcements, settings. RLS + triggers. |
| `20240002000000_missing_policies_and_buckets.sql` | RLS for exercises, program_workouts, categories. Storage buckets (sport-content, product-images, avatars). `updated_at` triggers. |

Key design decisions:
- **All auth is Supabase** — the backend never stores passwords. JWT validation uses the Supabase JWT secret directly.
- **Service-role key server-side only** — all backend DB calls use the service-role key, bypassing RLS deliberately. RLS policies still protect direct client access.
- **Admin roles in `app_metadata`** — stored in `auth.users.app_metadata.admin_role`, set by `super_admin` via the backend. The JWT carries the role so the backend can enforce it without a DB lookup on every request.
- **Audit log is fire-and-forget** — written in a goroutine, never blocks a response.

---

## Docker

Run the full stack with Docker Compose from the repo root:

```bash
# Build and start all services
docker compose up -d

# Build only the backend (context is repo root for go.work access)
docker build -f apps/backend/Dockerfile -t gympulse-backend .

# Stop everything
docker compose down
```

Services and ports:

| Service | Port | Description |
|---------|------|-------------|
| `backend` | 8080 | Go API |
| `notification-service` | 3003 | SMTP + Firebase push |
| `ai-service` | 8000 | Python/FastAPI |
| `web-system-admin` | 3000 | Super admin portal |
| `web-user-admin` | 3001 | User admin portal |
| `web-shop` | 3002 | Shop admin portal |
| `web-landing` | 3004 | Landing page |

---

## Scripts

Run from the repo root with `pnpm <script>`.

| Script | Description |
|--------|-------------|
| `pnpm backend:dev` | Run the Go backend in dev mode |
| `pnpm backend:build` | Build the Go backend binary |
| `pnpm backend:tidy` | `go mod tidy` on backend + go-shared |
| `pnpm web:system-admin:dev` | Run super-admin Next.js app |
| `pnpm web:user-admin:dev` | Run user-admin Next.js app |
| `pnpm web:shop:dev` | Run shop Next.js app |
| `pnpm web:landing:dev` | Run landing page |
| `pnpm mobile:dev` | Run Flutter app |
| `pnpm mobile:build` | Build Flutter APK |
| `pnpm notification:dev` | Run notification service |
| `pnpm ai:dev` | Run AI service (uvicorn) |
| `pnpm db:start` | Start local Supabase |
| `pnpm db:stop` | Stop local Supabase |
| `pnpm db:migrate` | Reset DB and apply all migrations |
| `pnpm docker:up` | `docker compose up -d` |
| `pnpm docker:down` | `docker compose down` |
| `pnpm build` | Build all apps via Turborepo |
| `pnpm lint` | Lint all apps |
| `pnpm format` | Prettier format everything |

---

## Contributing

See [CONTRIBUTION.md](./CONTRIBUTION.md) for the full guide.

---

<div align="center">
Built with ❤️ — GymPulse Team
</div>
