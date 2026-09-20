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

## ADDED Requirements

### Requirement: New signups report
Owner and manager SHALL retrieve new member counts (profiles created) for a date range via `GET /v1/reports/signups`, optionally filtered by branch.

#### Scenario: Signups in a period
- **WHEN** a manager requests signups for last month
- **THEN** the count includes members created in that period for their gym
- **AND** another gym is excluded

### Requirement: Class utilization
Owner and manager SHALL retrieve booked versus capacity totals per session or class type via `GET /v1/reports/class-utilization`.

#### Scenario: Utilization
- **WHEN** a manager requests class utilization for a week
- **THEN** the report includes booked count and capacity for sessions in that range
- **AND** a receptionist is forbidden

### Requirement: Report export
Owner and manager SHALL export a named report as CSV or JSON via `GET /v1/reports/{report}/export`. Offset pagination MAY be used for export pages.

#### Scenario: CSV export
- **WHEN** an owner exports revenue as csv
- **THEN** the response is a CSV of that gym's report rows
- **AND** a trainer is forbidden
