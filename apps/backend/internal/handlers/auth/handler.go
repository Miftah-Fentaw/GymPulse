// Package auth handles end-user authentication (mobile app).
// Auth is delegated to Supabase; this is a thin proxy.
package auth

import (
	"encoding/json"
	"fmt"
	"net/http"

	"gympulse/backend/internal/config"
	"gympulse/shared/response"
	"gympulse/shared/supabase"
)

// Handler handles auth endpoints for regular users.
type Handler struct {
	cfg *config.Config
	sb  *supabase.Client
}

func New(cfg *config.Config) *Handler {
	return &Handler{
		cfg: cfg,
		sb:  supabase.New(cfg.SupabaseURL, cfg.SupabaseAnonKey, cfg.SupabaseServiceKey),
	}
}

// POST /auth/signup
func (h *Handler) SignUp(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		FullName string `json:"full_name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	if req.Email == "" || req.Password == "" {
		response.BadRequest(w, "email and password are required")
		return
	}

	result, err := h.sb.AuthRequest("POST", "/auth/v1/signup", map[string]interface{}{
		"email":    req.Email,
		"password": req.Password,
		"data":     map[string]interface{}{"full_name": req.FullName, "role": "user"},
	}, "")
	if err != nil {
		response.BadRequest(w, err.Error())
		return
	}
	response.Created(w, result)
}

// POST /auth/signin
func (h *Handler) SignIn(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	if req.Email == "" || req.Password == "" {
		response.BadRequest(w, "email and password are required")
		return
	}
	result, err := h.sb.AuthRequest("POST", "/auth/v1/token?grant_type=password",
		map[string]interface{}{"email": req.Email, "password": req.Password}, "")
	if err != nil {
		response.Unauthorized(w, err.Error())
		return
	}
	response.OK(w, result)
}

// GET /auth/google
func (h *Handler) SignInWithGoogle(w http.ResponseWriter, r *http.Request) {
	redirect := r.URL.Query().Get("redirect_to")
	if redirect == "" {
		redirect = "com.gym.pulse://login-callback"
	}
	url := fmt.Sprintf("%s/auth/v1/authorize?provider=google&redirect_to=%s", h.cfg.SupabaseURL, redirect)
	response.OK(w, map[string]string{"url": url})
}

// POST /auth/signout
func (h *Handler) SignOut(w http.ResponseWriter, r *http.Request) {
	token := bearerToken(r)
	if token == "" {
		response.Unauthorized(w, "missing token")
		return
	}
	if _, err := h.sb.AuthRequest("POST", "/auth/v1/logout", nil, token); err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.Message(w, "signed out successfully")
}

// POST /auth/refresh
func (h *Handler) RefreshToken(w http.ResponseWriter, r *http.Request) {
	var req struct {
		RefreshToken string `json:"refresh_token"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.RefreshToken == "" {
		response.BadRequest(w, "refresh_token is required")
		return
	}
	result, err := h.sb.AuthRequest("POST", "/auth/v1/token?grant_type=refresh_token",
		map[string]interface{}{"refresh_token": req.RefreshToken}, "")
	if err != nil {
		response.Unauthorized(w, err.Error())
		return
	}
	response.OK(w, result)
}

// POST /auth/reset-password
func (h *Handler) ResetPassword(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email string `json:"email"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Email == "" {
		response.BadRequest(w, "email is required")
		return
	}
	// Fire and forget — always respond the same to prevent email enumeration.
	_, _ = h.sb.AuthRequest("POST", "/auth/v1/recover", map[string]interface{}{"email": req.Email}, "")
	response.Message(w, "if an account exists, a reset email has been sent")
}

// PUT /auth/update-password  (requires valid JWT)
func (h *Handler) UpdatePassword(w http.ResponseWriter, r *http.Request) {
	token := bearerToken(r)
	if token == "" {
		response.Unauthorized(w, "missing token")
		return
	}
	var req struct {
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || len(req.Password) < 8 {
		response.BadRequest(w, "password must be at least 8 characters")
		return
	}
	result, err := h.sb.AuthRequest("PUT", "/auth/v1/user",
		map[string]interface{}{"password": req.Password}, token)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// GET /auth/me  (requires valid JWT)
func (h *Handler) Me(w http.ResponseWriter, r *http.Request) {
	token := bearerToken(r)
	if token == "" {
		response.Unauthorized(w, "missing token")
		return
	}
	result, err := h.sb.AuthRequest("GET", "/auth/v1/user", nil, token)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

func bearerToken(r *http.Request) string {
	h := r.Header.Get("Authorization")
	if len(h) > 7 && h[:7] == "Bearer " {
		return h[7:]
	}
	return ""
}
