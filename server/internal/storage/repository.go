package storage

import (
	"context"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"time"
)

type File struct { ID, GymID uuid.UUID; Key, ContentType string; Size int64; SHA256 *string; CreatedAt time.Time }
func CreateFile(ctx context.Context, tx pgx.Tx, f File, actor *uuid.UUID) error {
	_, err := tx.Exec(ctx, `INSERT INTO files(id,gym_id,object_key,content_type,size_bytes,sha256,created_by) VALUES($1,$2,$3,$4,$5,$6,$7)`, f.ID,f.GymID,f.Key,f.ContentType,f.Size,f.SHA256,actor)
	return err
}
func GetFile(ctx context.Context, tx pgx.Tx, gymID, id uuid.UUID) (File,error) {
	var f File; err:=tx.QueryRow(ctx,`SELECT id,gym_id,object_key,content_type,size_bytes,sha256,created_at FROM files WHERE gym_id=$1 AND id=$2`,gymID,id).Scan(&f.ID,&f.GymID,&f.Key,&f.ContentType,&f.Size,&f.SHA256,&f.CreatedAt); return f,err
}
