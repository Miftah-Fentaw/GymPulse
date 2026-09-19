## MODIFIED Requirements

### Requirement: Plans
The gym SHALL define membership plans (name, price, duration or billing period, and which branches they apply to). Plans MUST be gym-scoped.

#### Scenario: Owner creates a plan
- **WHEN** an owner or manager creates a plan with name, price, and period
- **THEN** the plan is available to assign to members of that gym
- **AND** staff at another gym cannot see it

### Requirement: Assign membership
Staff SHALL assign a plan to a member with a start date. The membership MUST track an end or next-renewal date. A member MAY have at most one active (non-cancelled, non-expired, non-fully-frozen to inactivity as defined by freeze rules) access-granting membership at a time unless a later change explicitly allows stacking.

#### Scenario: Assign a plan to a member
- **WHEN** staff assign a valid plan to an active member
- **THEN** a membership record is created with start and end (or renewal) dates
- **AND** the member is considered current until expiry, cancel, or a blocking freeze

### Requirement: Freeze, upgrade, and cancel
Staff SHALL be able to freeze, upgrade (change plan), or cancel a membership. Each action MUST be recorded with an actor, timestamp, and reason when provided.

#### Scenario: Freeze
- **WHEN** staff freeze a current membership for a date range
- **THEN** the membership does not grant access during the freeze
- **AND** the end date is extended by the freeze length unless the gym configured otherwise

#### Scenario: Upgrade
- **WHEN** staff upgrade a current membership to a different plan
- **THEN** the new plan takes effect from the effective date
- **AND** the previous plan assignment is retained in history

#### Scenario: Cancel
- **WHEN** staff cancel a membership
- **THEN** the membership stops granting access at the cancel effective date
- **AND** the record remains visible in history

### Requirement: Expiry
The system SHALL treat a membership as expired when its end date has passed and it has not been renewed. Expired memberships MUST NOT grant check-in or class booking access.

#### Scenario: Access after expiry
- **WHEN** a membership's end date is in the past and it was not renewed
- **THEN** check-in and booking that require a current membership are denied
- **AND** staff can still view the expired membership

## ADDED Requirements

### Requirement: Resume membership
Staff SHALL resume a frozen membership via `POST /v1/memberships/{membershipId}/resume`, ending the freeze early. Access MUST resume when freeze rules allow.

#### Scenario: Resume freeze
- **WHEN** staff resume a frozen membership before the freeze end date
- **THEN** the membership grants access again (if otherwise current)
- **AND** the freeze is recorded as ended

### Requirement: Renew membership
Staff SHALL renew a current or recently expired membership via `POST /v1/memberships/{membershipId}/renew`. Renewal MUST issue an invoice when the plan is paid (billing-payments).

#### Scenario: Renew
- **WHEN** staff renew an eligible membership
- **THEN** the end or next-renewal date is extended by the plan period
- **AND** an invoice is issued for a paid plan

### Requirement: Expiring memberships list
Staff SHALL list memberships expiring within a configurable window (query `within_days`) via `GET /v1/memberships/expiring`.

#### Scenario: Expiring soon
- **WHEN** a receptionist lists expiring memberships within 7 days
- **THEN** memberships whose end date falls in that window are included
- **AND** already expired or cancelled memberships are omitted unless documented otherwise
