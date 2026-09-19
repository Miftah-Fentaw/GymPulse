## Purpose

File storage behind a Go interface so member photos, progress photos, and similar uploads work on local disk or any S3-compatible endpoint (MinIO, AWS S3).

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
The system SHALL ship an S3-compatible driver configurable with endpoint, bucket, keys, and region for MinIO or AWS S3. Switching providers MUST be configuration, not a code change in callers.

#### Scenario: S3 put
- **WHEN** STORAGE_DRIVER is s3 and valid S3 settings are provided
- **THEN** a saved object can be retrieved through the interface

### Requirement: Authorized object access
Object access authorization SHALL be enforced by the Go server (authenticated download or short-lived signed URL issued by the server). Unauthenticated clients MUST NOT read private objects.

#### Scenario: Unauthenticated download of a private object
- **WHEN** a client requests a private object without a valid server credential
- **THEN** the server denies the download

### Requirement: Member and progress photos
Staff SHALL be able to attach a profile photo to a member. Members and assigned trainers SHALL be able to attach progress photos to that member. Photos MUST be stored via the storage interface and metadata MUST be gym-scoped.

#### Scenario: Staff upload member photo
- **WHEN** a receptionist uploads a valid image for a member in their gym
- **THEN** the object is stored
- **AND** staff of that gym can retrieve it through the API

#### Scenario: Cross-gym photo is denied
- **WHEN** staff of gym A request a photo belonging to gym B
- **THEN** the server denies the request
