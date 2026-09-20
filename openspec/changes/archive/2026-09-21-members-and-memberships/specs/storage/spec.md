## MODIFIED Requirements

### Requirement: Member and progress photos
Staff SHALL be able to attach a profile photo to a member. Members and assigned trainers SHALL be able to attach progress photos to that member. Photos MUST be stored via the storage interface, MUST be gym-scoped, and MUST be private by default.

This slice implements **profile photos** only. Progress photos are implemented with workouts-progress.

#### Scenario: Staff upload member photo
- **WHEN** a receptionist uploads a valid image for a member in their gym
- **THEN** the object is stored
- **AND** staff of that gym can retrieve it through the API

#### Scenario: Cross-gym photo is denied
- **WHEN** staff of gym A request a photo belonging to gym B
- **THEN** the server denies the request

#### Scenario: Member uploads a progress photo
- **WHEN** a member uploads a progress photo for themselves
- **THEN** the object is stored via the storage interface
- **AND** it appears in that member's progress photos

#### Scenario: Unassigned trainer cannot upload
- **WHEN** a trainer uploads a progress photo for a member they are not assigned to
- **THEN** the server denies the request

#### Scenario: Public URL is not used
- **WHEN** a client tries to fetch a member photo without authentication and without a valid signed URL
- **THEN** the server denies the request
