-- +goose Up
-- Baseline gym and branch tables. UUID primary keys have no database default;
-- the Go application supplies UUIDv7. All timestamps are timestamptz.

CREATE TABLE gyms (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    timezone TEXT NOT NULL,
    currency CHAR(3) NOT NULL,
    phone TEXT,
    email TEXT,
    address TEXT,
    logo_file_id UUID,
    primary_color TEXT,
    public_tagline TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE branches (
    id UUID PRIMARY KEY,
    gym_id UUID NOT NULL REFERENCES gyms (id),
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    archived_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX branches_gym_id_idx ON branches (gym_id);

-- weekday: ISO 8601 (1 = Monday ... 7 = Sunday). Times are gym-local wall clock.
CREATE TABLE branch_hours (
    id UUID PRIMARY KEY,
    branch_id UUID NOT NULL REFERENCES branches (id) ON DELETE CASCADE,
    weekday SMALLINT NOT NULL CHECK (weekday BETWEEN 1 AND 7),
    opens_at TIME NOT NULL,
    closes_at TIME NOT NULL,
    UNIQUE (branch_id, weekday)
);

CREATE TABLE gym_holidays (
    id UUID PRIMARY KEY,
    gym_id UUID NOT NULL REFERENCES gyms (id) ON DELETE CASCADE,
    date DATE NOT NULL,
    name TEXT NOT NULL,
    UNIQUE (gym_id, date)
);

-- +goose Down
DROP TABLE IF EXISTS gym_holidays;
DROP TABLE IF EXISTS branch_hours;
DROP TABLE IF EXISTS branches;
DROP TABLE IF EXISTS gyms;
