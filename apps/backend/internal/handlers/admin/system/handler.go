// Package system handles super-admin system-wide management.
package system

import (
	"encoding/json"
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

// GET /admin/system/dashboard
func (h *Handler) GetDashboardStats(w http.ResponseWriter, r *http.Request) {
	stats := map[string]interface{}{}
	tables := []struct{ key, table, query string }{
		{"total_users", "profiles", ""},
		{"total_products", "products", ""},
		{"total_orders", "orders", ""},
		{"total_content_posts", "content_posts", ""},
		{"pending_orders", "orders", "status=eq.pending"},
		{"active_products", "products", "is_active=eq.true"},
		{"published_content", "content_posts", "is_published=eq.true"},
	}
	for _, t := range tables {
		path := t.table + "?select=count"
		if t.query != "" {
			path += "&" + t.query
		}
		result, err := h.sb.DB("GET", path, nil)
		if err != nil {
			stats[t.key] = nil
			continue
		}
		if items, ok := result.([]interface{}); ok && len(items) > 0 {
			if item, ok := items[0].(map[string]interface{}); ok {
				stats[t.key] = item["count"]
			}
		}
	}
	response.OK(w, stats)
}

// GET /admin/system/announcements
func (h *Handler) ListAnnouncements(w http.ResponseWriter, r *http.Request) {
	result, err := h.sb.DB("GET", "announcements?select=*&order=created_at.desc", nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// POST /admin/system/announcements
func (h *Handler) CreateAnnouncement(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Title     string   `json:"title"`
		Message   string   `json:"message"`
		Audience  string   `json:"audience"`
		ExpiresAt string   `json:"expires_at,omitempty"`
		Tags      []string `json:"tags,omitempty"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Title == "" || req.Message == "" {
		response.BadRequest(w, "title and message are required")
		return
	}
	result, err := h.sb.DB("POST", "announcements", map[string]interface{}{
		"title": req.Title, "message": req.Message,
		"audience": req.Audience, "expires_at": req.ExpiresAt,
		"tags": req.Tags, "created_by": middleware.UserID(r.Context()),
	})
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.Created(w, result)
}

// DELETE /admin/system/announcements/{id}
func (h *Handler) DeleteAnnouncement(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	if _, err := h.sb.DB("DELETE", "announcements?id=eq."+id, nil); err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.NoContent(w)
}

// GET /admin/system/audit-logs
func (h *Handler) ListAuditLogs(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	filter := "select=*&order=created_at.desc"
	if id := q.Get("admin_id"); id != "" {
		filter += "&admin_id=eq." + id
	}
	if action := q.Get("action"); action != "" {
		filter += "&action=eq." + action
	}
	result, err := h.sb.DB("GET", "audit_logs?"+filter, nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// GET /admin/system/settings
func (h *Handler) GetSettings(w http.ResponseWriter, r *http.Request) {
	result, err := h.sb.DB("GET", "platform_settings?select=*", nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// PATCH /admin/system/settings/{key}
func (h *Handler) UpdateSettings(w http.ResponseWriter, r *http.Request) {
	key := middleware.URLParam(r, "key")
	var req struct {
		Value interface{} `json:"value"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	result, err := h.sb.DB("PATCH", "platform_settings?key=eq."+key, map[string]interface{}{
		"value": req.Value, "updated_by": middleware.UserID(r.Context()),
	})
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// GET /admin/system/storage/buckets
func (h *Handler) ListStorageBuckets(w http.ResponseWriter, r *http.Request) {
	req, err := http.NewRequest("GET", h.cfg.SupabaseURL+"/storage/v1/bucket", nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	req.Header.Set("apikey", h.cfg.SupabaseServiceKey)
	req.Header.Set("Authorization", "Bearer "+h.cfg.SupabaseServiceKey)
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	defer resp.Body.Close()
	var result interface{}
	_ = json.NewDecoder(resp.Body).Decode(&result)
	response.OK(w, result)
}

// GET /admin/system/admins/overview
// Returns counts per admin role — useful for the super-admin dashboard.
func (h *Handler) AdminsOverview(w http.ResponseWriter, r *http.Request) {
	counts := map[string]int{
		"super_admin": 0, "user_admin": 0, "shop_admin": 0, "sport_admin": 0, "regular_user": 0,
	}

	result, err := h.sb.AuthRequest("GET", "/auth/v1/admin/users?page=1&per_page=1000", nil, "")
	if err == nil {
		rm, _ := result.(map[string]interface{})
		users, _ := rm["users"].([]interface{})
		for _, u := range users {
			um, _ := u.(map[string]interface{})
			meta, _ := um["app_metadata"].(map[string]interface{})
			role, _ := meta["admin_role"].(string)
			if role == "" {
				counts["regular_user"]++
			} else {
				counts[role]++
			}
		}
		response.OK(w, counts)
		return
	}

	view, vErr := h.sb.DB("GET", "admin_users?select=admin_role", nil)
	if vErr != nil {
		response.InternalError(w, err.Error())
		return
	}
	rows, _ := view.([]interface{})
	for _, raw := range rows {
		um, _ := raw.(map[string]interface{})
		role, _ := um["admin_role"].(string)
		if role != "" {
			counts[role]++
		}
	}
	response.OK(w, counts)
}
