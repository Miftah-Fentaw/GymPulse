// Package trainers handles trainer management (user_admin + super_admin).
package trainers

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

// GET /admin/trainers
func (h *Handler) ListTrainers(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	p := pagination.Parse(r)
	filter := fmt.Sprintf("select=*,profiles(full_name,email,avatar_url)&order=created_at.desc&%s", p.QueryFragment())
	if v := q.Get("verified"); v == "true" {
		filter += "&is_verified=eq.true"
	} else if v == "false" {
		filter += "&is_verified=eq.false"
	}
	result, err := h.sb.DB("GET", "trainers?"+filter, nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// POST /admin/trainers
func (h *Handler) CreateTrainer(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ProfileID      string   `json:"profile_id"`
		Bio            string   `json:"bio"`
		Specialties    []string `json:"specialties"`
		Certifications []string `json:"certifications"`
		YearsExperience int     `json:"years_experience"`
		HourlyRate     float64  `json:"hourly_rate"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	if req.ProfileID == "" {
		response.BadRequest(w, "profile_id is required")
		return
	}
	result, err := h.sb.DB("POST", "trainers", map[string]interface{}{
		"profile_id":       req.ProfileID,
		"bio":              req.Bio,
		"specialties":      req.Specialties,
		"certifications":   req.Certifications,
		"years_experience": req.YearsExperience,
		"hourly_rate":      req.HourlyRate,
		"is_verified":      false,
		"rating":           0,
	})
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.Created(w, result)
}

// GET /admin/trainers/{id}
func (h *Handler) GetTrainer(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	result, err := h.sb.DB("GET",
		"trainers?id=eq."+id+"&select=*,profiles(full_name,email,avatar_url,phone)", nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	items, _ := result.([]interface{})
	if len(items) == 0 {
		response.NotFound(w, "trainer not found")
		return
	}
	response.OK(w, items[0])
}

// PATCH /admin/trainers/{id}
func (h *Handler) UpdateTrainer(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	var req struct {
		Bio             string   `json:"bio,omitempty"`
		Specialties     []string `json:"specialties,omitempty"`
		Certifications  []string `json:"certifications,omitempty"`
		YearsExperience *int     `json:"years_experience,omitempty"`
		HourlyRate      *float64 `json:"hourly_rate,omitempty"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	payload := map[string]interface{}{}
	if req.Bio != "" {
		payload["bio"] = req.Bio
	}
	if len(req.Specialties) > 0 {
		payload["specialties"] = req.Specialties
	}
	if len(req.Certifications) > 0 {
		payload["certifications"] = req.Certifications
	}
	if req.YearsExperience != nil {
		payload["years_experience"] = *req.YearsExperience
	}
	if req.HourlyRate != nil {
		payload["hourly_rate"] = *req.HourlyRate
	}
	result, err := h.sb.DB("PATCH", "trainers?id=eq."+id, payload)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// DELETE /admin/trainers/{id}
func (h *Handler) DeleteTrainer(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	if _, err := h.sb.DB("DELETE", "trainers?id=eq."+id, nil); err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.NoContent(w)
}

// POST /admin/trainers/{id}/verify
func (h *Handler) VerifyTrainer(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	result, err := h.sb.DB("PATCH", "trainers?id=eq."+id, map[string]interface{}{"is_verified": true})
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// POST /admin/trainers/{id}/unverify
func (h *Handler) UnverifyTrainer(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	result, err := h.sb.DB("PATCH", "trainers?id=eq."+id, map[string]interface{}{"is_verified": false})
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}
