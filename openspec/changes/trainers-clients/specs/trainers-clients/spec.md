## MODIFIED Requirements

### Requirement: Assign trainer
Owner and manager SHALL assign one or more trainers to a member (or a member to a trainer). Assignments MUST be gym-scoped. Receptionists MAY view assignments but SHALL NOT change them unless a later change says otherwise.

#### Scenario: Manager assigns a trainer
- **WHEN** a manager assigns a trainer user to a member of the same gym
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
