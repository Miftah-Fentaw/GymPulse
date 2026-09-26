package httpserver

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/getkin/kin-openapi/openapi3"
	"github.com/getkin/kin-openapi/openapi3filter"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	nethttpmiddleware "github.com/oapi-codegen/nethttp-middleware"

	"gympulse-server/internal/http/api"
)

type contextKey string

const requestIDKey contextKey = "request_id"
const authUserKey contextKey = "auth_user"
const requestKey contextKey = "request"

type Server struct {
	HTTP *http.Server
	pool *pgxpool.Pool
}

type apiImpl struct {
	pool       *pgxpool.Pool
	log        *slog.Logger
	echoCalled atomic.Bool
	rateMu     sync.Mutex
	rate       map[string][]time.Time
}

func New(addr string, log *slog.Logger, pool *pgxpool.Pool) (*Server, error) {
	handler, err := newRouter(log, &apiImpl{pool: pool, log: log})
	if err != nil {
		return nil, err
	}
	return &Server{
		HTTP: &http.Server{
			Addr:              addr,
			Handler:           handler,
			ReadHeaderTimeout: 5 * time.Second,
		},
		pool: pool,
	}, nil
}

func (s *Server) Shutdown(ctx context.Context) error {
	err := s.HTTP.Shutdown(ctx)
	if s.pool != nil {
		s.pool.Close()
	}
	return err
}

func newRouter(log *slog.Logger, impl *apiImpl) (http.Handler, error) {
	// Prefer the full repo openapi.yaml so domain routes (sessions, invoices, …)
	// validate and fall through to domainFallback when not yet code-generated.
	swagger, err := loadValidatorSwagger()
	if err != nil {
		return nil, err
	}
	swagger.Servers = nil

	r := chi.NewRouter()
	r.Use(requestLog(log))
	r.Use(authContext(impl))
	r.Use(corsAndCSRF())
	r.Use(nethttpmiddleware.OapiRequestValidatorWithOptions(swagger, &nethttpmiddleware.Options{
		SilenceServersWarning: true,
		Options: openapi3filter.Options{
			AuthenticationFunc: func(_ context.Context, input *openapi3filter.AuthenticationInput) error {
				if input.SecuritySchemeName != "bearerAuth" {
					return fmt.Errorf("unsupported security scheme %q", input.SecuritySchemeName)
				}
				h := input.RequestValidationInput.Request.Header.Get("Authorization")
				if len(h) < 8 || !strings.EqualFold(h[:7], "Bearer ") {
					return errors.New("missing bearer token")
				}
				if _, err := parseAccess(h[7:], impl.secret()); err != nil {
					return err
				}
				return nil
			},
		},
		ErrorHandler: func(w http.ResponseWriter, message string, statusCode int) {
			writeError(w, statusCode, "validation_error", message, nil)
		},
	}))

	strict := api.NewStrictHandler(impl, nil)
	api.HandlerFromMux(strict, r)
	// The generated contract is intentionally kept checked in. Until the next
	// generator refresh, routes added by the domain specs are handled by the
	// authenticated domain fallback rather than silently returning a 501.
	r.NotFound(impl.domainFallback)
	return r, nil
}

func loadValidatorSwagger() (*openapi3.T, error) {
	candidates := []string{
		os.Getenv("OPENAPI_PATH"),
		"openapi.yaml",
		filepath.Join("..", "openapi.yaml"),
		filepath.Join("..", "..", "openapi.yaml"),
	}
	if exe, err := os.Executable(); err == nil {
		dir := filepath.Dir(exe)
		candidates = append(candidates,
			filepath.Join(dir, "openapi.yaml"),
			filepath.Join(dir, "..", "openapi.yaml"),
			filepath.Join(dir, "..", "..", "openapi.yaml"),
		)
	}
	loader := openapi3.NewLoader()
	loader.IsExternalRefsAllowed = true
	for _, p := range candidates {
		if p == "" {
			continue
		}
		data, err := os.ReadFile(p)
		if err != nil {
			continue
		}
		doc, err := loader.LoadFromData(data)
		if err != nil {
			return nil, fmt.Errorf("load openapi %s: %w", p, err)
		}
		return doc, nil
	}
	return api.GetSwagger()
}

func authContext(impl *apiImpl) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			h := r.Header.Get("Authorization")
			if len(h) > 7 && h[:7] == "Bearer " {
				if claims, err := parseAccess(h[7:], impl.secret()); err == nil {
					if id, err := uuid.Parse(claims.UserID); err == nil {
						r = r.WithContext(context.WithValue(r.Context(), authUserKey, id))
					}
				}
			}
			next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), requestKey, r)))
		})
	}
}

func corsAndCSRF() func(http.Handler) http.Handler {
	allowed := map[string]bool{}
	for _, origin := range strings.Split(os.Getenv("CORS_ORIGINS"), ",") {
		if origin = strings.TrimSpace(origin); origin != "" {
			u, err := url.Parse(origin)
			if err == nil && (strings.HasPrefix(u.Hostname(), "admin.") || strings.HasPrefix(u.Hostname(), "app.")) {
				allowed[origin] = true
			}
		}
	}
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			origin := r.Header.Get("Origin")
			if allowed[origin] {
				w.Header().Set("Access-Control-Allow-Origin", origin)
				w.Header().Set("Access-Control-Allow-Credentials", "true")
				w.Header().Set("Vary", "Origin")
				w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type, X-GymPulse-Client")
				w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
			}
			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusNoContent)
				return
			}
			_, hasCookie := r.Cookie("gympulse_refresh")
			if (r.URL.Path == "/v1/auth/refresh" || r.URL.Path == "/v1/auth/logout") && r.Method == http.MethodPost && hasCookie == nil {
				if !allowed[origin] || r.Header.Get("X-GymPulse-Client") == "" {
					writeError(w, http.StatusForbidden, "csrf_denied", "origin not allowed", nil)
					return
				}
			}
			next.ServeHTTP(w, r)
		})
	}
}

func requestLog(log *slog.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			id := r.Header.Get("X-Request-ID")
			if id == "" {
				u, err := uuid.NewV7()
				if err != nil {
					u = uuid.New()
				}
				id = u.String()
			}
			w.Header().Set("X-Request-ID", id)
			ctx := context.WithValue(r.Context(), requestIDKey, id)
			log.InfoContext(ctx, "request",
				"request_id", id,
				"method", r.Method,
				"path", r.URL.Path,
			)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func writeError(w http.ResponseWriter, status int, code, message string, details map[string]any) {
	if details == nil {
		details = map[string]any{}
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(map[string]any{
		"error": map[string]any{
			"code":    code,
			"message": message,
			"details": details,
		},
	})
}

func (a *apiImpl) GetHealth(_ context.Context, _ api.GetHealthRequestObject) (api.GetHealthResponseObject, error) {
	return api.GetHealth200JSONResponse{Status: api.HealthResponseStatusOk}, nil
}

func (a *apiImpl) GetReady(ctx context.Context, _ api.GetReadyRequestObject) (api.GetReadyResponseObject, error) {
	if a.pool == nil {
		a.warnReady(errors.New("database pool is nil"))
		return api.GetReady503JSONResponse{Status: api.ReadyResponseStatusNotReady}, nil
	}
	if err := a.pool.Ping(ctx); err != nil {
		a.warnReady(err)
		return api.GetReady503JSONResponse{Status: api.ReadyResponseStatusNotReady}, nil
	}
	return api.GetReady200JSONResponse{Status: api.ReadyResponseStatusOk}, nil
}

func (a *apiImpl) warnReady(err error) {
	log := a.log
	if log == nil {
		log = slog.Default()
	}
	log.Warn("readiness ping failed", "err", err)
}

func (a *apiImpl) PostEcho(_ context.Context, request api.PostEchoRequestObject) (api.PostEchoResponseObject, error) {
	a.echoCalled.Store(true)
	if request.Body == nil {
		return nil, errors.New("missing body")
	}
	return api.PostEcho200JSONResponse{Message: request.Body.Message}, nil
}
