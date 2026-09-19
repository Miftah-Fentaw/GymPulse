package config

import (
	"log/slog"
	"os"
	"strings"
	"testing"
)

func TestLoadMissingDatabaseURL(t *testing.T) {
	t.Setenv("HTTP_ADDR", ":0")
	t.Setenv("LOG_LEVEL", "info")
	t.Setenv("DATABASE_URL", "")

	_, err := Load()
	if err == nil {
		t.Fatal("expected error when DATABASE_URL is missing")
	}
	if !strings.Contains(err.Error(), "DATABASE_URL") {
		t.Fatalf("error should name DATABASE_URL, got %v", err)
	}
}

func TestLoadAutoMigrateDefaultFalse(t *testing.T) {
	t.Setenv("DATABASE_URL", "postgres://gympulse:gympulse@localhost:5432/gympulse")
	t.Setenv("AUTO_MIGRATE", "false")

	cfg, err := Load()
	if err != nil {
		t.Fatal(err)
	}
	if cfg.AutoMigrate {
		t.Fatal("AUTO_MIGRATE must default to false")
	}

	t.Setenv("AUTO_MIGRATE", "true")
	cfg, err = Load()
	if err != nil {
		t.Fatal(err)
	}
	if !cfg.AutoMigrate {
		t.Fatal("AUTO_MIGRATE=true must enable auto migrate")
	}
}

func TestLoadAutoMigrateUnsetIsFalse(t *testing.T) {
	t.Setenv("DATABASE_URL", "postgres://gympulse:gympulse@localhost:5432/gympulse")
	orig, had := os.LookupEnv("AUTO_MIGRATE")
	if err := os.Unsetenv("AUTO_MIGRATE"); err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() {
		if had {
			_ = os.Setenv("AUTO_MIGRATE", orig)
		}
	})

	cfg, err := Load()
	if err != nil {
		t.Fatal(err)
	}
	if cfg.AutoMigrate {
		t.Fatal("unset AUTO_MIGRATE must be false")
	}
}

func TestSlogLevelDefault(t *testing.T) {
	cfg := Config{LogLevel: "nope"}
	if cfg.SlogLevel() != slog.LevelInfo {
		t.Fatalf("got %v", cfg.SlogLevel())
	}
}
