# Contributing to GymPulse

Thanks for taking the time to contribute. This guide covers everything you need to know — branching, commits, code style, testing, and the PR process.

---

## Table of Contents

- [Before You Start](#before-you-start)
- [Project Structure](#project-structure)
- [Branching Strategy](#branching-strategy)
- [Commit Messages](#commit-messages)
- [Code Style](#code-style)
  - [Go (backend + go-shared)](#go-backend--go-shared)
  - [TypeScript / Next.js (web apps)](#typescript--nextjs-web-apps)
  - [Dart / Flutter (mobile)](#dart--flutter-mobile)
  - [Python (AI service)](#python-ai-service)
- [Working on the Backend](#working-on-the-backend)
- [Working on Shared Go Packages](#working-on-shared-go-packages)
- [Working on Web Apps](#working-on-web-apps)
- [Working on the Mobile App](#working-on-the-mobile-app)
- [Database Migrations](#database-migrations)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [CI Checks](#ci-checks)
- [Environment & Secrets](#environment--secrets)
- [What NOT to Do](#what-not-to-do)

---

## Before You Start

1. Read the [README](./README.md) fully — understand the architecture before writing code.
2. Check open issues and PRs to avoid duplicate work.
3. For anything non-trivial (new feature, architectural change), **open an issue first** to discuss it.
4. Fork the repo, clone your fork, set the upstream remote:

```bash
git clone https://github.com/your-username/gympulse.git
cd gympulse
git remote add upstream https://github.com/your-org/gympulse.git
```

---

## Project Structure

The key areas and who owns them:

| Path | Language | Concern |
|------|----------|---------|
| `apps/backend/` | Go | Unified API — all HTTP handlers and routing |
| `services/go-shared/` | Go | Shared packages imported by all Go services |
| `apps/mobile/` | Dart/Flutter | Mobile app |
| `apps/web-system-admin/` | TypeScript/Next.js | Super admin portal |
| `apps/web-user-admin/` | TypeScript/Next.js | User admin portal |
| `apps/web-shop/` | TypeScript/Next.js | Shop admin portal |
| `apps/web-landing/` | TypeScript/Next.js | Public landing page |
| `services/notification-service/` | Node.js | SMTP + push notifications |
| `services/ai-service/` | Python | AI features |
| `packages/` | TypeScript | Shared types, utils, UI components |
| `supabase/migrations/` | SQL | Database schema and migrations |

---

## Branching Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code — protected, only merges via PR |
| `develop` | Integration branch — all PRs target this |
| `feature/<scope>/<short-desc>` | New features |
| `fix/<scope>/<short-desc>` | Bug fixes |
| `chore/<short-desc>` | Tooling, deps, CI changes |
| `docs/<short-desc>` | Documentation only |

**Examples:**
```
feature/backend/workout-exercises-crud
feature/mobile/program-detail-screen
fix/backend/order-stock-decrement
chore/update-go-dependencies
docs/api-reference-update
```

Always branch from `develop`, never from `main`:

```bash
git fetch upstream
git checkout develop
git pull upstream develop
git checkout -b feature/backend/my-feature
```

---

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org):

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

**Types:**

| Type | When |
|------|------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code change that's neither a fix nor feature |
| `chore` | Tooling, deps, CI |
| `docs` | Documentation only |
| `test` | Adding or fixing tests |
| `perf` | Performance improvement |
| `style` | Formatting, whitespace (no logic change) |

**Scopes** match the directory: `backend`, `mobile`, `web-shop`, `web-system-admin`, `web-user-admin`, `go-shared`, `db`, `ci`, `docker`.

**Examples:**
```
feat(backend): add workout exercise reorder endpoint
fix(backend): correct stock decrement on multi-item orders
feat(mobile): implement program detail screen
chore(ci): add Go vet step to backend workflow
docs: update API reference with shop endpoints
```

- Keep the subject line under 72 characters.
- Use the imperative mood: "add", not "added" or "adds".
- Reference issues in the footer: `Closes #42`.

---

## Code Style

### Go (backend + go-shared)

- Format with `gofmt` / `goimports` before every commit — no exceptions.
- Follow the [Effective Go](https://go.dev/doc/effective_go) guidelines.
- Use `go vet ./...` to catch common issues before pushing.
- Error handling: always check errors, never use `_` to discard them unless explicitly intentional (and comment why).
- Keep handlers thin — business logic belongs in separate functions or packages, not inline in HTTP handlers.
- All exported functions, types, and packages must have a doc comment.
- Package names: short, lowercase, no underscores. `adminauth` not `admin_auth`.
- Do not add new direct dependencies to `apps/backend/go.mod` if the dependency is reusable — add it to `services/go-shared/go.mod` instead.

```bash
# Before committing Go code
gofmt -w ./...
go vet ./...
go build ./...
```

### TypeScript / Next.js (web apps)

- ESLint + Prettier are configured — run `pnpm lint` before committing.
- Use TypeScript strictly — no `any`, no `@ts-ignore` without a comment explaining why.
- Components go in `components/`, pages in `app/` (App Router).
- Use shared types from `packages/shared-types` — don't duplicate types across apps.
- Import shared UI components from `packages/ui` — don't reinvent buttons.

```bash
pnpm lint
pnpm format
```

### Dart / Flutter (mobile)

- Run `flutter analyze` before committing — treat warnings as errors.
- Follow the Flutter [style guide](https://dart.dev/guides/language/effective-dart/style).
- Feature-first folder structure: `lib/features/<feature>/{data,domain,presentation}`.
- State management: follow the existing pattern in the project — don't introduce a new state management library without discussion.

```bash
flutter analyze
flutter test
```

### Python (AI service)

- Format with `black`, lint with `flake8`.
- Type-hint all function signatures.
- Use `pytest` for tests.

```bash
black .
flake8 .
pytest
```

---

## Working on the Backend

The backend is a single Go module at `apps/backend`. It imports from `services/go-shared` via the Go workspace.

```bash
# Run
cd apps/backend
go run ./cmd/api/...

# Build
go build -o bin/api ./cmd/api/...

# After adding/removing imports
go mod tidy

# If you changed go-shared too
cd ../../services/go-shared && go mod tidy
cd ../../apps/backend && go mod tidy
```

**Adding a new endpoint:**

1. Create a handler file in `internal/handlers/<group>/`.
2. Register the route in `internal/router/router.go`.
3. Apply the correct `middleware.RequireAdminRole(...)` — never skip auth on admin endpoints.
4. Use `gympulse/shared/response` for all responses — never write raw `w.Write`.
5. Use `gympulse/shared/pagination` for any list endpoint.
6. Write to `audit_logs` via `audit.Log()` for any destructive or sensitive admin action.

**Adding a new shared package** (reusable across services):

Add it to `services/go-shared/`, not inside `apps/backend/internal/`. Run `go mod tidy` in both modules after.

---

## Working on Shared Go Packages

`services/go-shared` is the module `gympulse/shared`. Packages here must be:

- **Stateless** where possible — accept config/clients as arguments, don't use global state.
- **Well-documented** — every exported symbol has a doc comment.
- **Backward compatible** — changing a function signature is a breaking change for every service that imports it. Add new parameters with defaults or create a new function variant.

After modifying `go-shared`, always run:
```bash
go mod tidy        # inside services/go-shared
go build ./...     # inside apps/backend  (confirms no breakage)
go work sync       # from repo root
```

---

## Working on Web Apps

Each Next.js app is independent under `apps/`. They all talk to the Go backend at `NEXT_PUBLIC_API_URL`.

```bash
# Install deps (from repo root — pnpm workspaces handles it)
pnpm install

# Run a specific app
cd apps/web-system-admin && pnpm dev

# Lint all web apps at once
pnpm lint
```

When adding a new page that calls the backend, use the shared Supabase client from `packages/supabase-client` for auth token management, and point API calls to `process.env.NEXT_PUBLIC_API_URL`.

---

## Working on the Mobile App

```bash
cd apps/mobile
flutter pub get
flutter run              # connected device or emulator
flutter test             # unit + widget tests
flutter build apk        # release APK
```

Feature folders live under `lib/features/<feature>/`:
```
lib/features/auth/
├── data/          # API calls, DTOs, repositories
├── domain/        # Entities, use cases, interfaces
└── presentation/  # Screens, widgets, state
```

---

## Database Migrations

Migrations live in `supabase/migrations/` and are applied in filename (timestamp) order.

**Creating a migration:**

```bash
# Let Supabase CLI generate the timestamped filename
supabase migration new <description>
# e.g. supabase migration new add_user_goals_table
```

**Rules:**
- Each migration file must be **additive and idempotent** where possible — use `IF NOT EXISTS`, `ON CONFLICT DO NOTHING`.
- Never edit an existing migration that has been committed — create a new one.
- Every new table must have:
  - `uuid` primary key using `uuid_generate_v4()`
  - `created_at timestamptz not null default now()`
  - Row Level Security enabled (`alter table ... enable row level security`)
  - At minimum a service-role policy (`auth.role() = 'service_role'`)
- Foreign keys to `auth.users` should use `on delete set null` unless cascade is explicitly required.

**Apply locally:**
```bash
supabase db reset    # drops and recreates — runs all migrations fresh
```

---

## Testing

### Go backend

```bash
cd apps/backend
go test ./...

# With coverage
go test -cover ./...
```

New handler files should have a corresponding `_test.go` file with at minimum:
- A test for the happy path
- A test for a missing/invalid required field
- A test that an unauthenticated request returns 401

### Web apps

```bash
pnpm test
```

### Flutter

```bash
cd apps/mobile
flutter test
```

### Python AI service

```bash
cd services/ai-service
pytest
```

---

## Pull Request Process

1. **Keep PRs focused** — one concern per PR. A PR that fixes a bug, adds a feature, and refactors unrelated code will be asked to split.
2. **Target `develop`**, never `main`.
3. **Fill in the PR template** — summary, what was tested, any breaking changes.
4. **PR title** must follow Conventional Commits format: `feat(backend): add exercise reorder endpoint`.
5. **Self-review first** — go through your own diff before requesting review. Remove debug logs, TODOs, and commented-out code.
6. **All CI checks must pass** before review.
7. At least **one approval** is required before merging.
8. Use **squash merge** — keep `develop` history clean.

### PR description template

```markdown
## What does this PR do?
<!-- One paragraph summary -->

## Changes
- 
- 

## How to test
<!-- Steps to verify the change works -->

## Breaking changes
<!-- List any breaking API or interface changes, or "None" -->

## Related issues
<!-- Closes #XX -->
```

---

## CI Checks

GitHub Actions runs on every push and PR:

| Workflow | Triggers on | Checks |
|----------|-------------|--------|
| `ci-backend.yml` | `apps/backend/**`, `services/go-shared/**` | `go mod tidy`, `go build`, `go vet`, `go test` |
| `ci-web.yml` | `apps/web-*/**`, `packages/**` | `pnpm lint`, `pnpm build` |
| `ci-mobile.yml` | `apps/mobile/**` | `flutter analyze`, `flutter test` |
| `ci-ai.yml` | `services/ai-service/**` | `pytest` |

All checks must be green before a PR can be merged.

---

## Environment & Secrets

- **Never commit `.env`** — it is in `.gitignore`.
- **Never hardcode credentials** — use environment variables everywhere.
- **Never log secret values** — log key names, not values.
- The `SUPABASE_SERVICE_KEY` is server-side only. It must never appear in client-side code, mobile bundles, or browser-accessible endpoints.
- For local development, copy `.env.example` to `.env` and fill in your own Supabase project credentials.
- Production secrets are managed outside this repo — ask the project lead.

---

## What NOT to Do

- Don't push directly to `main` or `develop` — always use a PR.
- Don't add a second backend — there is one Go backend (`apps/backend`). New server-side logic goes there or in `services/go-shared`.
- Don't duplicate shared code — if it's useful in more than one place, it belongs in `services/go-shared` (Go) or `packages/` (TypeScript).
- Don't skip error handling in Go — every `err` must be checked.
- Don't ignore `go vet` or `flutter analyze` warnings — fix them.
- Don't introduce new npm/pnpm dependencies without checking if something already in the repo does the job.
- Don't modify existing migrations — create a new one.
- Don't expose the service-role key to any client.

---

*Questions? Open a GitHub Discussion or reach out to the maintainers.*
