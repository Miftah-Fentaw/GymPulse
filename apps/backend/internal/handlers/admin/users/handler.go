// Package users handles app-user management (user_admin + super_admin).
package users

import (
	"encoding/json"
	"net/http"
	"strings"

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

// GET /admin/users?page=1&per_page=20&search=email@example.com&status=banned
func (h *Handler) ListUsers(w http.ResponseWriter, r *http.Request) {
	search := r.URL.Query().Get("search")
	status := r.URL.Query().Get("status")

	users, err := h.loadAppUsers()
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}

	filtered := make([]interface{}, 0, len(users))
	for _, raw := range users {
		u, _ := raw.(map[string]interface{})
		if u == nil {
			continue
		}
		if role, _ := u["admin_role"].(string); role != "" {
			continue
		}
		email, _ := u["email"].(string)
		name, _ := u["full_name"].(string)
		if search != "" {
			q := search
			if !containsFold(email, q) && !containsFold(name, q) {
				continue
			}
		}
		banned := u["banned_until"] != nil && u["banned_until"] != ""
		if status == "banned" && !banned {
			continue
		}
		if status == "active" && banned {
			continue
		}
		u["is_banned"] = banned
		filtered = append(filtered, u)
	}

	response.OK(w, map[string]interface{}{"users": filtered, "total": len(filtered)})
}

func (h *Handler) loadAppUsers() ([]interface{}, error) {
	result, err := h.sb.AuthRequest("GET", "/auth/v1/admin/users?page=1&per_page=200", nil, "")
	if err == nil {
		rm, _ := result.(map[string]interface{})
		users, _ := rm["users"].([]interface{})
		out := make([]interface{}, 0, len(users))
		for _, raw := range users {
			um, _ := raw.(map[string]interface{})
			if um == nil {
				continue
			}
			meta, _ := um["app_metadata"].(map[string]interface{})
			role, _ := meta["admin_role"].(string)
			userMeta, _ := um["user_metadata"].(map[string]interface{})
			fullName, _ := userMeta["full_name"].(string)
			out = append(out, map[string]interface{}{
				"id":                 um["id"],
				"email":              um["email"],
				"full_name":          fullName,
				"admin_role":         role,
				"created_at":         um["created_at"],
				"last_sign_in_at":    um["last_sign_in_at"],
				"banned_until":       um["banned_until"],
				"email_confirmed_at": um["email_confirmed_at"],
			})
		}
		return out, nil
	}

	view, err := h.sb.DB("GET", "app_users?select=*&order=created_at.desc", nil)
	if err == nil {
		rows, _ := view.([]interface{})
		return rows, nil
	}

	profiles, pErr := h.sb.DB("GET", "profiles?select=id,full_name,phone,avatar_url,created_at&order=created_at.desc", nil)
	if pErr != nil {
		return nil, err
	}
	rows, _ := profiles.([]interface{})
	return rows, nil
}

func containsFold(haystack, needle string) bool {
	return strings.Contains(strings.ToLower(haystack), strings.ToLower(needle))
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
