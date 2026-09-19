## Why

Member photos and later progress photos need a storage interface before member profiles grow file fields. Local disk for self-host; S3-compatible for MinIO/S3.

## What Changes

- `internal/storage` interface: Put, Get, Delete.
- Local disk driver (`STORAGE_DRIVER=local`, `STORAGE_LOCAL_DIR`).
- S3-compatible driver (endpoint, bucket, keys, region).
- Photos private by default: authenticated download or short-lived server-issued signed URL only. No public bucket URLs. HTTP: upload, metadata, content, signed URL, delete.
- Wire config and a small health/smoke path (e.g. put/get in tests). Member photo HTTP lands with members; this change ships the drivers.

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `storage`: Interface, local disk, S3-compatible, authorized access. Photo HTTP in this slice if cheap; otherwise members change uses the interface.

## Impact

- `server/internal/storage/`
- Env vars in `.env.example`
- Tests with a temp directory; S3 driver tested with a minio-like mock or skipped without endpoint
