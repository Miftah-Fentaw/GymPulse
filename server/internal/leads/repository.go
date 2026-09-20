package leads

import (
	"context"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"time"
)

type Lead struct {
	ID, GymID                                   uuid.UUID
	Name, Email, Phone, Message, Source, Status string
	ConvertedMemberID                           *uuid.UUID
	CreatedAt, UpdatedAt                        time.Time
}

func Create(ctx context.Context, tx pgx.Tx, l Lead) error {
	_, err := tx.Exec(ctx, `INSERT INTO leads(id,gym_id,name,email,phone,message,source) VALUES($1,$2,$3,NULLIF($4,''),NULLIF($5,''),$6,$7)`, l.ID, l.GymID, l.Name, l.Email, l.Phone, l.Message, l.Source)
	return err
}

func FindOpenDuplicate(ctx context.Context, tx pgx.Tx, gymID uuid.UUID, email, phone string, since time.Time) (*Lead, error) {
	var l Lead
	err := tx.QueryRow(ctx, `SELECT id,gym_id,name,COALESCE(email,''),COALESCE(phone,''),COALESCE(message,''),source,status,converted_member_id,created_at,updated_at
		FROM leads WHERE gym_id=$1 AND status IN ('open','contacted') AND created_at >= $4
		AND (($2<>'' AND lower(email)=lower($2)) OR ($3<>'' AND phone=$3)) ORDER BY created_at DESC LIMIT 1`, gymID,email,phone,since).
		Scan(&l.ID,&l.GymID,&l.Name,&l.Email,&l.Phone,&l.Message,&l.Source,&l.Status,&l.ConvertedMemberID,&l.CreatedAt,&l.UpdatedAt)
	if err != nil { return nil, err }
	return &l,nil
}
func UpdateStatus(ctx context.Context, tx pgx.Tx, gymID, id uuid.UUID, status string) error {
	_, err := tx.Exec(ctx, `UPDATE leads SET status=$1,updated_at=now() WHERE id=$2 AND gym_id=$3`, status, id, gymID)
	return err
}
func AddNote(ctx context.Context, tx pgx.Tx, id, gymID, author uuid.UUID, note string) (uuid.UUID, error) {
	nid := uuid.New()
	_, err := tx.Exec(ctx, `INSERT INTO lead_notes(id,lead_id,gym_id,author_user_id,note) VALUES($1,$2,$3,$4,$5)`, nid, id, gymID, author, note)
	return nid, err
}
