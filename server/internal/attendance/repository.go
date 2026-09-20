package attendance

import (
	"context"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"time"
)
type Event struct { ID,GymID,BranchID,MemberID uuid.UUID; Method string; CheckedInAt time.Time; VoidedAt *time.Time }
func Record(ctx context.Context, tx pgx.Tx, e Event, idem string) error {
	_,err:=tx.Exec(ctx,`INSERT INTO attendance_events(id,gym_id,branch_id,member_id,method,checked_in_at,idempotency_key) VALUES($1,$2,$3,$4,$5,$6,NULLIF($7,'')) ON CONFLICT (gym_id,idempotency_key) DO NOTHING`,e.ID,e.GymID,e.BranchID,e.MemberID,e.Method,e.CheckedInAt,idem); return err
}
func ListByDay(ctx context.Context, tx pgx.Tx, gymID, branchID uuid.UUID, start, end time.Time) ([]Event,error) {
	rows,err:=tx.Query(ctx,`SELECT id,gym_id,branch_id,member_id,method,checked_in_at,voided_at FROM attendance_events WHERE gym_id=$1 AND ($2::uuid IS NULL OR branch_id=$2) AND checked_in_at >= $3 AND checked_in_at < $4 AND voided_at IS NULL ORDER BY checked_in_at DESC`,gymID,branchID,start,end); if err!=nil{return nil,err}; defer rows.Close()
	var out []Event; for rows.Next(){var e Event;if err:=rows.Scan(&e.ID,&e.GymID,&e.BranchID,&e.MemberID,&e.Method,&e.CheckedInAt,&e.VoidedAt);err!=nil{return nil,err};out=append(out,e)}; return out,rows.Err()
}
