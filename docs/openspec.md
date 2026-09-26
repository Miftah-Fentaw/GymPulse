# OpenSpec workflow

GymPulse is **spec-driven**. Non-trivial behavior changes are proposed, approved, implemented as tasks, then archived into main specs. Agents follow [AGENTS.md](../AGENTS.md) and `openspec/config.yaml`.

## Layout

```
openspec/
  config.yaml              # Project context shown to agents (keep in sync with AGENTS.md)
  specs/                   # Current product contracts (source of truth for behavior)
    <capability>/spec.md
  changes/
    <change-name>/         # Active change
      .openspec.yaml
      proposal.md
      design.md
      tasks.md
      specs/<capability>/spec.md   # Delta (ADDED / MODIFIED / REMOVED / RENAMED)
    archive/
      YYYY-MM-DD-<change-name>/    # Completed changes
```

Capabilities today include (among others): `auth-and-roles`, `members`, `memberships`, `checkin-attendance`, `billing-payments`, `admin-dashboard`, `member-trainer-pwa`, `landing-site`, `http-api`, `deployment`, …

## Lifecycle

```
explore ──► propose ──► (approve) ──► apply ──► verify ──► archive
              │                         │
              ▼                         ▼
        proposal/design/specs/tasks   code + openapi + UI
```

| Stage | Cursor / CLI | What you produce |
|:---|:---|:---|
| Explore | `/opsx-explore` | Thinking only — no commits required |
| Propose | `/opsx-propose` | `proposal.md`, `design.md`, delta `specs/`, `tasks.md` |
| Apply | `/opsx-apply` | Implement tasks; mark `- [x]` in `tasks.md` |
| Verify | `/opsx-verify` | Check implementation vs artifacts |
| Archive | `/opsx-archive` | Sync deltas → `openspec/specs/`, move change to `archive/` |

Also useful: `/opsx-update` (revise planning artifacts), `/opsx-sync` (merge specs without archiving).

## CLI cheat sheet

Run from the repo root (nearest `openspec/`):

```bash
openspec list --json
openspec list --specs
openspec status --change "<name>" --json
openspec instructions apply --change "<name>" --json
openspec instructions archive --change "<name>" --json
openspec instructions specs --change "<name>" --json
openspec validate --change "<name>" --strict
openspec view
openspec doctor
```

Registered OpenSpec **stores** (standalone) need `--store <id>` on those commands; this project normally uses the in-repo `openspec/` root.

## Artifact guide

### proposal.md

Why the change exists, scope, capabilities touched, out of scope. Stakeholder-readable.

### design.md

Technical decisions: API shapes, authz, data model impacts, trade-offs, risks. Not a dump of framework trivia unless it constrains behavior.

### specs/\<capability\>/spec.md (delta)

Behavior contracts only:

- `## ADDED Requirements` / `## MODIFIED Requirements` / `## REMOVED` / `## RENAMED`
- Each requirement: `### Requirement: …` with SHALL/MUST
- Each scenario: `#### Scenario: …` with WHEN/THEN
- New capabilities start with `## Purpose` (50+ chars)

Do **not** put class names, library picks, or step-by-step implementation plans in specs.

### tasks.md

Checkbox implementation plan. Each task should be verifiable. Apply marks them `[x]` when **fully** done.

## Apply rules (implementation)

1. Read `openspec/config.yaml` context and relevant `openspec/specs/`.
2. Follow apply order in config (backend-first historical sequence).
3. HTTP changes: update `openapi.yaml` → `make generate` → implement Go → wire UI via api-client.
4. Keep diffs minimal; do not violate architecture (Go owns DB/authz).
5. Mark a task complete only when its acceptance/verify note is satisfied.

## Archive rules

1. All planning artifacts `done` (or skipped with `skip_specs`).
2. Prefer all tasks `[x]`.
3. If delta specs exist: **sync into main specs** (intelligent merge), then verify ADDED/MODIFIED/REMOVED/RENAMED landed.
4. Move `openspec/changes/<name>` → `openspec/changes/archive/YYYY-MM-DD-<name>/`.
5. Archive only after the maintainer confirms (project convention).

## Example: adding a feature

1. `/opsx-propose member-waitlist` — describe capability deltas for `classes-booking`.
2. Review/approve proposal + design + specs + tasks.
3. `/opsx-apply member-waitlist` — implement OpenAPI + Go + admin/PWA tasks.
4. `make test && make lint`.
5. `/opsx-archive member-waitlist` — sync specs, archive folder.

## Relationship to other docs

| Doc | Relationship |
|:---|:---|
| [AGENTS.md](../AGENTS.md) | Hard constraints for coding agents |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | Human PR expectations (includes OpenSpec) |
| [howto.md](howto.md) | Day-to-day commands |
| [architecture.md](architecture.md) | Runtime system design |
| `openapi.yaml` | Wire-level contract (must stay aligned with specs that mention HTTP) |

## Recently completed changes (context)

These were implemented and are archived with this documentation pass:

| Change | Theme |
|:---|:---|
| `member-payments-attendance` | Screenshot payments (Telebirr/CBE), staff review, QR check-in both sides, seed/demo |
| `member-pwa-ui` | Member/trainer PWA shell, brand, responsive nav (bottom bar / sidebar) |

After archive, their requirements live under `openspec/specs/` (billing, check-in, admin-dashboard, member-trainer-pwa).
