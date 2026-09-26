# Admin dashboard

React + Vite staff app. Uses `@gympulse/api-client` against the Go API.

UI follows the pastel three-column layout from `ui design inspiration images/admin page design.jpg`, with GymPulse branding via `public/logo.png`.

```bash
# from repo root (API must be running — see make dev)
pnpm install
pnpm --filter @gympulse/api-client generate
make admin-dev
# or: pnpm --filter admin dev
```

Open http://localhost:5173. Vite proxies `/v1`, `/health`, and `/ready` to `http://127.0.0.1:8080`.

Requires a running API with `AUTH_JWT_SECRET`, `AUTH_COOKIE_SECURE=false` for local HTTP, and `CORS_ORIGINS` including `http://localhost:5173`.

Staff roles only: `owner`, `manager`, `receptionist`.
