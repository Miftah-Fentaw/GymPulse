## MODIFIED Requirements

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
Cookie refresh SHALL work for `https://admin.<domain>` and `https://app.<domain>` calling `https://api.<domain>` (same eTLD+1, native reverse proxy). The landing origin (`https://<domain>`) MUST NOT receive or send the refresh cookie. Cookie-authenticated auth routes MUST reject requests that fail Origin checks (CSRF).

#### Scenario: Landing cannot refresh
- **WHEN** the landing origin calls `POST /v1/auth/refresh` with credentials
- **THEN** the server does not treat it as an allowed credentialed auth origin
- **AND** no new access token is issued from a landing-origin CSRF

## ADDED Requirements

### Requirement: Password hashing
Passwords SHALL be stored with argon2id. The API MUST never return a password hash.

#### Scenario: Hash at rest
- **WHEN** a user account is created with a password
- **THEN** the database stores an argon2id hash, not the plaintext
- **AND** GET/list user payloads omit the hash

### Requirement: Bootstrap owner
A fresh deployment SHALL be able to create the first owner (documented env bootstrap or a one-time setup endpoint guarded so it only works when no owner exists).

#### Scenario: First owner
- **WHEN** the gym has no owner and the documented bootstrap is used
- **THEN** an owner user exists for that gym
- **AND** repeating the bootstrap after an owner exists is rejected

### Requirement: Current user profile
An authenticated user SHALL read and update their own account via `GET /v1/me` and `PATCH /v1/me` (name and phone). The payload MUST include user id, gym_id, staff roles, and whether a member profile exists. Password hashes MUST NOT be returned.

#### Scenario: Read me
- **WHEN** an authenticated user calls `GET /v1/me`
- **THEN** the server returns that user's capabilities
- **AND** the password hash is omitted

### Requirement: Password change
An authenticated user SHALL change their password by submitting the current password and a new password to `POST /v1/auth/password/change`. The current refresh family MUST be revoked except the session that performed the change, or all sessions revoked — the implementing change MUST pick one and document it. Other users' passwords MUST NOT be changed through this endpoint.

#### Scenario: Change own password
- **WHEN** a user submits a valid current password and a new password
- **THEN** subsequent login works only with the new password
- **AND** the old password is rejected

### Requirement: Password reset
The server SHALL accept `POST /v1/auth/password/forgot` with an email and always return success. When the email belongs to a user, the server SHALL enqueue a single-use reset token through the notification outbox (email driver may be no-op). `POST /v1/auth/password/reset` with a valid token SHALL set a new password and revoke refresh families for that user.

#### Scenario: Unknown email
- **WHEN** a client requests a reset for an email that is not registered
- **THEN** the API returns success
- **AND** no user row is created

#### Scenario: Valid reset token
- **WHEN** a user submits a valid unexpired reset token and a new password
- **THEN** login works with the new password
- **AND** the token cannot be reused

### Requirement: Staff invite
Owner and manager SHALL invite staff by email and roles via `POST /v1/auth/invite`. The invitee SHALL set a password via `POST /v1/auth/invite/accept`. Repeating bootstrap-owner after an owner exists MUST still be rejected; invites are how additional staff join.

#### Scenario: Manager invites a receptionist
- **WHEN** a manager invites an email with the receptionist role
- **THEN** accepting the invite creates (or attaches) a user with that role in the gym
- **AND** a receptionist cannot send invites

### Requirement: Email and phone verification
The server SHALL expose email and phone verification start/confirm endpoints. Until a later change implements delivery, the handlers MAY persist a token and enqueue through the notification outbox without requiring a vendor. Unverified contact MUST NOT block login in the MVP.

#### Scenario: Confirm email later
- **WHEN** a user submits a valid email verification token
- **THEN** the account's email is marked verified
- **AND** an invalid token is rejected

### Requirement: Own session list
An authenticated user SHALL list their refresh sessions and revoke one of them via `GET /v1/me/sessions` and `DELETE /v1/me/sessions/{sessionId}`. Owner and manager SHALL revoke all of another user's sessions via `POST /v1/staff/{staffId}/revoke-sessions`.

#### Scenario: User revokes a device
- **WHEN** a user deletes one of their sessions
- **THEN** refresh with that session's token fails
- **AND** other sessions remain usable

### Requirement: Staff directory and roles
Owner, manager, and receptionist SHALL list staff for their gym. Owner and manager SHALL update staff profile fields, replace roles, deactivate, and reactivate. **Only an owner MAY grant or revoke the `owner` and `manager` roles. A manager MAY invite and edit `receptionist` and `trainer` accounts only.** The last remaining active owner MUST NOT be deactivated, demoted, or have the owner role removed; the server MUST return 409 with `error.code: last_owner`.

#### Scenario: List staff
- **WHEN** a receptionist lists staff
- **THEN** the response includes gym staff accounts
- **AND** another gym's staff are not included

#### Scenario: Last owner protected
- **WHEN** a manager or owner attempts to remove the owner role from the only remaining owner
- **THEN** the server responds 409 with error.code last_owner
- **AND** the owner role remains

#### Scenario: Manager cannot grant manager role
- **WHEN** a manager attempts to invite or assign the manager or owner role to another user
- **THEN** the server responds 403
- **AND** no role change is recorded

#### Scenario: Last owner cannot be deactivated
- **WHEN** a manager or owner attempts to deactivate the last active owner
- **THEN** the server responds 409 with error.code last_owner
- **AND** the account remains active

### Requirement: Login rate limiting
`POST /v1/auth/login` SHALL be rate-limited per IP and per email. Exhausted limits MUST return 429 with the standard error envelope and MUST NOT reveal whether the email exists.

#### Scenario: Too many attempts
- **WHEN** a client exceeds the login attempt limit for an email or IP
- **THEN** the server returns 429
- **AND** no access token is issued

### Requirement: Endpoint capability matrix
Every protected `/v1` operation SHALL document required capabilities in OpenAPI (`x-gympulse-requires`). The Go layer MUST enforce that matrix. A client-supplied role field MUST NOT grant extra access.

#### Scenario: Documented requirement is enforced
- **WHEN** a receptionist calls an endpoint documented as owner, manager
- **THEN** the server responds forbidden
- **AND** no mutation is performed

### Requirement: Audit log
The server SHALL append an audit event for staff mutations (auth, members, memberships, billing, gym settings, check-in corrections). Owner and manager SHALL list events via `GET /v1/audit-events` (cursor paginated, filterable by actor, action, and time). Members MUST NOT read the gym audit log.

#### Scenario: Role change is audited
- **WHEN** a manager replaces a staff user's roles
- **THEN** an audit event exists with actor, action, target, and timestamp
- **AND** a member cannot list audit events

### Requirement: Gym and branch settings API
Authenticated principals SHALL read gym settings. Owner and manager SHALL update gym name, timezone, currency, contact, branding, branches, branch business hours, and gym holidays via `/v1/gym` and `/v1/branches`. Schema columns for these settings MUST exist from the database-migrations baseline (or an additive migration in that change). Receptionists MAY read branches and hours. Members MAY read gym name, timezone, and public branding fields only.

#### Scenario: Manager updates timezone
- **WHEN** a manager PATCHes the gym timezone to a valid IANA name
- **THEN** subsequent "today" calculations for check-in and reports use that zone
- **AND** a receptionist cannot PATCH gym settings
