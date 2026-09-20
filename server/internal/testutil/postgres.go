package testutil

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"os"
	"strings"
	"testing"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"gympulse-server/internal/db"
	"gympulse-server/internal/migrate"
)

const missingTestURL = "TEST_DATABASE_URL is not set. Example: postgres://gympulse:gympulse@localhost:5432/postgres?sslmode=disable (the role must have CREATEDB)."

// Pool creates a uniquely named gympulse_test_* database, applies embedded
// migrations, and returns a pool. The database is dropped on test cleanup.
// Leftover gympulse_test_* databases with no connections are dropped first.
func Pool(t *testing.T) *pgxpool.Pool {
	t.Helper()
	adminURL := strings.TrimSpace(os.Getenv("TEST_DATABASE_URL"))
	if adminURL == "" {
		t.Fatal(missingTestURL)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	t.Cleanup(cancel)

	admin, err := pgx.Connect(ctx, adminURL)
	if err != nil {
		t.Fatalf("connect TEST_DATABASE_URL: %v", err)
	}

	dropIdleLeftovers(ctx, t, admin)

	name := "gympulse_test_" + randomHex(8)
	ident := db.QuoteIdent(name)
	if _, err := admin.Exec(ctx, "CREATE DATABASE "+ident); err != nil {
		_ = admin.Close(ctx)
		t.Fatalf("CREATE DATABASE %s (need CREATEDB on the TEST_DATABASE_URL role): %v", name, err)
	}
	if err := admin.Close(ctx); err != nil {
		t.Logf("close admin: %v", err)
	}

	testURL := rewriteDBName(adminURL, name)
	if err := migrate.Up(ctx, testURL); err != nil {
		dropDB(adminURL, name)
		t.Fatalf("migrate test database: %v", err)
	}

	pool, err := db.NewPool(ctx, testURL)
	if err != nil {
		dropDB(adminURL, name)
		t.Fatalf("open test pool: %v", err)
	}

	t.Cleanup(func() {
		pool.Close()
		dropDB(adminURL, name)
	})
	return pool
}

func dropIdleLeftovers(ctx context.Context, t *testing.T, admin *pgx.Conn) {
	t.Helper()
	rows, err := admin.Query(ctx, `
		SELECT d.datname
		FROM pg_database d
		WHERE d.datname LIKE 'gympulse_test_%'
		  AND NOT EXISTS (
		    SELECT 1 FROM pg_stat_activity a WHERE a.datname = d.datname
		  )`)
	if err != nil {
		t.Fatalf("list leftover test databases: %v", err)
	}
	defer rows.Close()
	var names []string
	for rows.Next() {
		var n string
		if err := rows.Scan(&n); err != nil {
			t.Fatal(err)
		}
		if db.ValidTestDBName(n) {
			names = append(names, n)
		}
	}
	if err := rows.Err(); err != nil {
		t.Fatal(err)
	}
	for _, n := range names {
		if _, err := admin.Exec(ctx, "DROP DATABASE IF EXISTS "+db.QuoteIdent(n)+" WITH (FORCE)"); err != nil {
			t.Logf("drop leftover %s: %v", n, err)
		}
	}
}

func dropDB(adminURL, name string) {
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	admin, err := pgx.Connect(ctx, adminURL)
	if err != nil {
		return
	}
	defer func() {
		_ = admin.Close(ctx)
	}()
	_, _ = admin.Exec(ctx, "DROP DATABASE IF EXISTS "+db.QuoteIdent(name)+" WITH (FORCE)")
}

func randomHex(n int) string {
	b := make([]byte, n)
	if _, err := rand.Read(b); err != nil {
		return fmt.Sprintf("%d", time.Now().UnixNano())
	}
	return hex.EncodeToString(b)
}

func rewriteDBName(databaseURL, name string) string {
	cfg, err := pgx.ParseConfig(databaseURL)
	if err != nil {
		return databaseURL
	}
	cfg.Database = name
	return cfg.ConnString()
}
