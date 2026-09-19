package db_test

import (
	"context"
	"testing"
	"time"

	"gympulse-server/internal/testutil"
)

func TestPoolPingPostgres16(t *testing.T) {
	pool := testutil.Pool(t)
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	if err := pool.Ping(ctx); err != nil {
		t.Fatal(err)
	}
}
