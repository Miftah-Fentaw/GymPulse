## Purpose

File storage behind a Go interface so uploads (member photos, receipts, marketing assets) work on local disk or any S3-compatible endpoint, including Supabase Storage's S3 API.

## Requirements

### Requirement: Storage interface
Application code SHALL read and write files only through a storage interface. Callers MUST NOT import a specific vendor SDK outside the driver package.

#### Scenario: Business logic stores a file
- **WHEN** a handler stores a member photo via the storage interface
- **THEN** the object is written using the configured driver
- **AND** the handler does not reference local paths or S3 APIs directly

### Requirement: Local disk driver
The system SHALL ship a local disk driver suitable for single-node self-hosting. Configuration MUST be a base directory env var.

#### Scenario: Local put and get
- **WHEN** STORAGE_DRIVER is local and a file is saved
- **THEN** the bytes are readable back through the same interface
- **AND** the file exists under the configured directory

### Requirement: S3-compatible driver
The system SHALL ship an S3-compatible driver. Pointing it at Supabase Storage's S3 endpoint MUST require only configuration (endpoint, bucket, keys, region), not code that names Supabase.

#### Scenario: S3 put
- **WHEN** STORAGE_DRIVER is s3 and valid S3 settings are provided
- **THEN** a saved object can be retrieved through the interface
- **AND** no source file outside the S3 driver package contains a Supabase Storage API

### Requirement: No public bucket dependence for authorization
Object access authorization SHALL be enforced by the Go server (signed URLs or authenticated download). The system MUST NOT treat a public bucket or Supabase anon key as the authorization layer.

#### Scenario: Unauthenticated download of a private object
- **WHEN** a client requests a private object without a valid server credential or token
- **THEN** the server denies the download
