## Why

Staff cannot run a gym without member records, plans, and a place to catch trial requests from the public site. This slice adds profiles (including attaching a profile to existing staff), memberships, and leads.

## What Changes

- Member profiles linked to user accounts; gym- and branch-scoped; optional profile photo via storage.
- Plans and memberships with freeze/upgrade/cancel/expiry and `MembershipGrantsAccess`.
- Leads: public POST (used later by landing), staff list/convert.
- Staff APIs for owner/manager/receptionist; members read their own profile and membership.

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `members`: Profiles, status, gym/branch scope, attach to existing staff users.
- `memberships`: Plans, assign, freeze/upgrade/cancel, expiry.
- `leads`: Capture trial/contact, staff manage/convert.
- `storage`: Member profile photos.

## Impact

- Migrations after auth/storage
- `server/internal/members/`, `memberships/`, `leads/`
- REST under `/v1/members`, `/v1/plans`, `/v1/memberships`, `/v1/leads`, public lead POST
