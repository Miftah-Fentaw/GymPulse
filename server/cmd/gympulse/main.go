package main

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"gympulse-server/internal/config"
	"gympulse-server/internal/db"
	httpserver "gympulse-server/internal/http"
	"gympulse-server/internal/migrate"
)

func main() {
	config.LoadDotEnv()
	if len(os.Args) > 1 {
		if err := runCLI(os.Args[1:]); err != nil {
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}
		return
	}
	if err := runServer(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func runCLI(args []string) error {
	cfg, err := config.Load()
	if err != nil {
		return err
	}
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	switch args[0] {
	case "migrate":
		if len(args) < 2 {
			return errors.New("usage: gympulse migrate up|down|status")
		}
		switch args[1] {
		case "up":
			return migrate.Up(ctx, cfg.DatabaseURL)
		case "down":
			return migrate.Down(ctx, cfg.DatabaseURL)
		case "status":
			return migrate.Status(ctx, cfg.DatabaseURL)
		default:
			return fmt.Errorf("unknown migrate command %q", args[1])
		}
	case "db":
		if len(args) < 2 || args[1] != "create" {
			return errors.New("usage: gympulse db create")
		}
		return db.CreateIfMissing(ctx, cfg.DatabaseURL)
	default:
		return fmt.Errorf("unknown command %q", args[0])
	}
}

func runServer() error {
	cfg, err := config.Load()
	if err != nil {
		return err
	}

	log := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: cfg.SlogLevel()}))
	slog.SetDefault(log)

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	pool, err := db.NewPool(ctx, cfg.DatabaseURL)
	if err != nil {
		return err
	}

	if err := db.PingWithRetry(ctx, pool, log); err != nil {
		pool.Close()
		return err
	}
	log.Info("database reachable")

	if cfg.AutoMigrate {
		if err := migrate.Up(ctx, cfg.DatabaseURL); err != nil {
			pool.Close()
			return fmt.Errorf("auto migrate: %w", err)
		}
		log.Info("auto migrate complete")
	}

	srv, err := httpserver.New(cfg.HTTPAddr, log, pool)
	if err != nil {
		pool.Close()
		return err
	}

	log.Info("listening", "addr", cfg.HTTPAddr)

	errCh := make(chan error, 1)
	go func() {
		if err := srv.HTTP.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			errCh <- err
			return
		}
		errCh <- nil
	}()

	select {
	case <-ctx.Done():
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		if err := srv.Shutdown(shutdownCtx); err != nil {
			return fmt.Errorf("shutdown: %w", err)
		}
		return nil
	case err := <-errCh:
		pool.Close()
		return err
	}
}
