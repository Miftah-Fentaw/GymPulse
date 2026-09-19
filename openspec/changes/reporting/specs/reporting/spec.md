## MODIFIED Requirements

### Requirement: Role-gated reports
Only owner and manager SHALL access business reports. Receptionists, trainers, and members-only accounts MUST be forbidden.

#### Scenario: Manager reads a report
- **WHEN** a manager requests a gym report they are allowed to see
- **THEN** the server returns the report for their gym

#### Scenario: Trainer is forbidden
- **WHEN** a trainer requests a business report
- **THEN** the server responds forbidden
- **AND** no aggregate revenue or membership data is returned

### Requirement: Active members and churn
The system SHALL report active member counts and churn (memberships that ended or cancelled in a date range) filterable by branch.

#### Scenario: Active count
- **WHEN** a manager requests active members for today
- **THEN** the count includes members with access-granting memberships
- **AND** archived members and expired memberships are excluded

#### Scenario: Churn in a period
- **WHEN** an owner requests churn for last month
- **THEN** the report counts memberships cancelled or expired in that period for their gym

### Requirement: Revenue summary
The system SHALL summarize paid amounts and outstanding/overdue invoice totals for a date range. Figures MUST come from GymPulse billing records, not from an external processor.

#### Scenario: Revenue for a period
- **WHEN** an owner requests revenue for last month
- **THEN** the report totals payments recorded in that period for their gym
- **AND** another gym's payments are not included

### Requirement: Attendance summary
The system SHALL provide attendance counts for a date range, filterable by branch.

#### Scenario: Branch filter
- **WHEN** a manager requests attendance summary for one branch and a date range
- **THEN** the totals include only that branch's events
- **AND** other branches of the same gym are excluded
