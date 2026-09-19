package httpserver

import (
	"context"
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"sync/atomic"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	nethttpmiddleware "github.com/oapi-codegen/nethttp-middleware"

	"gympulse-server/internal/http/api"
)

type contextKey string

const requestIDKey contextKey = "request_id"

type Server struct {
	HTTP *http.Server
	pool *pgxpool.Pool
}

type apiImpl struct {
	pool       *pgxpool.Pool
	log        *slog.Logger
	echoCalled atomic.Bool
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
	swagger, err := api.GetSwagger()
	if err != nil {
		return nil, err
	}
	swagger.Servers = nil

	r := chi.NewRouter()
	r.Use(requestLog(log))
	r.Use(nethttpmiddleware.OapiRequestValidatorWithOptions(swagger, &nethttpmiddleware.Options{
		SilenceServersWarning: true,
		ErrorHandler: func(w http.ResponseWriter, message string, statusCode int) {
			writeError(w, statusCode, "validation_error", message, nil)
		},
	}))

	strict := api.NewStrictHandler(impl, nil)
	return api.HandlerFromMux(strict, r), nil
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
