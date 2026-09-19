package db

import (
	"context"
	"fmt"
	"log/slog"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func NewPool(ctx context.Context, databaseURL string) (*pgxpool.Pool, error) {
	cfg, err := pgxpool.ParseConfig(databaseURL)
	if err != nil {
		return nil, fmt.Errorf("parse DATABASE_URL: %w", err)
	}
	pool, err := pgxpool.NewWithConfig(ctx, cfg)
	if err != nil {
		return nil, fmt.Errorf("open pool: %w", err)
	}
	return pool, nil
}

func PingWithRetry(ctx context.Context, pool *pgxpool.Pool, log *slog.Logger) error {
	var err error
	backoff := 100 * time.Millisecond
	for attempt := 1; attempt <= 8; attempt++ {
		err = pool.Ping(ctx)
		if err == nil {
			return nil
		}
		if log != nil {
			log.Warn("database ping failed", "attempt", attempt, "err", err)
		}
		select {
		case <-ctx.Done():
			return fmt.Errorf("database unreachable: %w", ctx.Err())
		case <-time.After(backoff):
		}
		if backoff < time.Second {
			backoff *= 2
		}
	}
	return fmt.Errorf("database unreachable after retries: %w", err)
}
