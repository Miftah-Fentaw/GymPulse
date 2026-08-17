// Package classes handles gym-class management (user_admin + super_admin).
package classes

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

// GET /admin/classes
func (h *Handler) ListClasses(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	p := pagination.Parse(r)
	filter := fmt.Sprintf("select=*,disciplines(name),trainers(profiles(full_name))&order=start_time.asc&%s", p.QueryFragment())
	if v := q.Get("discipline"); v != "" {
		filter += "&discipline_id=eq." + v
	}
	if v := q.Get("difficulty"); v != "" {
		filter += "&difficulty_level=eq." + v
	}
	if v := q.Get("status"); v != "" {
		filter += "&status=eq." + v
	}
	result, err := h.sb.DB("GET", "classes?"+filter, nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// POST /admin/classes
func (h *Handler) CreateClass(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Title           string  `json:"title"`
		Description     string  `json:"description"`
		DisciplineID    string  `json:"discipline_id"`
		TrainerID       string  `json:"trainer_id"`
		DifficultyLevel string  `json:"difficulty_level"`
		DurationMinutes int     `json:"duration_minutes"`
		MaxParticipants int     `json:"max_participants"`
		Price           float64 `json:"price"`
		StartTime       string  `json:"start_time"`
		EndTime         string  `json:"end_time"`
		Status          string  `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	if req.Title == "" || req.StartTime == "" {
		response.BadRequest(w, "title and start_time are required")
		return
	}
	if req.Status == "" {
		req.Status = "active"
	}
	result, err := h.sb.DB("POST", "classes", map[string]interface{}{
		"title":            req.Title,
		"description":      req.Description,
		"discipline_id":    req.DisciplineID,
		"trainer_id":       req.TrainerID,
		"difficulty_level": req.DifficultyLevel,
		"duration_minutes": req.DurationMinutes,
		"max_participants": req.MaxParticipants,
		"price":            req.Price,
		"start_time":       req.StartTime,
		"end_time":         req.EndTime,
		"status":           req.Status,
	})
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.Created(w, result)
}

// GET /admin/classes/{id}
func (h *Handler) GetClass(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	result, err := h.sb.DB("GET",
		"classes?id=eq."+id+"&select=*,disciplines(name),trainers(profiles(full_name,avatar_url))", nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	items, _ := result.([]interface{})
	if len(items) == 0 {
		response.NotFound(w, "class not found")
		return
	}
	response.OK(w, items[0])
}

// PATCH /admin/classes/{id}
func (h *Handler) UpdateClass(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	var req struct {
		Title           string   `json:"title,omitempty"`
		Description     string   `json:"description,omitempty"`
		TrainerID       string   `json:"trainer_id,omitempty"`
		DifficultyLevel string   `json:"difficulty_level,omitempty"`
		DurationMinutes *int     `json:"duration_minutes,omitempty"`
		MaxParticipants *int     `json:"max_participants,omitempty"`
		Price           *float64 `json:"price,omitempty"`
		StartTime       string   `json:"start_time,omitempty"`
		EndTime         string   `json:"end_time,omitempty"`
		Status          string   `json:"status,omitempty"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	payload := map[string]interface{}{}
	if req.Title != "" {
		payload["title"] = req.Title
	}
	if req.Description != "" {
		payload["description"] = req.Description
	}
	if req.TrainerID != "" {
		payload["trainer_id"] = req.TrainerID
	}
	if req.DifficultyLevel != "" {
		payload["difficulty_level"] = req.DifficultyLevel
	}
	if req.DurationMinutes != nil {
		payload["duration_minutes"] = *req.DurationMinutes
	}
	if req.MaxParticipants != nil {
		payload["max_participants"] = *req.MaxParticipants
	}
	if req.Price != nil {
		payload["price"] = *req.Price
	}
	if req.StartTime != "" {
		payload["start_time"] = req.StartTime
	}
	if req.EndTime != "" {
		payload["end_time"] = req.EndTime
	}
	if req.Status != "" {
		payload["status"] = req.Status
	}
	result, err := h.sb.DB("PATCH", "classes?id=eq."+id, payload)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// DELETE /admin/classes/{id}
func (h *Handler) DeleteClass(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	if _, err := h.sb.DB("DELETE", "classes?id=eq."+id, nil); err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.NoContent(w)
}

// POST /admin/classes/{id}/cancel
func (h *Handler) CancelClass(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	result, err := h.sb.DB("PATCH", "classes?id=eq."+id, map[string]interface{}{"status": "cancelled"})
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// GET /admin/classes/disciplines
func (h *Handler) ListDisciplines(w http.ResponseWriter, r *http.Request) {
	result, err := h.sb.DB("GET", "disciplines?select=*&order=name.asc", nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// GET /admin/classes/schedule  ?start_date=&end_date=
func (h *Handler) GetSchedule(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	filter := "classes?select=*,disciplines(name),trainers(profiles(full_name))&order=start_time.asc"
	if v := q.Get("start_date"); v != "" {
		filter += "&start_time=gte." + v
	}
	if v := q.Get("end_date"); v != "" {
		filter += "&start_time=lte." + v
	}
	result, err := h.sb.DB("GET", filter, nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}
