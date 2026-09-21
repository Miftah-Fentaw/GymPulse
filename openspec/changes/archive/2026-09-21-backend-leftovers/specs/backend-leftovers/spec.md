## Purpose

Finish the remaining backend domain slices required for the GymPulse MVP: billing lifecycle, class booking, trainer/client scheduling, workout tracking, signed file access, reporting, and public landing APIs.

## Requirements

### Requirement: Invoice lifecycle completion
The system SHALL complete the remaining invoice lifecycle: discounts, refund handling, receipt retrieval, overdue detection, and cash-up reporting for a gym's local business day.

#### Scenario: Partial refund updates totals
- **WHEN** a manager refunds part of a recorded payment
- **THEN** the invoice balance and current paid amount are recalculated from persisted transaction rows
- **AND** the refund is auditable and visible in payment history

#### Scenario: Discount updates the balance
- **WHEN** an authorized manager applies a valid discount to an unpaid invoice
- **THEN** the invoice total is reduced and the remaining balance is recalculated
- **AND** paid invoices are rejected from a discount action

### Requirement: Class booking and session management
The system SHALL support staff-managed class sessions and member booking operations, including capacity checks, session state, and booking history.

#### Scenario: Member books a class
- **WHEN** a member books an available class session within the remaining capacity
- **THEN** a booking record is created for the member and the class session
- **AND** duplicate booking attempts in the same active window are rejected or deduplicated

#### Scenario: Full class blocks new bookings
- **WHEN** a class session reaches capacity
- **THEN** the server rejects additional bookings for that session
- **AND** staff can still list current booking state for the session

### Requirement: Trainer and client availability
The system SHALL support trainer assignments, availability windows, and client scheduling filters based on gym and branch scope.

#### Scenario: Trainer availability is enforced
- **WHEN** staff or members query available trainer slots for a time range
- **THEN** only open availability for the gym and branch is returned
- **AND** conflicting bookings or unavailable windows are excluded

#### Scenario: Assignment is scoped to the gym
- **WHEN** a trainer assignment is created for a client or class
- **THEN** it is stored with the correct gym and branch association
- **AND** cross-gym access is denied by authorization checks

### Requirement: Workout and progress tracking
The system SHALL support workout records, progress logs, measurement history, and photo attachments for members and trainers in the gym's scope.

#### Scenario: Member creates a workout log
- **WHEN** a member or trainer creates a workout log with associated measurements
- **THEN** the log is stored with gym and member associations and current timestamps
- **AND** the member can list only their own workout history

#### Scenario: Progress changes are retained
- **WHEN** a member updates a measurement or progress record
- **THEN** the latest values are stored and earlier values remain auditable
- **AND** trainers with permission can view the audit trail

### Requirement: Secure private file access
The system SHALL provide signed file download access for private files while limiting access to the owning gym and authorized user role.

#### Scenario: Authorized member downloads a file
- **WHEN** a member requests a signed download for a file they own or a permitted shared asset
- **THEN** the server returns a valid short-lived signed URL or download token
- **AND** unauthorized access is denied

#### Scenario: Expired signed link is rejected
- **WHEN** a client submits an expired signed download token
- **THEN** the request is rejected and no file content is served
- **AND** the server logs the failure for auditability

### Requirement: Reporting and export completeness
The system SHALL support richer report queries and exports for attendance, revenue, member summaries, and class activity with branch and date filters.

#### Scenario: Report filters are respected
- **WHEN** staff request a report for a specific date range and branch or member scope
- **THEN** the result includes only records for the authorized gym and requested filters
- **AND** unauthorized cross-gym data is excluded

#### Scenario: Export is generated in a supported format
- **WHEN** staff request a report export
- **THEN** the server produces a supported file format for the requested report type
- **AND** the exported row set matches the in-memory report query

### Requirement: Public landing API behavior
The system SHALL expose limited unauthenticated endpoints that return public gym metadata for the landing site without exposing protected operational data.

#### Scenario: Landing page requests public metadata
- **WHEN** a public landing request asks for gym branding, contact, and public class preview data
- **THEN** the server returns public data only
- **AND** private member, booking, or staff records are not included

#### Scenario: Protected data remains blocked
- **WHEN** an unauthenticated client requests staff or member-owned endpoints
- **THEN** the request fails with the standard authorization error flow
- **AND** no sensitive records are exposed

### Requirement: API contract alignment
The system SHALL keep the backend, OpenAPI schema, and generated API client aligned for all newly completed server endpoints and changes.

#### Scenario: Endpoint and schema stay in sync
- **WHEN** a backend route is added or changed
- **THEN** `openapi.yaml` is updated and `make generate` is run before release validation
- **AND** the checked-in generated client matches the schema
