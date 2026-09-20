-- +goose Up
CREATE TABLE files (
    id UUID PRIMARY KEY,
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    object_key TEXT NOT NULL,
    content_type TEXT NOT NULL,
    size_bytes BIGINT NOT NULL CHECK (size_bytes >= 0),
    sha256 TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (gym_id, object_key)
);
CREATE TABLE attendance_events (
    id UUID PRIMARY KEY,
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    method TEXT NOT NULL CHECK (method IN ('qr','staff','code_fallback')),
    checked_in_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    voided_at TIMESTAMPTZ,
    voided_by UUID REFERENCES users(id),
    idempotency_key TEXT,
    UNIQUE (gym_id, idempotency_key)
);
CREATE INDEX attendance_member_time_idx ON attendance_events(member_id, checked_in_at DESC);
CREATE TABLE invoices (
    id UUID PRIMARY KEY,
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    membership_id UUID REFERENCES memberships(id),
    invoice_number TEXT NOT NULL,
    subtotal_minor BIGINT NOT NULL CHECK (subtotal_minor >= 0),
    total_minor BIGINT NOT NULL CHECK (total_minor >= 0),
    paid_minor BIGINT NOT NULL DEFAULT 0 CHECK (paid_minor >= 0),
    due_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid','partial','paid','void')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (gym_id, invoice_number)
);
CREATE TABLE invoice_lines (
    id UUID PRIMARY KEY,
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price_minor BIGINT NOT NULL CHECK (unit_price_minor >= 0),
    discount_minor BIGINT NOT NULL DEFAULT 0 CHECK (discount_minor >= 0)
);
CREATE TABLE payments (
    id UUID PRIMARY KEY,
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    invoice_id UUID NOT NULL REFERENCES invoices(id),
    member_id UUID NOT NULL REFERENCES members(id),
    amount_minor BIGINT NOT NULL CHECK (amount_minor > 0),
    method TEXT NOT NULL CHECK (method IN ('cash','bank','mobile_money','card','gateway')),
    provider TEXT,
    reference TEXT,
    note TEXT,
    paid_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending','approved','rejected','refunded')),
    evidence_file_id UUID REFERENCES files(id),
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    idempotency_key TEXT,
    created_by UUID REFERENCES users(id),
    UNIQUE (gym_id, idempotency_key)
);
CREATE TABLE payment_audit_events (
    id UUID PRIMARY KEY,
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    actor_user_id UUID REFERENCES users(id),
    from_status TEXT,
    to_status TEXT NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE trainer_assignments (
    id UUID PRIMARY KEY,
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    trainer_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ended_at TIMESTAMPTZ,
    UNIQUE (trainer_user_id, member_id)
);
CREATE TABLE class_types (
    id UUID PRIMARY KEY, gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    name TEXT NOT NULL, description TEXT, capacity INTEGER NOT NULL CHECK (capacity > 0),
    UNIQUE (gym_id, name)
);
CREATE TABLE class_sessions (
    id UUID PRIMARY KEY, gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id), class_type_id UUID NOT NULL REFERENCES class_types(id),
    trainer_user_id UUID REFERENCES users(id), starts_at TIMESTAMPTZ NOT NULL, ends_at TIMESTAMPTZ NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0), cancelled_at TIMESTAMPTZ, CHECK (ends_at > starts_at)
);
CREATE TABLE class_bookings (
    id UUID PRIMARY KEY, session_id UUID NOT NULL REFERENCES class_sessions(id) ON DELETE CASCADE,
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE, member_id UUID NOT NULL REFERENCES members(id),
    status TEXT NOT NULL DEFAULT 'booked' CHECK (status IN ('booked','cancelled','waitlisted')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(), UNIQUE (session_id, member_id)
);
CREATE TABLE workout_logs (
    id UUID PRIMARY KEY, gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    author_user_id UUID REFERENCES users(id), performed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    title TEXT NOT NULL, notes TEXT, metrics JSONB NOT NULL DEFAULT '{}'::jsonb
);
CREATE TABLE progress_measurements (
    id UUID PRIMARY KEY, gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    measured_at TIMESTAMPTZ NOT NULL DEFAULT now(), kind TEXT NOT NULL, value NUMERIC NOT NULL, unit TEXT NOT NULL
);
-- +goose Down
DROP TABLE IF EXISTS progress_measurements;
DROP TABLE IF EXISTS workout_logs;
DROP TABLE IF EXISTS class_bookings;
DROP TABLE IF EXISTS class_sessions;
DROP TABLE IF EXISTS class_types;
DROP TABLE IF EXISTS trainer_assignments;
DROP TABLE IF EXISTS payment_audit_events;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS invoice_lines;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS attendance_events;
DROP TABLE IF EXISTS files;
