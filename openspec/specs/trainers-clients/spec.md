## Purpose

Assign trainer-staff accounts to members and give the trainer staff role a client-scoped view of only the people they coach.

## Requirements

### Requirement: Assign trainer
Owner and manager SHALL assign one or more users who have the trainer staff role to a member (or a member to a trainer). Assignments MUST be gym-scoped. Receptionists MAY view assignments but SHALL NOT change them unless a later change says otherwise.

#### Scenario: Manager assigns a trainer
- **WHEN** a manager assigns a trainer-staff user to a member of the same gym
- **THEN** the assignment is stored
- **AND** the trainer sees that member in their client list

#### Scenario: Cross-gym assignment is rejected
- **WHEN** a manager attempts to assign a trainer from another gym
- **THEN** the server rejects the assignment
- **AND** no assignment row is stored

### Requirement: Trainer client list
A trainer SHALL list only members currently assigned to them in their gym. Trainers MUST NOT see other members' profiles, billing, or attendance except where a later spec explicitly allows class-roster visibility.

#### Scenario: Trainer lists clients
- **WHEN** a trainer requests their clients
- **THEN** the server returns assigned members only

#### Scenario: Trainer cannot read an unassigned member
- **WHEN** a trainer requests a member they are not assigned to
- **THEN** the server responds as not found or forbidden

### Requirement: Unassign
Owner and manager SHALL remove a trainer-member assignment. After unassign, the trainer MUST lose client-list access to that member.

#### Scenario: Unassign takes effect
- **WHEN** a manager unassigns a trainer from a member
- **THEN** that member no longer appears in the trainer's client list
- **AND** a subsequent client-detail request by the trainer is denied

### Requirement: Trainer profile
Each user with the trainer staff role SHALL have a profile (bio, specialties) readable by authenticated gym principals via `/v1/trainers`. The trainer, owner, and manager MAY update it.

#### Scenario: Update bio
- **WHEN** a trainer patches their profile bio
- **THEN** GET trainer includes the bio
- **AND** a receptionist cannot patch another trainer's bio

### Requirement: PT session booking
Members, assigned trainers, and front-desk staff SHALL book personal-training sessions via `/v1/pt-sessions` against trainer availability. Overlaps MUST be rejected. Cancel/update MUST free the slot.

#### Scenario: Book available slot
- **WHEN** a member books a PT session in an open availability slot
- **THEN** a PT session row exists
- **AND** a second booking for the same slot is rejected

### Requirement: Trainer availability
A trainer SHALL publish weekly availability via `PUT /v1/trainers/{trainerId}/availability`. Authenticated users MAY read it for booking.

#### Scenario: Replace availability
- **WHEN** a trainer replaces their weekly hours
- **THEN** subsequent PT booking uses the new hours
- **AND** another trainer cannot replace them

### Requirement: Trainer notes
Assigned trainers, owner, and manager SHALL add notes on a client via `/v1/members/{memberId}/trainer-notes`. The member MUST NOT read trainer notes. Unassigned trainers MUST be denied.

#### Scenario: Assigned trainer notes
- **WHEN** an assigned trainer posts a note
- **THEN** that trainer and managers can list it
- **AND** the member cannot

### Requirement: Trainer commission
Commission reporting SHALL be Later. The MVP MUST NOT calculate trainer pay.

#### Scenario: Commission later
- **WHEN** a client requests commission before that later slice
- **THEN** the operation is documented as Later in OpenAPI
