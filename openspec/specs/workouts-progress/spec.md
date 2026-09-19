## Purpose

Members log workouts and progress; trainers view and optionally log for assigned clients. History stays gym-scoped.

## Requirements

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

### Requirement: Exercise library
The gym SHALL have an exercise library via `/v1/exercises`. Owner, manager, and trainers MAY create and update entries. Authenticated members MAY list them.

#### Scenario: Create exercise
- **WHEN** a trainer creates an exercise
- **THEN** it appears in the gym library
- **AND** another gym does not see it

### Requirement: Workout plans
Trainers, owner, and manager SHALL create workout plans and assign them to a member via `/v1/workout-plans` and `POST /v1/members/{memberId}/workout-plans`. Assigned trainers MAY assign to their clients only.

#### Scenario: Assign plan
- **WHEN** an assigned trainer assigns a plan to a client
- **THEN** the member can see that plan
- **AND** an unassigned trainer is denied

### Requirement: Body measurements
A member and their assigned trainer SHALL record and list body measurements via `/v1/members/{memberId}/measurements`. Other members MUST be denied.

#### Scenario: Member logs weight
- **WHEN** a member posts a measurement
- **THEN** it appears in their measurement history
- **AND** another member cannot read it

### Requirement: Member goals
A member and their assigned trainer SHALL read and replace training goals via `/v1/members/{memberId}/goals`.

#### Scenario: Set goals
- **WHEN** a member puts goals
- **THEN** a later GET returns those goals
- **AND** an unassigned trainer is denied
