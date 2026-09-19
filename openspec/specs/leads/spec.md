## Purpose

Public trial and contact requests for a deployed gym, stored by the server so landing and staff can act on them without a third-party form backend.

## Requirements

### Requirement: Capture leads
Unauthenticated visitors SHALL submit trial or contact requests (name, contact, optional message) to the server. The server MUST persist a gym-scoped lead.

Public lead submission MUST apply spam and abuse controls: per-IP rate limiting, a honeypot field that MUST be empty, a captcha verification hook that is off by default, server-side validation and request size limits, and duplicate suppression for the same contact in a short window.

#### Scenario: Valid trial form
- **WHEN** a visitor submits a valid trial request for the gym
- **THEN** a lead row is stored
- **AND** the API returns success without creating a full member until staff convert it

#### Scenario: Invalid form
- **WHEN** a visitor omits required fields
- **THEN** no lead is stored
- **AND** the API returns a validation error

#### Scenario: Oversized body
- **WHEN** a visitor submits a lead body larger than the documented size limit
- **THEN** no lead is stored
- **AND** the API returns a 4xx error

#### Scenario: Rate limited
- **WHEN** a client exceeds the per-IP lead submission limit
- **THEN** further submissions from that IP are rejected
- **AND** no additional lead is stored for those rejected requests

#### Scenario: Honeypot filled
- **WHEN** a submission includes a non-empty honeypot field
- **THEN** the API returns success without storing a lead

#### Scenario: Captcha hook disabled
- **WHEN** captcha is not configured (the default)
- **THEN** a valid submission is accepted without captcha verification

#### Scenario: Captcha hook enabled
- **WHEN** captcha is configured and a submission fails captcha verification
- **THEN** no lead is stored
- **AND** the API returns a 4xx error

#### Scenario: Duplicate suppression
- **WHEN** a visitor submits the same contact for the same gym within the suppression window
- **THEN** the API returns success without creating a second open lead

### Requirement: Staff manage leads
Owner, manager, and receptionist SHALL list and view leads for their gym. They SHALL be able to mark a lead contacted, dismissed, or converted into a member (conversion MAY reuse members create).

#### Scenario: Receptionist lists leads
- **WHEN** a receptionist lists leads
- **THEN** they see their gym's leads only

#### Scenario: Convert lead
- **WHEN** staff convert a lead into a member with required profile fields
- **THEN** a member profile exists
- **AND** the lead is marked converted and linked to that member
