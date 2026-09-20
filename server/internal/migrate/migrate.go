package migrate

import (
	"context"
	"database/sql"
	"fmt"
	"io/fs"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/stdlib"
	"github.com/pressly/goose/v3"
	"github.com/pressly/goose/v3/lock"

	"gympulse-server/migrations"
)

func open(databaseURL string) (*sql.DB, error) {
	cfg, err := pgx.ParseConfig(databaseURL)
	if err != nil {
		return nil, fmt.Errorf("parse DATABASE_URL: %w", err)
	}
	return stdlib.OpenDB(*cfg), nil
}

func provider(db *sql.DB) (*goose.Provider, error) {
	fsys, err := fs.Sub(migrations.FS, ".")
	if err != nil {
		return nil, err
	}
	locker, err := lock.NewPostgresSessionLocker()
	if err != nil {
		return nil, fmt.Errorf("session locker: %w", err)
	}
	return goose.NewProvider(
		goose.DialectPostgres,
		db,
		fsys,
		goose.WithSessionLocker(locker),
		goose.WithTableName("goose_db_version"),
	)
}

func Up(ctx context.Context, databaseURL string) error {
	return withProvider(ctx, databaseURL, func(ctx context.Context, p *goose.Provider) error {
		_, err := p.Up(ctx)
		return err
	})
}

func Down(ctx context.Context, databaseURL string) error {
	return withProvider(ctx, databaseURL, func(ctx context.Context, p *goose.Provider) error {
		_, err := p.Down(ctx)
		return err
	})
}

func Status(ctx context.Context, databaseURL string) error {
	return withProvider(ctx, databaseURL, func(ctx context.Context, p *goose.Provider) error {
		results, err := p.Status(ctx)
		if err != nil {
			return err
		}
		if len(results) == 0 {
			fmt.Println("no migrations")
			return nil
		}
		for _, r := range results {
			fmt.Printf("%s\t%s\n", r.Source.Path, r.State)
		}
		return nil
	})
}

func withProvider(ctx context.Context, databaseURL string, fn func(context.Context, *goose.Provider) error) error {
	db, err := open(databaseURL)
	if err != nil {
		return err
	}
	defer func() {
		_ = db.Close()
	}()
	p, err := provider(db)
	if err != nil {
		return err
	}
	return fn(ctx, p)
}
