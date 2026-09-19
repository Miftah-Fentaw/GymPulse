## MODIFIED Requirements

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
