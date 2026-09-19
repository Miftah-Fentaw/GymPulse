package config

import (
	"fmt"
	"log/slog"
	"strings"

	"github.com/caarlos0/env/v11"
)

type Config struct {
	HTTPAddr    string `env:"HTTP_ADDR" envDefault:":8080"`
	LogLevel    string `env:"LOG_LEVEL" envDefault:"info"`
	DatabaseURL string `env:"DATABASE_URL,required,notEmpty"`
}

func Load() (Config, error) {
	cfg, err := env.ParseAs[Config]()
	if err != nil {
		return Config{}, fmt.Errorf("config: %w", err)
	}
	return cfg, nil
}

func (c Config) SlogLevel() slog.Level {
	switch strings.ToLower(strings.TrimSpace(c.LogLevel)) {
	case "debug":
		return slog.LevelDebug
	case "warn", "warning":
		return slog.LevelWarn
	case "error":
		return slog.LevelError
	default:
		return slog.LevelInfo
	}
}
