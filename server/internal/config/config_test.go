package config

import (
	"log/slog"
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

func TestSlogLevelDefault(t *testing.T) {
	cfg := Config{LogLevel: "nope"}
	if cfg.SlogLevel() != slog.LevelInfo {
		t.Fatalf("got %v", cfg.SlogLevel())
	}
}
