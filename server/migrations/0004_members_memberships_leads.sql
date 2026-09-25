-- +goose Up
CREATE TABLE members (
    id UUID PRIMARY KEY,
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    member_code TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','archived')),
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    photo_file_id UUID,
    archived_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (gym_id, member_code),
    UNIQUE (gym_id, user_id)
);
CREATE INDEX members_gym_status_idx ON members(gym_id, status);

CREATE TABLE membership_plans (
    id UUID PRIMARY KEY,
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price_minor BIGINT NOT NULL DEFAULT 0 CHECK (price_minor >= 0),
    currency CHAR(3) NOT NULL,
    period_unit TEXT NOT NULL CHECK (period_unit IN ('day','week','month','year')),
    period_count INTEGER NOT NULL CHECK (period_count > 0),
    archived_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (gym_id, name)
);
CREATE INDEX membership_plans_gym_idx ON membership_plans(gym_id) WHERE archived_at IS NULL;

CREATE TABLE memberships (
    id UUID PRIMARY KEY,
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES membership_plans(id),
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','frozen','cancelled','expired')),
    freeze_starts_at TIMESTAMPTZ,
    freeze_ends_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancelled_reason TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (ends_at > starts_at),
    CHECK ((freeze_starts_at IS NULL AND freeze_ends_at IS NULL) OR (freeze_ends_at IS NOT NULL AND freeze_starts_at IS NOT NULL AND freeze_ends_at > freeze_starts_at))
);
CREATE INDEX memberships_member_idx ON memberships(gym_id, member_id, starts_at DESC);
CREATE INDEX memberships_expiry_idx ON memberships(gym_id, ends_at) WHERE status IN ('active','frozen');
CREATE UNIQUE INDEX memberships_one_access_idx ON memberships(member_id) WHERE status = 'active' AND cancelled_at IS NULL;

CREATE TABLE membership_events (
    id UUID PRIMARY KEY,
    membership_id UUID NOT NULL REFERENCES memberships(id) ON DELETE CASCADE,
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    actor_user_id UUID REFERENCES users(id),
    event_type TEXT NOT NULL CHECK (event_type IN ('assigned','frozen','resumed','upgraded','cancelled','renewed')),
    reason TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX membership_events_membership_idx ON membership_events(membership_id, created_at DESC);

CREATE TABLE leads (
    id UUID PRIMARY KEY,
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    message TEXT,
    source TEXT NOT NULL DEFAULT 'public',
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','contacted','dismissed','converted')),
    converted_member_id UUID REFERENCES members(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX leads_gym_status_idx ON leads(gym_id, status, created_at DESC);
CREATE INDEX leads_contact_idx ON leads(gym_id, lower(email), phone) WHERE status IN ('open','contacted');

CREATE TABLE lead_notes (
    id UUID PRIMARY KEY,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    author_user_id UUID NOT NULL REFERENCES users(id),
    note TEXT NOT NULL CHECK (length(note) BETWEEN 1 AND 5000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX lead_notes_lead_idx ON lead_notes(lead_id, created_at DESC);

-- +goose Down
DROP TABLE IF EXISTS lead_notes;
DROP TABLE IF EXISTS leads;
DROP TABLE IF EXISTS membership_events;
DROP TABLE IF EXISTS memberships;
DROP TABLE IF EXISTS membership_plans;
DROP TABLE IF EXISTS members;gympulse
