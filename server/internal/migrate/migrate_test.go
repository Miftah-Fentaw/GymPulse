package migrate_test

import (
	"context"
	"errors"
	"io/fs"
	"strings"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgconn"

	"gympulse-server/internal/migrate"
	"gympulse-server/internal/testutil"
	"gympulse-server/migrations"
)

func TestEmbedIncludesSQL(t *testing.T) {
	var found bool
	err := fs.WalkDir(migrations.FS, ".", func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if !d.IsDir() && strings.HasSuffix(path, ".sql") {
			found = true
		}
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
	if !found {
		t.Fatal("expected embedded .sql migration")
	}
}

func TestInitSchema(t *testing.T) {
	pool := testutil.Pool(t)
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	var gympulseSchema int
	if err := pool.QueryRow(ctx, `SELECT count(*) FROM pg_namespace WHERE nspname = 'gympulse'`).Scan(&gympulseSchema); err != nil {
		t.Fatal(err)
	}
	if gympulseSchema != 0 {
		t.Fatal("must not create a gympulse schema")
	}

	var versionTable string
	if err := pool.QueryRow(ctx, `SELECT to_regclass('public.goose_db_version')::text`).Scan(&versionTable); err != nil {
		t.Fatal(err)
	}
	if versionTable != "goose_db_version" {
		t.Fatalf("goose version table: %q", versionTable)
	}

	gymID, err := uuid.NewV7()
	if err != nil {
		t.Fatal(err)
	}
	_, err = pool.Exec(ctx, `
		INSERT INTO gyms (id, name, timezone, currency, primary_color, public_tagline)
		VALUES ($1, $2, $3, $4, $5, $6)`,
		gymID, "Pulse", "Africa/Nairobi", "KES", "#111111", "Train here")
	if err != nil {
		t.Fatalf("insert gym: %v", err)
	}

	_, err = pool.Exec(ctx, `
		INSERT INTO gyms (name, timezone, currency)
		VALUES ($1, $2, $3)`, "NoID", "UTC", "USD")
	if err == nil {
		t.Fatal("insert without id must fail")
	}
	var pgErr *pgconn.PgError
	if !errors.As(err, &pgErr) || pgErr.Code != "23502" {
		t.Fatalf("expected not_null_violation, got %v", err)
	}

	branchID, err := uuid.NewV7()
	if err != nil {
		t.Fatal(err)
	}
	_, err = pool.Exec(ctx, `
		INSERT INTO branches (id, gym_id, name)
		VALUES ($1, $2, $3)`, branchID, gymID, "Main")
	if err != nil {
		t.Fatalf("insert branch: %v", err)
	}

	hoursID, err := uuid.NewV7()
	if err != nil {
		t.Fatal(err)
	}
	_, err = pool.Exec(ctx, `
		INSERT INTO branch_hours (id, branch_id, weekday, opens_at, closes_at)
		VALUES ($1, $2, 1, TIME '06:00', TIME '22:00')`, hoursID, branchID)
	if err != nil {
		t.Fatalf("insert hours: %v", err)
	}

	holidayID, err := uuid.NewV7()
	if err != nil {
		t.Fatal(err)
	}
	_, err = pool.Exec(ctx, `
		INSERT INTO gym_holidays (id, gym_id, date, name)
		VALUES ($1, $2, DATE '2026-12-25', $3)`, holidayID, gymID, "Christmas")
	if err != nil {
		t.Fatalf("insert holiday: %v", err)
	}
}

func TestMigrateDown(t *testing.T) {
	pool := testutil.Pool(t)
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	if err := migrate.Down(ctx, pool.Config().ConnString()); err != nil {
		t.Fatalf("down: %v", err)
	}

	var gyms *string
	if err := pool.QueryRow(ctx, `SELECT to_regclass('public.gyms')::text`).Scan(&gyms); err != nil {
		t.Fatal(err)
	}
	if gyms != nil {
		t.Fatalf("gyms still present after down: %q", *gyms)
	}
}
