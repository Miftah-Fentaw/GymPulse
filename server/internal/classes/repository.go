package classes

import (
	"context"
	"errors"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"time"
)
type Session struct { ID,GymID,BranchID,ClassTypeID uuid.UUID; StartsAt,EndsAt time.Time; Capacity int }
func Book(ctx context.Context, tx pgx.Tx, id,gymID,memberID uuid.UUID) error {
	var cap, booked int
	if err:=tx.QueryRow(ctx,`SELECT capacity FROM class_sessions WHERE id=$1 AND gym_id=$2 AND cancelled_at IS NULL FOR UPDATE`,id,gymID).Scan(&cap);err!=nil{return err}
	if err:=tx.QueryRow(ctx,`SELECT count(*) FROM class_bookings WHERE session_id=$1 AND status='booked'`,id).Scan(&booked);err!=nil{return err}
	if booked>=cap{return errors.New("class is full")}
	_,err:=tx.Exec(ctx,`INSERT INTO class_bookings(id,session_id,gym_id,member_id) VALUES($1,$2,$3,$4) ON CONFLICT (session_id,member_id) DO UPDATE SET status='booked'`,uuid.New(),id,gymID,memberID);return err
}
func Cancel(ctx context.Context, tx pgx.Tx, sessionID,memberID uuid.UUID) error {_,err:=tx.Exec(ctx,`UPDATE class_bookings SET status='cancelled' WHERE session_id=$1 AND member_id=$2 AND status='booked'`,sessionID,memberID);return err}
