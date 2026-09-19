## MODIFIED Requirements

### Requirement: Password login
The server SHALL authenticate users with an email (or username) and password stored by GymPulse. Credentials MUST be verified by the Go server. The system MUST NOT use Supabase Auth or any external identity provider for these logins.

#### Scenario: Valid credentials
- **WHEN** a user submits a correct email and password
- **THEN** the server returns a short-lived access token and a refresh token
- **AND** the response includes the user's id, gym_id, role, and display name

#### Scenario: Invalid credentials
- **WHEN** a user submits an unknown email or a wrong password
- **THEN** the server rejects the login with a generic authentication error
- **AND** the response MUST NOT reveal whether the email exists

### Requirement: Access and refresh tokens
The server SHALL issue a short-lived JWT access token and a longer-lived refresh token. Access tokens MUST be sent as `Authorization: Bearer`. Refresh MUST work via `POST /v1/auth/refresh` with either an httpOnly Secure cookie or a JSON body token so both the admin dashboard and the PWA can refresh.

#### Scenario: Refresh with a valid token
- **WHEN** a client calls refresh with a valid, unexpired, unrevoked refresh token
- **THEN** the server returns a new access token
- **AND** the previous refresh token is rotated and cannot be reused

#### Scenario: Refresh with a revoked or expired token
- **WHEN** a client calls refresh with an expired, reused, or revoked refresh token
- **THEN** the server rejects the request
- **AND** the client MUST sign in again

### Requirement: Roles
Every user account SHALL have exactly one role in the MVP: `owner`, `manager`, `receptionist`, `trainer`, or `member`. Authorization MUST be enforced in the Go layer on every protected route. The database MUST NOT be relied on (including RLS) to authorize API access.

#### Scenario: Role is present on the principal
- **WHEN** a valid access token is presented
- **THEN** the server loads the user's role from server-side data (token claims and/or database)
- **AND** handlers authorize using that role, not a client-supplied role field

#### Scenario: Insufficient role
- **WHEN** an authenticated user calls an endpoint their role is not allowed to use
- **THEN** the server responds with a forbidden error
- **AND** no mutation is performed

### Requirement: Logout and session revocation
The server SHALL allow a user to log out, which revokes the current refresh token. The server SHALL allow an owner or manager to revoke a user's sessions.

#### Scenario: User logs out
- **WHEN** an authenticated user logs out
- **THEN** their current refresh token is revoked
- **AND** a later refresh attempt with that token fails

## ADDED Requirements

### Requirement: Password hashing
Passwords SHALL be stored with a modern password hash (argon2id or bcrypt). The API MUST never return a password hash.

#### Scenario: Hash at rest
- **WHEN** a user account is created with a password
- **THEN** the database stores a hash, not the plaintext
- **AND** GET/list user payloads omit the hash

### Requirement: Bootstrap owner
A fresh deployment SHALL be able to create the first owner (documented env bootstrap or a one-time setup endpoint guarded so it only works when no owner exists).

#### Scenario: First owner
- **WHEN** the gym has no owner and the documented bootstrap is used
- **THEN** an owner user exists for that gym
- **AND** repeating the bootstrap after an owner exists is rejected
