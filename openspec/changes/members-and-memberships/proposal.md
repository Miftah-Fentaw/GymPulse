## Why

Staff cannot run a gym without member records and membership plans. This slice adds profiles, plans, and freeze/upgrade/cancel/expiry on top of auth.

## What Changes

- Member profiles (linked to a `member` user or a profile row), gym- and branch-scoped.
- Plans and memberships with freeze, upgrade, cancel, and expiry that later check-in/booking will consult.
- Staff APIs for owner/manager/receptionist; members can read their own profile and membership.

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `members`: Profiles, status, gym/branch scope.
- `memberships`: Plans, assign, freeze/upgrade/cancel, expiry.

## Impact

- New migrations after auth
- `server/internal/members/`, `server/internal/memberships/`
- REST under `/v1/members`, `/v1/plans`, `/v1/memberships`
