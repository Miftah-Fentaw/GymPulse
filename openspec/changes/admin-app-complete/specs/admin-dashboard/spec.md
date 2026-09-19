## MODIFIED Requirements

### Requirement: Complete staff workflows
The admin app SHALL also manage class sessions, trainer assignments, and the reports dashboard (revenue, churn, active members) for owner and manager. Receptionists MUST NOT see owner-only reports.

#### Scenario: Manager opens reports
- **WHEN** a manager opens the reports dashboard
- **THEN** they see revenue, churn, and active-member figures for their gym

#### Scenario: Receptionist hidden reports
- **WHEN** a receptionist uses admin
- **THEN** report routes are hidden or forbidden
