// Package config loads application configuration from environment variables.
package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// Config holds all runtime configuration for the backend.
type Config struct {
	Port               string
	SupabaseURL        string
	SupabaseAnonKey    string
	SupabaseServiceKey string
	JWTSecret          string
	SportContentBucket string
	ProductImageBucket string
}

// Load reads config from environment, falling back to a .env file.
func Load() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, reading from environment")
	}
	return &Config{
		Port:               getEnv("BACKEND_PORT", "8080"),
		SupabaseURL:        must("SUPABASE_URL"),
		SupabaseAnonKey:    must("SUPABASE_ANON_KEY"),
		SupabaseServiceKey: must("SUPABASE_SERVICE_KEY"),
		JWTSecret:          must("SUPABASE_JWT_SECRET"),
		SportContentBucket: getEnv("SPORT_CONTENT_BUCKET", "sport-content"),
		ProductImageBucket: getEnv("PRODUCT_IMAGE_BUCKET", "product-images"),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func must(key string) string {
	v := os.Getenv(key)
	if v == "" {
		log.Fatalf("required env var %s is not set", key)
	}
	return v
}
