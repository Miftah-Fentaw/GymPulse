-- +goose Up
CREATE TABLE payment_refunds (
    id UUID PRIMARY KEY,
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    amount_minor BIGINT NOT NULL CHECK (amount_minor > 0),
    reason TEXT,
    idempotency_key TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (gym_id, idempotency_key)
);
CREATE TABLE invoice_adjustments (
    id UUID PRIMARY KEY,
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    kind TEXT NOT NULL CHECK (kind IN ('discount')),
    amount_minor BIGINT NOT NULL CHECK (amount_minor > 0),
    reason TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE trainer_availability (
    id UUID PRIMARY KEY,
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    trainer_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id),
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    UNIQUE (trainer_user_id, starts_at, ends_at)
);
CREATE TABLE workout_attachments (
    workout_id UUID NOT NULL REFERENCES workout_logs(id) ON DELETE CASCADE,
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    PRIMARY KEY (workout_id, file_id)
);
-- +goose Down
DROP TABLE IF EXISTS workout_attachments;
DROP TABLE IF EXISTS trainer_availability;
DROP TABLE IF EXISTS invoice_adjustments;
DROP TABLE IF EXISTS payment_refunds;
