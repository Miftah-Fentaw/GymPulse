// Package admins handles admin-account management (super_admin only).
package admins

import (
	"encoding/json"
	"net/http"

	"gympulse/backend/internal/config"
	"gympulse/shared/audit"
	"gympulse/shared/middleware"
	"gympulse/shared/response"
	"gympulse/shared/supabase"
)

var validRoles = map[string]bool{
	middleware.RoleSuperAdmin: true,
	middleware.RoleUserAdmin:  true,
	middleware.RoleShopAdmin:  true,
	middleware.RoleSportAdmin: true,
}

type Handler struct {
	cfg *config.Config
	sb  *supabase.Client
}

func New(cfg *config.Config) *Handler {
	return &Handler{cfg: cfg, sb: supabase.New(cfg.SupabaseURL, cfg.SupabaseAnonKey, cfg.SupabaseServiceKey)}
}

// GET /admin/admins?role=shop_admin
func (h *Handler) ListAdmins(w http.ResponseWriter, r *http.Request) {
	roleFilter := r.URL.Query().Get("role")
	admins, err := h.loadAdmins()
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	if roleFilter != "" {
		filtered := make([]interface{}, 0)
		for _, a := range admins {
			if adminRoleOf(a) == roleFilter {
				filtered = append(filtered, a)
			}
		}
		admins = filtered
	}
	response.OK(w, map[string]interface{}{"admins": admins, "total": len(admins)})
}

func (h *Handler) loadAdmins() ([]interface{}, error) {
	result, err := h.sb.AuthRequest("GET", "/auth/v1/admin/users?page=1&per_page=200", nil, "")
	if err == nil {
		rm, _ := result.(map[string]interface{})
		users, _ := rm["users"].([]interface{})
		admins := make([]interface{}, 0)
		for _, u := range users {
			if adminRoleOf(u) != "" {
				admins = append(admins, normalizeAdmin(u))
			}
		}
		return admins, nil
	}

	view, err := h.sb.DB("GET", "admin_users?select=*&order=created_at.desc", nil)
	if err != nil {
		return nil, err
	}
	rows, _ := view.([]interface{})
	admins := make([]interface{}, 0, len(rows))
	for _, row := range rows {
		admins = append(admins, normalizeAdmin(row))
	}
	return admins, nil
}

func adminRoleOf(u interface{}) string {
	um, _ := u.(map[string]interface{})
	if role, _ := um["admin_role"].(string); role != "" {
		return role
	}
	meta, _ := um["app_metadata"].(map[string]interface{})
	role, _ := meta["admin_role"].(string)
	return role
}

func normalizeAdmin(u interface{}) map[string]interface{} {
	um, _ := u.(map[string]interface{})
	if um == nil {
		return map[string]interface{}{}
	}
	role := adminRoleOf(um)
	fullName, _ := um["full_name"].(string)
	if fullName == "" {
		if meta, ok := um["user_metadata"].(map[string]interface{}); ok {
			fullName, _ = meta["full_name"].(string)
		}
	}
	banned := um["banned_until"] != nil && um["banned_until"] != ""
	return map[string]interface{}{
		"id":           um["id"],
		"email":        um["email"],
		"full_name":    fullName,
		"admin_role":   role,
		"created_at":   um["created_at"],
		"banned_until": um["banned_until"],
		"is_active":    !banned,
		"app_metadata": map[string]interface{}{"admin_role": role, "is_admin": true},
		"user_metadata": map[string]interface{}{"full_name": fullName},
	}
}

// GET /admin/admins/{id}
func (h *Handler) GetAdmin(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	result, err := h.sb.AuthRequest("GET", "/auth/v1/admin/users/"+id, nil, "")
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// POST /admin/admins
func (h *Handler) CreateAdmin(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		FullName string `json:"full_name"`
		Role     string `json:"role"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	if req.Email == "" || req.Password == "" {
		response.BadRequest(w, "email and password are required")
		return
	}
	if !validRoles[req.Role] {
		response.BadRequest(w, "role must be one of: super_admin, user_admin, shop_admin, sport_admin")
		return
	}
	if len(req.Password) < 8 {
		response.BadRequest(w, "password must be at least 8 characters")
		return
	}

	result, err := h.sb.AuthRequest("POST", "/auth/v1/admin/users", map[string]interface{}{
		"email":         req.Email,
		"password":      req.Password,
		"email_confirm": true,
		"user_metadata": map[string]interface{}{"full_name": req.FullName},
		"app_metadata":  map[string]interface{}{"admin_role": req.Role, "is_admin": true},
	}, "")
	if err != nil {
		response.Conflict(w, err.Error())
		return
	}

	audit.Log(r, h.sb, audit.Entry{
		Action:   "create_admin",
		Resource: "admins",
		Metadata: map[string]interface{}{"email": req.Email, "role": req.Role},
	})

	response.Created(w, result)
}

// PATCH /admin/admins/{id}
func (h *Handler) UpdateAdmin(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	var req struct {
		FullName string `json:"full_name,omitempty"`
		Role     string `json:"role,omitempty"`
		Active   *bool  `json:"active,omitempty"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	if req.Role != "" && !validRoles[req.Role] {
		response.BadRequest(w, "invalid role")
		return
	}

	payload := map[string]interface{}{}
	if req.FullName != "" {
		payload["user_metadata"] = map[string]interface{}{"full_name": req.FullName}
	}
	if req.Role != "" {
		payload["app_metadata"] = map[string]interface{}{"admin_role": req.Role, "is_admin": true}
	}
	if req.Active != nil {
		if *req.Active {
			payload["ban_duration"] = "none"
		} else {
			payload["ban_duration"] = "876600h"
		}
	}

	result, err := h.sb.AuthRequest("PUT", "/auth/v1/admin/users/"+id, payload, "")
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// DELETE /admin/admins/{id}
func (h *Handler) DeleteAdmin(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	if id == middleware.UserID(r.Context()) {
		response.BadRequest(w, "cannot delete your own account")
		return
	}
	if _, err := h.sb.AuthRequest("DELETE", "/auth/v1/admin/users/"+id, nil, ""); err != nil {
		response.InternalError(w, err.Error())
		return
	}

	audit.Log(r, h.sb, audit.Entry{
		Action:     "delete_admin",
		Resource:   "admins",
		ResourceID: id,
	})

	response.NoContent(w)
}

func queryOr(r *http.Request, key, fallback string) string {
	if v := r.URL.Query().Get(key); v != "" {
		return v
	}
	return fallback
}
