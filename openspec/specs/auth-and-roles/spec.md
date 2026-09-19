## Purpose

Server-owned authentication for accounts that can hold a member profile and/or staff roles. Frontends never talk to a third-party auth provider.

## Requirements

### Requirement: Password login
The server SHALL authenticate users with an email and password stored by GymPulse. The credentials MUST be verified by the Go server using **argon2id** password hashes. The system MUST NOT use an external identity provider for these logins.

#### Scenario: Valid credentials
- **WHEN** a user submits a correct email and password
- **THEN** the server returns a short-lived access token and establishes a refresh session
- **AND** the response includes the user's id, gym_id, staff roles, and whether a member profile exists

#### Scenario: Invalid credentials
- **WHEN** a user submits an unknown email or a wrong password
- **THEN** the server rejects the login with a generic authentication error
- **AND** the response MUST NOT reveal whether the email exists

### Requirement: Access and refresh tokens
The server SHALL issue a short-lived JWT access token (**15 minutes**, golang-jwt/jwt/v5) and a longer-lived **opaque** refresh token. Access tokens MUST be sent as `Authorization: Bearer`. Refresh tokens MUST be stored hashed, rotated on each use, and grouped into a family: reuse of a rotated token MUST revoke the whole family. Refresh MUST work via `POST /v1/auth/refresh` with an httpOnly Secure cookie as the primary method (API host `api.<domain>`) and a JSON body token as fallback.

#### Scenario: Refresh with a valid cookie
- **WHEN** a client on an allowed origin (`https://admin.<domain>` or `https://app.<domain>`) calls refresh with a valid, unexpired, unrevoked refresh cookie
- **THEN** the server returns a new access token
- **AND** the previous refresh token is rotated and cannot be reused

#### Scenario: Refresh token reuse
- **WHEN** a client presents a refresh token that was already rotated
- **THEN** the server revokes the entire token family
- **AND** the client MUST sign in again

#### Scenario: Refresh with a revoked or expired token
- **WHEN** a client calls refresh with an expired, reused, or revoked refresh token
- **THEN** the server rejects the request
- **AND** the client MUST sign in again

### Requirement: Account capabilities
A user account SHALL belong to one gym and MAY have a member profile, one or more staff roles (`owner`, `manager`, `receptionist`, `trainer`), or both. Authorization MUST be enforced in the Go layer using those capabilities, not a client-supplied role field. The PWA SHALL choose member and/or trainer views from the account's capabilities. The admin app SHALL require at least one of owner, manager, or receptionist.

#### Scenario: Combined member and trainer
- **WHEN** an account has a member profile and the trainer staff role
- **THEN** login payload lists both
- **AND** the PWA can switch between member and trainer views

#### Scenario: Staff without member profile
- **WHEN** an owner has no member profile
- **THEN** they can use the admin app
- **AND** member-only PWA features that require a member profile are unavailable

#### Scenario: Insufficient capability
- **WHEN** an authenticated user calls an endpoint their capabilities do not allow
- **THEN** the server responds with a forbidden error
- **AND** no mutation is performed

### Requirement: Logout and session revocation
The server SHALL allow a user to log out, which revokes the current refresh token. The server SHALL allow an owner or manager to revoke a user's sessions.

#### Scenario: User logs out
- **WHEN** an authenticated user logs out
- **THEN** their current refresh token is revoked
- **AND** a later refresh attempt with that token fails

### Requirement: Cross-origin refresh safety
Cookie refresh SHALL work for `https://admin.<domain>` and `https://app.<domain>` calling `https://api.<domain>` (same eTLD+1, Caddy). The landing origin (`https://<domain>`) MUST NOT receive or send the refresh cookie. Cookie-authenticated auth routes MUST reject requests that fail Origin checks (CSRF).

#### Scenario: Landing cannot refresh
- **WHEN** the landing origin calls `POST /v1/auth/refresh` with credentials
- **THEN** the server does not treat it as an allowed credentialed auth origin
- **AND** no new access token is issued from a landing-origin CSRF
