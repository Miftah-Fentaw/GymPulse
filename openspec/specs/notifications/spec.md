## Purpose

Realtime and outbound notifications owned by the Go server: in-app streams, web push for the PWA, and SMS/email behind swappable drivers with a no-op default. Implementation is later; this spec has no change folder yet.

## Requirements

### Requirement: Server-pushed events
The server SHALL offer an authenticated realtime channel (SSE or WebSocket) so clients can receive gym-scoped events such as check-in confirmations and booking changes.

#### Scenario: Authenticated member subscribes
- **WHEN** a member opens an authenticated event stream
- **THEN** they receive events destined for their user or gym role
- **AND** they do not receive another gym's events

#### Scenario: Unauthenticated subscribe is rejected
- **WHEN** a client connects to the event stream without a valid access token
- **THEN** the server rejects the connection

### Requirement: Web push
The PWA SHALL be able to register a web-push subscription with the server. The server SHALL send web-push messages for opted-in events (at least booking reminders or check-in alerts as defined by a later change).

#### Scenario: Register subscription
- **WHEN** an authenticated PWA user registers a valid push subscription
- **THEN** the server stores it attached to that user
- **AND** a later matching event can trigger a push

### Requirement: SMS and email drivers
SMS and email SHALL be sent only through Go interfaces. The default drivers MUST be no-op or log-only so a self-hosted gym works without a vendor. Switching providers MUST be configuration plus a driver, not business-logic changes.

#### Scenario: Default email driver
- **WHEN** the email driver is the no-op/log default and the system would send mail
- **THEN** no external SMTP call is required for the server to remain healthy
- **AND** the notification intent is still recorded or logged

### Requirement: Notification outbox
The server SHALL persist notification intents in an outbox (table or equivalent) before attempting delivery. Password reset, staff invite, waitlist free-spot, and similar events MUST write an outbox row even when the email/SMS/push driver is no-op. Delivery workers MAY be Later; the outbox is the contract so domain handlers do not call vendors directly.

#### Scenario: Reset enqueued
- **WHEN** a password-reset is requested for a known user
- **THEN** an outbox row exists with type and recipient
- **AND** a missing SMTP vendor does not fail the HTTP request
