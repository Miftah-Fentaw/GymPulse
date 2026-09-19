## MODIFIED Requirements

### Requirement: Class schedule
Staff SHALL create class sessions with name, branch, start and end time, capacity, and optional trainer. Sessions MUST be gym-scoped and branch-scoped.

#### Scenario: Manager publishes a session
- **WHEN** a manager creates a class session with capacity and start time
- **THEN** eligible members can see it on the schedule for that branch
- **AND** staff at another gym cannot see it

### Requirement: Booking
A member with a current membership SHALL be able to book a session that still has capacity. The server MUST reject a booking that would exceed capacity.

#### Scenario: Successful book
- **WHEN** a current member books a session with remaining capacity
- **THEN** a booking is created
- **AND** remaining capacity decreases by one

#### Scenario: Full class
- **WHEN** a member books a session whose booked count equals capacity
- **THEN** the server rejects the booking
- **AND** the booked count is unchanged

### Requirement: Cancel booking
A member SHALL be able to cancel their own booking before a gym-configured cutoff. Staff SHALL be able to cancel a booking at any time. Cancelled bookings MUST free capacity.

#### Scenario: Member cancels in time
- **WHEN** a member cancels their booking before the cutoff
- **THEN** the booking is cancelled
- **AND** another member can book the freed spot

### Requirement: Access rules
Booking MUST require a current, access-granting membership for that gym (and branch if the plan is branch-limited). Expired, cancelled, or frozen-without-access members MUST NOT book.

#### Scenario: Expired member cannot book
- **WHEN** a member whose membership does not grant access attempts to book
- **THEN** the server rejects the booking
- **AND** capacity is unchanged

## ADDED Requirements

### Requirement: Class types
Staff SHALL define reusable class types (name, description, default capacity) via `/v1/class-types`. Owner and manager write; authenticated users may read types used on the public/member schedule.

#### Scenario: Create type
- **WHEN** a manager creates a class type
- **THEN** it can be selected when creating a session or schedule
- **AND** another gym cannot see it

### Requirement: Recurring schedules
Owner and manager SHALL create recurring weekly schedules that generate sessions. Generated sessions MUST honor capacity and branch. Staff MAY still create one-off sessions.

#### Scenario: Weekly schedule
- **WHEN** a manager creates a weekly schedule
- **THEN** upcoming sessions exist for that rule
- **AND** members can book those sessions within capacity

### Requirement: Waitlist
When a session is full, a current member SHALL join a waitlist via `POST /v1/sessions/{sessionId}/waitlist`. When a booking is cancelled, the server SHALL offer the next waitlisted member (notification outbox; auto-book MAY be Later). Staff MAY list and remove waitlist rows.

#### Scenario: Join when full
- **WHEN** a current member joins the waitlist of a full session
- **THEN** a waitlist row is stored
- **AND** capacity is unchanged until a booking is cancelled

### Requirement: Class session attendance
Owner, manager, receptionist, and the session's trainer SHALL mark who attended a session via `POST /v1/sessions/{sessionId}/attendance`.

#### Scenario: Mark attendance
- **WHEN** a receptionist posts member ids for a session
- **THEN** those members are recorded as attended
- **AND** a member who was not booked may still be marked if staff include them

### Requirement: Rooms and equipment
Rooms and equipment resources SHALL be Later. MVP sessions MUST NOT require a room id.

#### Scenario: Rooms later
- **WHEN** a client lists rooms before that later slice
- **THEN** the operation is documented as Later in OpenAPI
