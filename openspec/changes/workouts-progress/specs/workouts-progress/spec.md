## MODIFIED Requirements

### Requirement: Member workout log
An authenticated member SHALL create, list, and update their own workout logs (at least date, optional notes, and a structured set of exercises or a free-text body for the MVP as defined by the implementing change). Logs MUST belong to the member and gym.

#### Scenario: Member records a workout
- **WHEN** a member submits a valid workout log
- **THEN** the log is stored
- **AND** it appears in that member's history

#### Scenario: Member cannot write another member's log
- **WHEN** a member attempts to create or edit a log for a different member id
- **THEN** the server rejects the request

### Requirement: Progress
The system SHALL expose a progress view for a member based on their logs (at least a chronological history; computed stats MAY be added later). Members see only their own progress.

#### Scenario: Member views progress
- **WHEN** a member requests their progress
- **THEN** the server returns that member's logs or derived progress
- **AND** no other member's data is included

### Requirement: Trainer access to assigned clients
A trainer SHALL view workout logs and progress for members currently assigned to them. A trainer MAY add a log on behalf of an assigned client. Trainers MUST NOT access unassigned members' logs.

#### Scenario: Trainer views assigned client
- **WHEN** a trainer requests logs for an assigned member
- **THEN** the server returns that member's logs

#### Scenario: Trainer blocked for unassigned member
- **WHEN** a trainer requests logs for a member they are not assigned to
- **THEN** the server denies the request
