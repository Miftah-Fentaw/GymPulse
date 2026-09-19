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
Object access authorization SHALL be enforced by the Go server. Photos and other private objects MUST be private by default: they MUST NOT be world-readable from a public bucket or static path. Clients MAY read a private object only via an authenticated API endpoint or a short-lived signed URL issued by the server. Unauthenticated clients MUST NOT read private objects.

#### Scenario: Unauthenticated download of a private object
- **WHEN** a client requests a private object without a valid server credential
- **THEN** the server denies the download

#### Scenario: Photos are private by default
- **WHEN** a member or progress photo is stored
- **THEN** unauthenticated clients cannot read the object
- **AND** the only allowed reads are an authenticated API download or a short-lived signed URL issued by the server

### Requirement: Member and progress photos
Staff SHALL be able to attach a profile photo to a member. Members and assigned trainers SHALL be able to attach progress photos to that member. Photos MUST be stored via the storage interface, MUST be gym-scoped, and MUST be private by default.

#### Scenario: Staff upload member photo
- **WHEN** a receptionist uploads a valid image for a member in their gym
- **THEN** the object is stored
- **AND** staff of that gym can retrieve it through the API

#### Scenario: Cross-gym photo is denied
- **WHEN** staff of gym A request a photo belonging to gym B
- **THEN** the server denies the request

#### Scenario: Public URL is not used
- **WHEN** a client tries to fetch a member photo without authentication and without a valid signed URL
- **THEN** the server denies the request

### Requirement: File HTTP API
The server SHALL expose authenticated file operations: `POST /v1/files` (upload), `GET /v1/files/{fileId}` (metadata), `GET /v1/files/{fileId}/content` (bytes), `POST /v1/files/{fileId}/signed-url` (short-lived URL), and `DELETE /v1/files/{fileId}`. Objects remain private by default. Authorization is gym-scoped and object-owner/staff as documented per object kind.

#### Scenario: Upload then download
- **WHEN** an authenticated user uploads a file and then downloads it with a valid token
- **THEN** the bytes match
- **AND** an unauthenticated download is denied

#### Scenario: Signed URL expiry
- **WHEN** a client uses a signed URL after it expires
- **THEN** the server denies the download
