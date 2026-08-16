// Package adminauth handles authentication for admin users.
// Returns 403 if the Supabase account has no admin_role in app_metadata.
package adminauth

import (
	"encoding/json"
	"net/http"

	"gympulse/backend/internal/config"
	"gympulse/shared/response"
	"gympulse/shared/supabase"
)

type Handler struct {
	cfg *config.Config
	sb  *supabase.Client
}

func New(cfg *config.Config) *Handler {
	return &Handler{cfg: cfg, sb: supabase.New(cfg.SupabaseURL, cfg.SupabaseAnonKey, cfg.SupabaseServiceKey)}
}

// POST /admin/auth/signin
func (h *Handler) SignIn(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Email == "" || req.Password == "" {
		response.BadRequest(w, "email and password are required")
		return
	}

	result, err := h.sb.AuthRequest("POST", "/auth/v1/token?grant_type=password",
		map[string]interface{}{"email": req.Email, "password": req.Password}, "")
	if err != nil {
		response.Unauthorized(w, err.Error())
		return
	}

	// Verify admin_role is present — reject regular users.
	rm, _ := result.(map[string]interface{})
	user, _ := rm["user"].(map[string]interface{})
	meta, _ := user["app_metadata"].(map[string]interface{})
	role, _ := meta["admin_role"].(string)
	if role == "" {
		response.Forbidden(w, "account is not an admin")
		return
	}

	rm["admin_role"] = role
	response.OK(w, rm)
}

// POST /admin/auth/signout
func (h *Handler) SignOut(w http.ResponseWriter, r *http.Request) {
	token := bearerToken(r)
	if token == "" {
		response.Unauthorized(w, "missing token")
		return
	}
	_, _ = h.sb.AuthRequest("POST", "/auth/v1/logout", nil, token)
	response.Message(w, "signed out successfully")
}

// POST /admin/auth/refresh
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

// POST /admin/auth/reset-password
func (h *Handler) ResetPassword(w http.ResponseWriter, r *http.Request) {
	var req struct{ Email string `json:"email"` }
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Email == "" {
		response.BadRequest(w, "email is required")
		return
	}
	_, _ = h.sb.AuthRequest("POST", "/auth/v1/recover", map[string]interface{}{"email": req.Email}, "")
	response.Message(w, "if an admin account exists, a reset email has been sent")
}

// PUT /admin/auth/update-password
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

// GET /admin/auth/me
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
