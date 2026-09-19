## Purpose

Class schedule, capacity, and member booking so a gym can run group sessions without overbooking.

## Requirements

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
