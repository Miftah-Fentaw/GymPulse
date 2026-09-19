package db_test

import (
	"context"
	"testing"
	"time"

	"gympulse-server/internal/db"
	"gympulse-server/internal/testutil"
)

func TestPoolPingPostgres16(t *testing.T) {
	url := testutil.PostgresURL(t)
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	pool, err := db.NewPool(ctx, url)
	if err != nil {
		t.Fatal(err)
	}
	defer pool.Close()

	if err := pool.Ping(ctx); err != nil {
		t.Fatal(err)
	}
}
