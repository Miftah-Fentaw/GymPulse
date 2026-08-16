// Package users handles app-user management (user_admin + super_admin).
package users

import (
	"encoding/json"
	"fmt"
	"net/http"

	"gympulse/backend/internal/config"
	"gympulse/shared/middleware"
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

// GET /admin/users?page=1&per_page=20&search=email@example.com
func (h *Handler) ListUsers(w http.ResponseWriter, r *http.Request) {
	page := queryOr(r, "page", "1")
	per := queryOr(r, "per_page", "20")
	search := r.URL.Query().Get("search")

	path := fmt.Sprintf("/auth/v1/admin/users?page=%s&per_page=%s", page, per)
	if search != "" {
		// Supabase admin list supports ?filter= for email/phone search
		path += "&filter=" + search
	}

	result, err := h.sb.AuthRequest("GET", path, nil, "")
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// GET /admin/users/{id}
func (h *Handler) GetUser(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	result, err := h.sb.AuthRequest("GET", "/auth/v1/admin/users/"+id, nil, "")
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// PATCH /admin/users/{id}
func (h *Handler) UpdateUser(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	var req struct {
		FullName string `json:"full_name,omitempty"`
		Phone    string `json:"phone,omitempty"`
		Banned   *bool  `json:"banned,omitempty"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	payload := map[string]interface{}{}
	if req.FullName != "" || req.Phone != "" {
		payload["data"] = map[string]interface{}{"full_name": req.FullName, "phone": req.Phone}
	}
	if req.Banned != nil {
		if *req.Banned {
			payload["ban_duration"] = "876600h"
		} else {
			payload["ban_duration"] = "none"
		}
	}
	result, err := h.sb.AuthRequest("PUT", "/auth/v1/admin/users/"+id, payload, "")
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// DELETE /admin/users/{id}  (super_admin only)
func (h *Handler) DeleteUser(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	if _, err := h.sb.AuthRequest("DELETE", "/auth/v1/admin/users/"+id, nil, ""); err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.NoContent(w)
}

// POST /admin/users/{id}/ban
func (h *Handler) BanUser(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	result, err := h.sb.AuthRequest("PUT", "/auth/v1/admin/users/"+id,
		map[string]interface{}{"ban_duration": "876600h"}, "")
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// POST /admin/users/{id}/unban
func (h *Handler) UnbanUser(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	result, err := h.sb.AuthRequest("PUT", "/auth/v1/admin/users/"+id,
		map[string]interface{}{"ban_duration": "none"}, "")
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

func queryOr(r *http.Request, key, fallback string) string {
	if v := r.URL.Query().Get(key); v != "" {
		return v
	}
	return fallback
}
