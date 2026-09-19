## Context

See proposal.md — Why. Depends on bootstrap-server (config). Photo metadata tables can wait for members; this change is the driver layer plus a private GET that 401s without auth.

## Goals / Non-Goals

**Goals:**
- Interface + local + S3-compatible drivers
- Keys namespaced by gym id when objects are stored

**Non-Goals:**
- CDN, image transforms
- Progress photo UX (workouts-progress / members can attach using this interface)

## Decisions

### Decision 1: Object keys

`gyms/{gym_id}/members/{member_id}/profile` and `.../progress/{uuid}` later. Generate object ids as UUIDv7.

### Decision 2: Download via API

Photos are private by default. `GET /v1/files/{id}` with bearer auth, or a short-lived signed URL issued by the server. No public bucket URLs.

### Decision 3: Default local

Compose uses local disk volume. S3 is config-only.

## Risks / Trade-offs

- [S3 integration test] → unit-test interface; optional env-gated MinIO test.

## Migration Plan

Optional `files` metadata table in this change or with first photo upload in members. Prefer a `files` table here so members can FK it.

## Open Questions

None. Add `files` metadata in this change (gym_id, owner, key, content_type) with UUIDv7 ids.
