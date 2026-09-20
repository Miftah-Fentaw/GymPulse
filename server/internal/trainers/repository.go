package trainers
import ("context"; "github.com/google/uuid"; "github.com/jackc/pgx/v5")
func Assign(ctx context.Context, tx pgx.Tx, id,gymID,trainer,member,actor uuid.UUID) error {_,err:=tx.Exec(ctx,`INSERT INTO trainer_assignments(id,gym_id,trainer_user_id,member_id,assigned_by) SELECT $1,$2,$3,$4,$5 WHERE EXISTS(SELECT 1 FROM users WHERE id=$3 AND gym_id=$2) AND EXISTS(SELECT 1 FROM members WHERE id=$4 AND gym_id=$2) ON CONFLICT (trainer_user_id,member_id) DO UPDATE SET ended_at=NULL`,id,gymID,trainer,member,actor);return err}
func Unassign(ctx context.Context, tx pgx.Tx, gymID,trainer,member uuid.UUID) error {_,err:=tx.Exec(ctx,`UPDATE trainer_assignments SET ended_at=now() WHERE gym_id=$1 AND trainer_user_id=$2 AND member_id=$3 AND ended_at IS NULL`,gymID,trainer,member);return err}
