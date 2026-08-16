// Package content provides public read-only content endpoints for the mobile app.
// No authentication required — only published content is returned.
package content

import (
	"fmt"
	"net/http"

	"gympulse/backend/internal/config"
	"gympulse/shared/middleware"
	"gympulse/shared/pagination"
	"gympulse/shared/response"
	"gympulse/shared/supabase"
)

// Handler serves public content to the mobile app.
type Handler struct {
	cfg *config.Config
	sb  *supabase.Client
}

// New creates a new mobile content Handler.
func New(cfg *config.Config) *Handler {
	return &Handler{cfg: cfg, sb: supabase.New(cfg.SupabaseURL, cfg.SupabaseAnonKey, cfg.SupabaseServiceKey)}
}

// GET /content
// Returns published content posts with optional type filter.
// Query params: type, category_id, page, per_page
func (h *Handler) ListContent(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	p := pagination.Parse(r)

	filter := fmt.Sprintf("select=*,content_media(id,type,url,order),content_categories(name)&is_published=eq.true&order=published_at.desc&%s",
		p.QueryFragment())

	if t := q.Get("type"); t != "" {
		filter += "&content_type=eq." + t
	}
	if cat := q.Get("category_id"); cat != "" {
		filter += "&category_id=eq." + cat
	}

	result, err := h.sb.DB("GET", "content_posts?"+filter, nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// GET /content/{id}
// Returns a single published content post with all media blocks.
func (h *Handler) GetContent(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")

	result, err := h.sb.DB("GET",
		fmt.Sprintf("content_posts?id=eq.%s&is_published=eq.true&select=*,content_media(*),content_categories(name)", id),
		nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	items, _ := result.([]interface{})
	if len(items) == 0 {
		response.NotFound(w, "content not found")
		return
	}
	response.OK(w, items[0])
}

// GET /content/categories
// Returns all content categories.
func (h *Handler) ListCategories(w http.ResponseWriter, r *http.Request) {
	result, err := h.sb.DB("GET", "content_categories?select=*&order=name.asc", nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// GET /workouts
// Returns published workouts with optional filters.
// Query params: difficulty, category_id, page, per_page
func (h *Handler) ListWorkouts(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	p := pagination.Parse(r)

	filter := fmt.Sprintf("select=*,workout_categories(name)&is_published=eq.true&order=created_at.desc&%s",
		p.QueryFragment())

	if d := q.Get("difficulty"); d != "" {
		filter += "&difficulty=eq." + d
	}
	if cat := q.Get("category_id"); cat != "" {
		filter += "&category_id=eq." + cat
	}

	result, err := h.sb.DB("GET", "workouts?"+filter, nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// GET /workouts/{id}
// Returns a single published workout with its exercise list.
func (h *Handler) GetWorkout(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")

	result, err := h.sb.DB("GET",
		fmt.Sprintf("workouts?id=eq.%s&is_published=eq.true&select=*,workout_exercises(*)&order=workout_exercises(order).asc", id),
		nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	items, _ := result.([]interface{})
	if len(items) == 0 {
		response.NotFound(w, "workout not found")
		return
	}
	response.OK(w, items[0])
}

// GET /workouts/categories
// Returns all workout categories.
func (h *Handler) ListWorkoutCategories(w http.ResponseWriter, r *http.Request) {
	result, err := h.sb.DB("GET", "workout_categories?select=*&order=name.asc", nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// GET /programs
// Returns published fitness programs.
// Query params: difficulty, category_id, page, per_page
func (h *Handler) ListPrograms(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	p := pagination.Parse(r)

	filter := fmt.Sprintf("select=*,workout_categories(name)&is_published=eq.true&order=created_at.desc&%s",
		p.QueryFragment())

	if d := q.Get("difficulty"); d != "" {
		filter += "&difficulty=eq." + d
	}
	if cat := q.Get("category_id"); cat != "" {
		filter += "&category_id=eq." + cat
	}

	result, err := h.sb.DB("GET", "programs?"+filter, nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// GET /programs/{id}
// Returns a single published program with its full weekly workout schedule.
func (h *Handler) GetProgram(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")

	result, err := h.sb.DB("GET",
		fmt.Sprintf("programs?id=eq.%s&is_published=eq.true&select=*,program_workouts(*,workouts(id,title,duration_mins,difficulty,thumbnail_url))", id),
		nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	items, _ := result.([]interface{})
	if len(items) == 0 {
		response.NotFound(w, "program not found")
		return
	}
	response.OK(w, items[0])
}

// GET /announcements
// Returns active (non-expired) announcements targeted at all users.
func (h *Handler) ListAnnouncements(w http.ResponseWriter, r *http.Request) {
	// Return announcements for 'all' or 'users' audience that haven't expired.
	filter := "select=id,title,message,tags,created_at" +
		"&audience=in.(all,users)" +
		"&or=(expires_at.is.null,expires_at.gt.now())" +
		"&order=created_at.desc" +
		"&" + pagination.Parse(r).QueryFragment()

	result, err := h.sb.DB("GET", "announcements?"+filter, nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}
