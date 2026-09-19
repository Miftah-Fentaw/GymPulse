## 1. Interface and drivers

- [ ] 1.1 Storage interface + local disk driver with `STORAGE_LOCAL_DIR` — verify: put/get/delete round-trip in a temp dir test
- [ ] 1.2 S3-compatible driver selected by `STORAGE_DRIVER=s3` — verify: interface test with a fake or env-gated MinIO; callers do not import the S3 SDK

## 2. Metadata and authz

- [ ] 2.1 `files` table (UUIDv7 PK, gym_id, key, content_type) — verify: migrate up
- [ ] 2.2 Authenticated download endpoint 401 without token and 403/404 cross-gym — verify: HTTP tests (can use a stub member-less owner token)

## 3. OpenAPI and integration

- [ ] 3.1 Config default is local; `.env.example` lists storage vars — verify: file contents
- [ ] 3.2 Update `openapi.yaml` for file download/upload routes and `make generate` — verify: generate is clean
- [ ] 3.3 DB tests use testcontainers-go Postgres 16 — verify: `go test` does not mock SQL
