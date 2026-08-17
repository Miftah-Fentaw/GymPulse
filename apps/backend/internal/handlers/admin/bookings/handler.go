// Package bookings handles class-booking management (user_admin + super_admin).
package bookings

import (
	"encoding/json"
	"fmt"
	"net/http"

	"gympulse/backend/internal/config"
	"gympulse/shared/middleware"
	"gympulse/shared/pagination"
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

// GET /admin/bookings
func (h *Handler) ListBookings(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	p := pagination.Parse(r)
	filter := fmt.Sprintf("select=*,classes(title,start_time),profiles(full_name,email)&order=created_at.desc&%s", p.QueryFragment())
	if v := q.Get("status"); v != "" {
		filter += "&status=eq." + v
	}
	if v := q.Get("user_id"); v != "" {
		filter += "&user_id=eq." + v
	}
	if v := q.Get("class_id"); v != "" {
		filter += "&class_id=eq." + v
	}
	result, err := h.sb.DB("GET", "bookings?"+filter, nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// GET /admin/bookings/{id}
func (h *Handler) GetBooking(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	result, err := h.sb.DB("GET",
		"bookings?id=eq."+id+"&select=*,classes(*,disciplines(name)),profiles(full_name,email,phone)", nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	items, _ := result.([]interface{})
	if len(items) == 0 {
		response.NotFound(w, "booking not found")
		return
	}
	response.OK(w, items[0])
}

// PATCH /admin/bookings/{id}/status
func (h *Handler) UpdateBookingStatus(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	var req struct {
		Status string `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	valid := map[string]bool{
		"pending": true, "confirmed": true, "checked_in": true,
		"no_show": true, "cancelled": true, "refunded": true,
	}
	if !valid[req.Status] {
		response.BadRequest(w, "invalid booking status")
		return
	}
	payload := map[string]interface{}{"status": req.Status}
	if req.Status == "checked_in" {
		payload["checked_in_at"] = "now()"
	}
	result, err := h.sb.DB("PATCH", "bookings?id=eq."+id, payload)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// GET /admin/bookings/stats
func (h *Handler) GetBookingStats(w http.ResponseWriter, r *http.Request) {
	// Fetch counts per status using PostgREST head=true approach
	statuses := []string{"pending", "confirmed", "checked_in", "no_show", "cancelled"}
	stats := map[string]interface{}{}
	for _, s := range statuses {
		result, err := h.sb.DB("GET", "bookings?status=eq."+s+"&select=count", nil)
		if err == nil {
			stats[s] = result
		}
	}
	response.OK(w, stats)
}
