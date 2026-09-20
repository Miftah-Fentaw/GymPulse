package reporting

import (
	"context"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"time"
)
type Summary struct { ActiveMembers int64; RevenueMinor int64; Attendance int64; Churned int64 }
func SummaryFor(ctx context.Context, tx pgx.Tx, gymID uuid.UUID, branchID *uuid.UUID, from,to time.Time)(Summary,error){
	var s Summary
	err:=tx.QueryRow(ctx,`SELECT
		(SELECT count(*) FROM members WHERE gym_id=$1 AND status='active' AND ($2::uuid IS NULL OR branch_id=$2)),
		COALESCE((SELECT sum(amount_minor) FROM payments WHERE gym_id=$1 AND status='approved' AND paid_at >= $3 AND paid_at < $4),0),
		(SELECT count(*) FROM attendance_events WHERE gym_id=$1 AND voided_at IS NULL AND checked_in_at >= $3 AND checked_in_at < $4 AND ($2::uuid IS NULL OR branch_id=$2)),
		(SELECT count(*) FROM memberships WHERE gym_id=$1 AND status='cancelled' AND updated_at >= $3 AND updated_at < $4)`,gymID,branchID,from,to).Scan(&s.ActiveMembers,&s.RevenueMinor,&s.Attendance,&s.Churned)
	return s,err
}
