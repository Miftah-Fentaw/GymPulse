package billing

import (
	"context"
	"errors"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"time"
)

type Invoice struct {
	ID, GymID, MemberID uuid.UUID
	MembershipID *uuid.UUID
	Number string
	TotalMinor, PaidMinor int64
	DueAt time.Time
	Status string
}
type Payment struct {
	ID, GymID, InvoiceID, MemberID uuid.UUID
	AmountMinor int64
	Method, Provider, Reference, Note, Status string
	EvidenceFileID *uuid.UUID
	PaidAt time.Time
}

func CreateInvoice(ctx context.Context, tx pgx.Tx, i Invoice) error {
	_, err:=tx.Exec(ctx,`INSERT INTO invoices(id,gym_id,member_id,membership_id,invoice_number,subtotal_minor,total_minor,due_at) VALUES($1,$2,$3,$4,$5,$6,$6,$7)`,i.ID,i.GymID,i.MemberID,i.MembershipID,i.Number,i.TotalMinor,i.DueAt)
	return err
}
func RecordPayment(ctx context.Context, tx pgx.Tx, p Payment, actor *uuid.UUID, idem string) error {
	if p.AmountMinor <= 0 { return errors.New("payment amount must be positive") }
	_,err:=tx.Exec(ctx,`INSERT INTO payments(id,gym_id,invoice_id,member_id,amount_minor,method,provider,reference,note,status,evidence_file_id,paid_at,created_by,idempotency_key) VALUES($1,$2,$3,$4,$5,$6,NULLIF($7,''),NULLIF($8,''),NULLIF($9,''),$10,$11,$12,$13,NULLIF($14,''))`,p.ID,p.GymID,p.InvoiceID,p.MemberID,p.AmountMinor,p.Method,p.Provider,p.Reference,p.Note,p.Status,p.EvidenceFileID,p.PaidAt,actor,idem)
	if err != nil { return err }
	_,err=tx.Exec(ctx,`UPDATE invoices SET paid_minor=paid_minor+$1,status=CASE WHEN paid_minor+$1>=total_minor THEN 'paid' WHEN paid_minor+$1>0 THEN 'partial' ELSE status END WHERE id=$2 AND gym_id=$3 AND status<>'void'`,p.AmountMinor,p.InvoiceID,p.GymID)
	return err
}
func TransitionPayment(ctx context.Context, tx pgx.Tx, gymID, paymentID, actor uuid.UUID, to, reason string) error {
	var from string
	if err:=tx.QueryRow(ctx,`SELECT status FROM payments WHERE id=$1 AND gym_id=$2 FOR UPDATE`,paymentID,gymID).Scan(&from); err!=nil{return err}
	if from==to{return nil}
	if to!="approved" && to!="rejected" { return errors.New("invalid payment transition") }
	if _,err:=tx.Exec(ctx,`UPDATE payments SET status=$1,reviewed_by=$2,reviewed_at=now(),rejection_reason=$3 WHERE id=$4 AND gym_id=$5`,to,actor,reason,paymentID,gymID);err!=nil{return err}
	_,err:=tx.Exec(ctx,`INSERT INTO payment_audit_events(id,payment_id,gym_id,actor_user_id,from_status,to_status,reason) VALUES($1,$2,$3,$4,$5,$6,$7)`,uuid.New(),paymentID,gymID,actor,from,to,reason)
	return err
}
