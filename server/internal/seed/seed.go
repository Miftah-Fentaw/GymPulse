package seed

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/argon2"
)

const DefaultPassword = "GymPulse1!"

type Account struct {
	Email string
	Name  string
	Role  string // staff role, empty for member-only
	Member bool
}

// Accounts is the canonical local demo set (documented in users.md).
var Accounts = []Account{
	{Email: "owner@gympulse.local", Name: "Owner Demo", Role: "owner"},
	{Email: "manager@gympulse.local", Name: "Manager Demo", Role: "manager"},
	{Email: "receptionist@gympulse.local", Name: "Receptionist Demo", Role: "receptionist"},
	{Email: "trainer@gympulse.local", Name: "Trainer Demo", Role: "trainer"},
	{Email: "member@gympulse.local", Name: "Member Demo", Member: true},
}

func hashPassword(password string) string {
	salt := make([]byte, 16)
	_, _ = rand.Read(salt)
	key := argon2.IDKey([]byte(password), salt, 1, 64*1024, 4, 32)
	return fmt.Sprintf("$argon2id$v=19$m=65536,t=1,p=4$%s$%s",
		base64.RawStdEncoding.EncodeToString(salt), base64.RawStdEncoding.EncodeToString(key))
}

func newID() uuid.UUID {
	id, err := uuid.NewV7()
	if err != nil {
		return uuid.New()
	}
	return id
}

// Run upserts the demo gym/branch and all five account types. Idempotent by email.
func Run(ctx context.Context, pool *pgxpool.Pool) error {
	gymID, branchID, err := ensureGym(ctx, pool)
	if err != nil {
		return err
	}

	for _, acc := range Accounts {
		if err := upsertAccount(ctx, pool, gymID, branchID, acc); err != nil {
			return fmt.Errorf("%s: %w", acc.Email, err)
		}
	}
	if err := seedDemoContent(ctx, pool, gymID, branchID); err != nil {
		return fmt.Errorf("demo content: %w", err)
	}
	return nil
}

func ensureGym(ctx context.Context, pool *pgxpool.Pool) (uuid.UUID, uuid.UUID, error) {
	var gymID uuid.UUID
	err := pool.QueryRow(ctx, `SELECT id FROM gyms ORDER BY created_at ASC LIMIT 1`).Scan(&gymID)
	if err != nil {
		gymID = newID()
		if _, err := pool.Exec(ctx,
			`INSERT INTO gyms(id,name,timezone,currency,email,phone,public_tagline)
			 VALUES($1,'GymPulse Demo','UTC','USD','hello@gympulse.local','+15550102090','Stay fit & healthy')`,
			gymID,
		); err != nil {
			return uuid.Nil, uuid.Nil, fmt.Errorf("insert gym: %w", err)
		}
	}

	var branchID uuid.UUID
	err = pool.QueryRow(ctx, `SELECT id FROM branches WHERE gym_id=$1 ORDER BY created_at ASC LIMIT 1`, gymID).Scan(&branchID)
	if err != nil {
		branchID = newID()
		if _, err := pool.Exec(ctx,
			`INSERT INTO branches(id,gym_id,name,address,phone) VALUES($1,$2,'Downtown','120 Fitness Ave','+15550102090')`,
			branchID, gymID,
		); err != nil {
			return uuid.Nil, uuid.Nil, fmt.Errorf("insert branch: %w", err)
		}
	}
	return gymID, branchID, nil
}

func upsertAccount(ctx context.Context, pool *pgxpool.Pool, gymID, branchID uuid.UUID, acc Account) error {
	hash := hashPassword(DefaultPassword)
	var userID uuid.UUID
	err := pool.QueryRow(ctx, `SELECT id FROM users WHERE gym_id=$1 AND lower(email)=lower($2)`, gymID, acc.Email).Scan(&userID)
	if err != nil {
		userID = newID()
		if _, err := pool.Exec(ctx,
			`INSERT INTO users(id,gym_id,email,password_hash,name) VALUES($1,$2,$3,$4,$5)`,
			userID, gymID, acc.Email, hash, acc.Name,
		); err != nil {
			return fmt.Errorf("insert user: %w", err)
		}
	} else {
		if _, err := pool.Exec(ctx,
			`UPDATE users SET password_hash=$1, name=$2, deactivated_at=NULL, updated_at=now() WHERE id=$3`,
			hash, acc.Name, userID,
		); err != nil {
			return fmt.Errorf("update user: %w", err)
		}
	}

	if acc.Role != "" {
		if _, err := pool.Exec(ctx,
			`INSERT INTO user_staff_roles(user_id,role) VALUES($1,$2) ON CONFLICT DO NOTHING`,
			userID, acc.Role,
		); err != nil {
			return fmt.Errorf("assign role: %w", err)
		}
	}

	if acc.Member {
		var exists bool
		if err := pool.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM members WHERE user_id=$1)`, userID).Scan(&exists); err != nil {
			return err
		}
		if !exists {
			memberID := newID()
			code := fmt.Sprintf("M-%s", userID.String()[:8])
			if _, err := pool.Exec(ctx,
				`INSERT INTO members(id,gym_id,branch_id,user_id,member_code,status)
				 VALUES($1,$2,$3,$4,$5,'active')`,
				memberID, gymID, branchID, userID, code,
			); err != nil {
				return fmt.Errorf("insert member: %w", err)
			}
		}
	}
	return nil
}
