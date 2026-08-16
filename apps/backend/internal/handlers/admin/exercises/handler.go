// Package exercises provides CRUD handlers for workout exercises.
// Exercises belong to a workout and are managed by sport_admin / super_admin.
package exercises

import (
	"encoding/json"
	"fmt"
	"net/http"

	"gympulse/backend/internal/config"
	"gympulse/shared/middleware"
	"gympulse/shared/response"
	"gympulse/shared/supabase"
)

// Handler manages workout exercise resources.
type Handler struct {
	cfg *config.Config
	sb  *supabase.Client
}

// New creates a new exercises Handler.
func New(cfg *config.Config) *Handler {
	return &Handler{cfg: cfg, sb: supabase.New(cfg.SupabaseURL, cfg.SupabaseAnonKey, cfg.SupabaseServiceKey)}
}

type exerciseRequest struct {
	Name        string `json:"name"`
	Description string `json:"description,omitempty"`
	Sets        *int   `json:"sets,omitempty"`
	Reps        *int   `json:"reps,omitempty"`
	DurationSec *int   `json:"duration_sec,omitempty"`
	RestSec     *int   `json:"rest_sec,omitempty"`
	Order       int    `json:"order"`
	VideoURL    string `json:"video_url,omitempty"`
	ImageURL    string `json:"image_url,omitempty"`
}

// GET /admin/content/workouts/{workoutId}/exercises
func (h *Handler) ListExercises(w http.ResponseWriter, r *http.Request) {
	workoutID := middleware.URLParam(r, "workoutId")

	result, err := h.sb.DB("GET",
		fmt.Sprintf(`workout_exercises?workout_id=eq.%s&select=*&order="order".asc`, workoutID),
		nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// GET /admin/content/workouts/{workoutId}/exercises/{id}
func (h *Handler) GetExercise(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	workoutID := middleware.URLParam(r, "workoutId")

	result, err := h.sb.DB("GET",
		fmt.Sprintf("workout_exercises?id=eq.%s&workout_id=eq.%s&select=*", id, workoutID),
		nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	items, _ := result.([]interface{})
	if len(items) == 0 {
		response.NotFound(w, "exercise not found")
		return
	}
	response.OK(w, items[0])
}

// POST /admin/content/workouts/{workoutId}/exercises
func (h *Handler) CreateExercise(w http.ResponseWriter, r *http.Request) {
	workoutID := middleware.URLParam(r, "workoutId")

	var req exerciseRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	if req.Name == "" {
		response.BadRequest(w, "name is required")
		return
	}

	payload := map[string]interface{}{
		"workout_id":  workoutID,
		"name":        req.Name,
		"description": req.Description,
		"order":       req.Order,
		"video_url":   req.VideoURL,
		"image_url":   req.ImageURL,
	}
	if req.Sets != nil {
		payload["sets"] = *req.Sets
	}
	if req.Reps != nil {
		payload["reps"] = *req.Reps
	}
	if req.DurationSec != nil {
		payload["duration_sec"] = *req.DurationSec
	}
	if req.RestSec != nil {
		payload["rest_sec"] = *req.RestSec
	}

	result, err := h.sb.DB("POST", "workout_exercises", payload)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.Created(w, result)
}

// PATCH /admin/content/workouts/{workoutId}/exercises/{id}
func (h *Handler) UpdateExercise(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	workoutID := middleware.URLParam(r, "workoutId")

	var req exerciseRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}

	payload := map[string]interface{}{}
	if req.Name != "" {
		payload["name"] = req.Name
	}
	if req.Description != "" {
		payload["description"] = req.Description
	}
	if req.Sets != nil {
		payload["sets"] = *req.Sets
	}
	if req.Reps != nil {
		payload["reps"] = *req.Reps
	}
	if req.DurationSec != nil {
		payload["duration_sec"] = *req.DurationSec
	}
	if req.RestSec != nil {
		payload["rest_sec"] = *req.RestSec
	}
	if req.VideoURL != "" {
		payload["video_url"] = req.VideoURL
	}
	if req.ImageURL != "" {
		payload["image_url"] = req.ImageURL
	}
	payload["order"] = req.Order

	result, err := h.sb.DB("PATCH",
		fmt.Sprintf("workout_exercises?id=eq.%s&workout_id=eq.%s", id, workoutID),
		payload)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// DELETE /admin/content/workouts/{workoutId}/exercises/{id}
func (h *Handler) DeleteExercise(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	workoutID := middleware.URLParam(r, "workoutId")

	if _, err := h.sb.DB("DELETE",
		fmt.Sprintf("workout_exercises?id=eq.%s&workout_id=eq.%s", id, workoutID),
		nil); err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.NoContent(w)
}

// PATCH /admin/content/workouts/{workoutId}/exercises/reorder
// Body: { order: [{id, order}] }
func (h *Handler) ReorderExercises(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Order []struct {
			ID    string `json:"id"`
			Order int    `json:"order"`
		} `json:"order"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	for _, item := range req.Order {
		if _, err := h.sb.DB("PATCH",
			fmt.Sprintf("workout_exercises?id=eq.%s", item.ID),
			map[string]interface{}{"order": item.Order}); err != nil {
			response.InternalError(w, err.Error())
			return
		}
	}
	response.Message(w, "exercise order updated")
}
