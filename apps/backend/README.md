# GymPulse Backend

Single unified Go API for the entire GymPulse platform. Runs on port **8080**.

---

## Architecture

```
apps/backend/               ← This service
├── cmd/api/main.go         ← Entry point
└── internal/
    ├── config/             ← Env var loading
    ├── router/             ← All routes wired in one place
    └── handlers/
        ├── auth/           ← POST /auth/* (mobile users)
        ├── profile/        ← GET|PATCH /profile (mobile users)
        ├── mobile/
        │   ├── content/    ← GET /content, /workouts, /programs, /announcements
        │   └── shop/       ← GET /shop/products, POST /shop/orders
        └── admin/
            ├── auth/       ← POST /admin/auth/*
            ├── users/      ← /admin/users/* (user_admin, super_admin)
            ├── admins/     ← /admin/admins/* (super_admin)
            ├── shop/       ← /admin/shop/* (shop_admin, super_admin)
            ├── content/    ← /admin/content/* (sport_admin, super_admin)
            ├── exercises/  ← /admin/content/workouts/{id}/exercises
            └── system/     ← /admin/system/* (super_admin)

services/go-shared/         ← Shared Go packages (module: gympulse/shared)
├── middleware/             ← JWT auth + role enforcement
├── response/               ← Standardised JSON envelopes
├── supabase/               ← Auth API + PostgREST + Storage client
├── pagination/             ← page/per_page parsing + PostgREST fragments
├── storage/                ← Reusable multipart file upload to Supabase Storage
├── validator/              ← Common input validation helpers
└── audit/                  ← Fire-and-forget audit log writer
```

The two modules are linked via a **Go workspace** (`go.work` at repo root).

---

## Admin Roles

Stored in `auth.users.app_metadata.admin_role` — set by super_admin via `POST /admin/admins`.

| Role | Portal | Access |
|------|--------|--------|
| `super_admin` | web-system-admin | Everything |
| `user_admin` | web-user-admin | App user management |
| `shop_admin` | web-shop | Own products + orders |
| `sport_admin` | (web-system-admin, content section) | Own sport content |

---

## Environment Variables

Copy `.env.example` to `.env` at the repo root.

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | ✓ | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | ✓ | Supabase anon/public key |
| `SUPABASE_SERVICE_KEY` | ✓ | Supabase service-role key |
| `SUPABASE_JWT_SECRET` | ✓ | Found in Supabase → Settings → API → JWT Secret |
| `BACKEND_PORT` | — | Defaults to `8080` |
| `SPORT_CONTENT_BUCKET` | — | Defaults to `sport-content` |
| `PRODUCT_IMAGE_BUCKET` | — | Defaults to `product-images` |

---

## Running locally

```bash
# From repo root — apply DB migrations
supabase start
supabase db reset

# Run the backend
cd apps/backend
go run ./cmd/api/...
```

Or with Docker from the repo root:
```bash
docker compose up backend
```

---

## API Overview

### Public (no auth)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Liveness check |
| POST | `/auth/signup` | Register (email + password) |
| POST | `/auth/signin` | Sign in |
| GET | `/auth/google` | Get Google OAuth URL |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/reset-password` | Send reset email |
| GET | `/announcements` | Active platform announcements |
| GET | `/content` | Published content posts |
| GET | `/content/categories` | Content categories |
| GET | `/content/{id}` | Single content post |
| GET | `/workouts` | Published workouts |
| GET | `/workouts/categories` | Workout categories |
| GET | `/workouts/{id}` | Single workout with exercises |
| GET | `/programs` | Published programs |
| GET | `/programs/{id}` | Single program with schedule |
| GET | `/shop/products` | Active products |
| GET | `/shop/products/{id}` | Single product |
| GET | `/shop/categories` | Product categories |

### Authenticated user (JWT required)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/signout` | Revoke session |
| PUT | `/auth/update-password` | Change password |
| GET | `/auth/me` | Own auth user |
| GET | `/profile` | Own profile |
| PATCH | `/profile` | Update profile |
| POST | `/profile/avatar` | Upload avatar |
| GET | `/shop/orders` | Own orders |
| GET | `/shop/orders/{id}` | Single order |
| POST | `/shop/orders` | Place order |
| POST | `/shop/orders/{id}/cancel` | Cancel pending order |

### Admin — all roles need valid JWT + correct admin_role
See router source for the full list: `internal/router/router.go`

---

## go-shared packages

Import path: `gympulse/shared/<package>`

```go
import (
    "gympulse/shared/audit"
    "gympulse/shared/middleware"
    "gympulse/shared/pagination"
    "gympulse/shared/response"
    "gympulse/shared/storage"
    "gympulse/shared/supabase"
    "gympulse/shared/validator"
)
```

Any future Go service added to `go.work` gets these for free — no copying.
