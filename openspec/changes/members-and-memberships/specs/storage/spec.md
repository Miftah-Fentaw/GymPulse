## MODIFIED Requirements

### Requirement: Member and progress photos
Staff SHALL be able to attach a profile photo to a member. Members and assigned trainers SHALL be able to attach progress photos to that member. Photos MUST be stored via the storage interface and metadata MUST be gym-scoped.

This slice implements **profile photos** only. Progress photos are implemented with workouts-progress.

#### Scenario: Staff upload member photo
- **WHEN** a receptionist uploads a valid image for a member in their gym
- **THEN** the object is stored
- **AND** staff of that gym can retrieve it through the API

#### Scenario: Cross-gym photo is denied
- **WHEN** staff of gym A request a photo belonging to gym B
- **THEN** the server denies the request
