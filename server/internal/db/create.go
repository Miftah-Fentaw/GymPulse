package db

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

const maintenanceDB = "postgres"

func CreateIfMissing(ctx context.Context, databaseURL string) error {
	cfg, err := pgx.ParseConfig(databaseURL)
	if err != nil {
		return fmt.Errorf("parse DATABASE_URL: %w", err)
	}
	target := cfg.Database
	if target == "" {
		return errors.New("DATABASE_URL must include a database name")
	}
	if target == maintenanceDB {
		return nil
	}

	cfg.Database = maintenanceDB
	conn, err := pgx.ConnectConfig(ctx, cfg)
	if err != nil {
		return fmt.Errorf("connect to %s: %w", maintenanceDB, err)
	}
	defer func() {
		_ = conn.Close(ctx)
	}()

	var canCreate bool
	if err := conn.QueryRow(ctx, `SELECT rolcreatedb FROM pg_roles WHERE rolname = current_user`).Scan(&canCreate); err != nil {
		return fmt.Errorf("check CREATEDB: %w", err)
	}
	if !canCreate {
		return fmt.Errorf("role %q does not have CREATEDB; ask an admin: ALTER ROLE %s CREATEDB", cfg.User, cfg.User)
	}

	var exists bool
	if err := conn.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = $1)`, target).Scan(&exists); err != nil {
		return fmt.Errorf("lookup database: %w", err)
	}
	if exists {
		fmt.Printf("database %s already exists\n", target)
		return nil
	}

	ident := pgx.Identifier{target}.Sanitize()
	if _, err := conn.Exec(ctx, "CREATE DATABASE "+ident); err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "42501" {
			return fmt.Errorf("CREATE DATABASE denied: the role must have CREATEDB: %w", err)
		}
		return fmt.Errorf("create database %s: %w", target, err)
	}
	fmt.Printf("created database %s\n", target)
	return nil
}

func QuoteIdent(name string) string {
	return pgx.Identifier{name}.Sanitize()
}

func ValidTestDBName(name string) bool {
	if !strings.HasPrefix(name, "gympulse_test_") {
		return false
	}
	for _, c := range name {
		if (c < 'a' || c > 'z') && (c < '0' || c > '9') && c != '_' {
			return false
		}
	}
	return true
}
