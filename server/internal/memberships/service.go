package memberships

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var ErrNoAccess = errors.New("membership does not grant access")

// MembershipGrantsAccess reports whether a member has a current, non-cancelled,
// non-frozen membership. It is intentionally scoped by gym through the member row.
func MembershipGrantsAccess(ctx context.Context, pool *pgxpool.Pool, memberID uuid.UUID, at time.Time) (bool, error) {
	if pool == nil {
		return false, errors.New("database unavailable")
	}
	var ok bool
	err := pool.QueryRow(ctx, `SELECT EXISTS (
        SELECT 1 FROM memberships m
        JOIN members mem ON mem.id=m.member_id AND mem.gym_id=m.gym_id
        WHERE m.member_id=$1 AND m.status='active' AND m.starts_at <= $2 AND m.ends_at > $2
          AND (m.cancelled_at IS NULL OR m.cancelled_at > $2)
          AND (m.freeze_starts_at IS NULL OR NOT (m.freeze_starts_at <= $2 AND m.freeze_ends_at > $2))
    )`, memberID, at).Scan(&ok)
	return ok, err
}

// Assign creates a membership while locking the member and rejecting another
// access-granting membership. The caller supplies a transaction for atomicity.
func Assign(ctx context.Context, tx pgx.Tx, id, gymID, memberID, planID, actor uuid.UUID, starts, ends time.Time) error {
	if !ends.After(starts) {
		return errors.New("membership end must be after start")
	}
	var exists bool
	if err := tx.QueryRow(ctx, `SELECT EXISTS (SELECT 1 FROM memberships WHERE member_id=$1 AND status='active' AND cancelled_at IS NULL FOR UPDATE)`, memberID).Scan(&exists); err != nil {
		return err
	}
	if exists {
		return errors.New("member already has an active membership")
	}
	_, err := tx.Exec(ctx, `INSERT INTO memberships (id,gym_id,member_id,plan_id,starts_at,ends_at,created_by) VALUES ($1,$2,$3,$4,$5,$6,$7)`, id, gymID, memberID, planID, starts, ends, actor)
	return err
}
