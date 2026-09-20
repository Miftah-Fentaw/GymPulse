package memberships

import (
	"context"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"time"
)

type Member struct {
	ID, GymID, BranchID, UserID uuid.UUID
	Code, Status, EmergencyName, EmergencyPhone string
	PhotoFileID *uuid.UUID
	CreatedAt time.Time
}

func CreateMember(ctx context.Context, tx pgx.Tx, m Member) error {
	_, err := tx.Exec(ctx, `INSERT INTO members(id,gym_id,branch_id,user_id,member_code,status,emergency_contact_name,emergency_contact_phone,photo_file_id) VALUES($1,$2,$3,$4,$5,'active',NULLIF($6,''),NULLIF($7,''),$8)`, m.ID,m.GymID,m.BranchID,m.UserID,m.Code,m.EmergencyName,m.EmergencyPhone,m.PhotoFileID)
	return err
}
func GetMember(ctx context.Context, tx pgx.Tx, gymID, id uuid.UUID) (Member,error) {
	var m Member
	err:=tx.QueryRow(ctx,`SELECT id,gym_id,branch_id,user_id,member_code,status,COALESCE(emergency_contact_name,''),COALESCE(emergency_contact_phone,''),photo_file_id,created_at FROM members WHERE gym_id=$1 AND id=$2`,gymID,id).Scan(&m.ID,&m.GymID,&m.BranchID,&m.UserID,&m.Code,&m.Status,&m.EmergencyName,&m.EmergencyPhone,&m.PhotoFileID,&m.CreatedAt)
	return m,err
}
func ArchiveMember(ctx context.Context, tx pgx.Tx, gymID,id uuid.UUID) error { _,err:=tx.Exec(ctx,`UPDATE members SET status='archived',archived_at=now(),updated_at=now() WHERE gym_id=$1 AND id=$2`,gymID,id);return err }
func RestoreMember(ctx context.Context, tx pgx.Tx, gymID,id uuid.UUID) error { _,err:=tx.Exec(ctx,`UPDATE members SET status='active',archived_at=NULL,updated_at=now() WHERE gym_id=$1 AND id=$2`,gymID,id);return err }

type Plan struct {
	ID, GymID                               uuid.UUID
	Name, Description, Currency, PeriodUnit string
	PriceMinor                              int64
	PeriodCount                             int
	ArchivedAt                              *time.Time
}

func CreatePlan(ctx context.Context, tx pgx.Tx, p Plan) error {
	_, err := tx.Exec(ctx, `INSERT INTO membership_plans(id,gym_id,name,description,price_minor,currency,period_unit,period_count) VALUES($1,$2,$3,$4,$5,$6,$7,$8)`, p.ID, p.GymID, p.Name, p.Description, p.PriceMinor, p.Currency, p.PeriodUnit, p.PeriodCount)
	return err
}
func GetPlan(ctx context.Context, tx pgx.Tx, gymID, id uuid.UUID) (Plan, error) {
	var p Plan
	err := tx.QueryRow(ctx, `SELECT id,gym_id,name,COALESCE(description,''),price_minor,currency,period_unit,period_count,archived_at FROM membership_plans WHERE id=$1 AND gym_id=$2`, id, gymID).Scan(&p.ID, &p.GymID, &p.Name, &p.Description, &p.PriceMinor, &p.Currency, &p.PeriodUnit, &p.PeriodCount, &p.ArchivedAt)
	return p, err
}
func ArchivePlan(ctx context.Context, tx pgx.Tx, gymID, id uuid.UUID) error {
	_, err := tx.Exec(ctx, `UPDATE membership_plans SET archived_at=now(),updated_at=now() WHERE id=$1 AND gym_id=$2`, id, gymID)
	return err
}
