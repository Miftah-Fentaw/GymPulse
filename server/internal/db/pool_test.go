package db

import (
	"context"
	"strings"
	"testing"
	"time"
)

func TestPingFailsOnUnreachableURL(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	pool, err := NewPool(ctx, "postgres://gympulse:gympulse@127.0.0.1:1/gympulse?sslmode=disable&connect_timeout=1")
	if err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "simple protocol") {
			t.Fatalf("must not use SimpleProtocol workaround: %v", err)
		}
		return
	}
	defer pool.Close()

	if err := pool.Ping(ctx); err == nil {
		t.Fatal("expected ping to fail against unreachable URL")
	}
}

func TestParseConfigRejectsInvalid(t *testing.T) {
	_, err := NewPool(context.Background(), "not-a-postgres-url")
	if err == nil {
		t.Fatal("expected error")
	}
}
