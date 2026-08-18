// Package content handles sport/fitness content management (sport_admin + super_admin).
// Content posts support mixed media: images, videos, and text blocks.
package content

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"gympulse/backend/internal/config"
	"gympulse/shared/middleware"
	"gympulse/shared/pagination"
	"gympulse/shared/response"
	"gympulse/shared/storage"
	"gympulse/shared/supabase"
)

const maxUpload = 200 << 20 // 200 MB

type Handler struct {
	cfg *config.Config
	sb  *supabase.Client
}

func New(cfg *config.Config) *Handler {
	sb := supabase.New(cfg.SupabaseURL, cfg.SupabaseAnonKey, cfg.SupabaseServiceKey)
	return &Handler{
		cfg: cfg,
		sb:  sb,
	}
}

// ─── Content CRUD ─────────────────────────────────────────────────────────────

// GET /admin/content
func (h *Handler) ListContent(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	uid := middleware.UserID(r.Context())
	role := middleware.UserRole(r.Context())
	p := pagination.Parse(r)

	filter := fmt.Sprintf("select=*,content_media(id,type,url,order)&order=created_at.desc&%s", p.QueryFragment())
	if role == middleware.RoleSportAdmin {
		filter += "&created_by=eq." + uid
	}
	if discID := q.Get("discipline_id"); discID != "" {
		filter += "&discipline_id=eq." + discID
	}
	if ct := q.Get("type"); ct != "" {
		filter += "&content_type=eq." + ct
	}
	if pub := q.Get("published"); pub == "true" {
		filter += "&is_published=eq.true"
	} else if pub == "false" {
		filter += "&is_published=eq.false"
	}

	result, err := h.sb.DB("GET", "content_posts?"+filter, nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// GET /admin/content/{id}
func (h *Handler) GetContent(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	result, err := h.sb.DB("GET", "content_posts?id=eq."+id+"&select=*,content_media(*)", nil)
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

// POST /admin/content
func (h *Handler) CreateContent(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Title        string   `json:"title"`
		Description  string   `json:"description"`
		ContentType  string   `json:"content_type"`
		Tags         []string `json:"tags"`
		CategoryID   string   `json:"category_id"`
		DisciplineID string   `json:"discipline_id"`
		IsPublished  bool     `json:"is_published"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	if req.Title == "" {
		response.BadRequest(w, "title is required")
		return
	}
	validTypes := map[string]bool{"article": true, "workout": true, "program": true, "tip": true, "announcement": true}
	if !validTypes[req.ContentType] {
		response.BadRequest(w, "content_type must be one of: article, workout, program, tip, announcement")
		return
	}

	payload := map[string]interface{}{
		"title":        req.Title,
		"description":  req.Description,
		"content_type": req.ContentType,
		"tags":         req.Tags,
		"category_id":  req.CategoryID,
		"is_published": req.IsPublished,
		"created_by":   middleware.UserID(r.Context()),
	}
	if req.DisciplineID != "" {
		payload["discipline_id"] = req.DisciplineID
	}

	result, err := h.sb.DB("POST", "content_posts", payload)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.Created(w, result)
}

// PATCH /admin/content/{id}
func (h *Handler) UpdateContent(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	uid := middleware.UserID(r.Context())
	role := middleware.UserRole(r.Context())

	var req struct {
		Title       string   `json:"title,omitempty"`
		Description string   `json:"description,omitempty"`
		ContentType string   `json:"content_type,omitempty"`
		Tags        []string `json:"tags,omitempty"`
		CategoryID  string   `json:"category_id,omitempty"`
		IsPublished *bool    `json:"is_published,omitempty"`
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
	if req.ContentType != "" {
		payload["content_type"] = req.ContentType
	}
	if len(req.Tags) > 0 {
		payload["tags"] = req.Tags
	}
	if req.CategoryID != "" {
		payload["category_id"] = req.CategoryID
	}
	if req.IsPublished != nil {
		payload["is_published"] = *req.IsPublished
	}

	filter := "content_posts?id=eq." + id
	if role == middleware.RoleSportAdmin {
		filter += "&created_by=eq." + uid
	}
	result, err := h.sb.DB("PATCH", filter, payload)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// DELETE /admin/content/{id}
func (h *Handler) DeleteContent(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	uid := middleware.UserID(r.Context())
	role := middleware.UserRole(r.Context())

	// Delete media blocks first (cascade also handles this via DB but be explicit).
	_, _ = h.sb.DB("DELETE", "content_media?content_post_id=eq."+id, nil)

	filter := "content_posts?id=eq." + id
	if role == middleware.RoleSportAdmin {
		filter += "&created_by=eq." + uid
	}
	if _, err := h.sb.DB("DELETE", filter, nil); err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.NoContent(w)
}

// POST /admin/content/{id}/publish
func (h *Handler) PublishContent(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	result, err := h.sb.DB("PATCH", "content_posts?id=eq."+id,
		map[string]interface{}{"is_published": true})
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// POST /admin/content/{id}/unpublish
func (h *Handler) UnpublishContent(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	result, err := h.sb.DB("PATCH", "content_posts?id=eq."+id,
		map[string]interface{}{"is_published": false})
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// ─── Media ────────────────────────────────────────────────────────────────────

// POST /admin/content/{id}/media  (multipart/form-data)
// Accepts any number of image/video file fields plus optional JSON "text_blocks".
func (h *Handler) UploadMedia(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	if err := r.ParseMultipartForm(maxUpload); err != nil {
		response.BadRequest(w, "failed to parse form: "+err.Error())
		return
	}

	uploader := storage.New(h.sb, h.cfg.SportContentBucket, id)
	uploaded := 0

	for _, headers := range r.MultipartForm.File {
		for _, fh := range headers {
			res, err := uploader.UploadFile(fh, append(storage.AllowedImages, storage.AllowedVideos...))
			if err != nil {
				response.InternalError(w, "upload failed: "+err.Error())
				return
			}
			mediaType := detectType(res.MimeType)
			if err := h.saveMediaRow(id, mediaType, res.URL, "", "", res.MimeType, 0); err != nil {
				response.InternalError(w, err.Error())
				return
			}
			uploaded++
		}
	}

	// Text blocks as JSON array in a form field.
	if raw := r.FormValue("text_blocks"); raw != "" {
		var blocks []struct {
			Text    string `json:"text"`
			Caption string `json:"caption"`
			Order   int    `json:"order"`
		}
		if err := json.Unmarshal([]byte(raw), &blocks); err == nil {
			for _, b := range blocks {
				if b.Text == "" {
					continue
				}
				if err := h.saveMediaRow(id, "text", "", b.Text, b.Caption, "", b.Order); err != nil {
					response.InternalError(w, err.Error())
					return
				}
				uploaded++
			}
		}
	}

	if uploaded == 0 {
		response.BadRequest(w, "no media or text blocks provided")
		return
	}
	response.Created(w, map[string]interface{}{"uploaded": uploaded})
}

// POST /admin/content/{id}/text-block
func (h *Handler) AddTextBlock(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	var req struct {
		Text    string `json:"text"`
		Caption string `json:"caption"`
		Order   int    `json:"order"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Text == "" {
		response.BadRequest(w, "text is required")
		return
	}
	if err := h.saveMediaRow(id, "text", "", req.Text, req.Caption, "", req.Order); err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.Created(w, map[string]interface{}{"type": "text", "text": req.Text})
}

// DELETE /admin/content/{id}/media/{mediaId}
func (h *Handler) DeleteMedia(w http.ResponseWriter, r *http.Request) {
	mediaID := middleware.URLParam(r, "mediaId")
	if _, err := h.sb.DB("DELETE", "content_media?id=eq."+mediaID, nil); err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.NoContent(w)
}

// PATCH /admin/content/{id}/media/reorder
func (h *Handler) ReorderMedia(w http.ResponseWriter, r *http.Request) {
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
		if _, err := h.sb.DB("PATCH", "content_media?id=eq."+item.ID,
			map[string]interface{}{"order": item.Order}); err != nil {
			response.InternalError(w, err.Error())
			return
		}
	}
	response.Message(w, "order updated")
}

// ─── Content Categories ───────────────────────────────────────────────────────

// GET /admin/content/categories
func (h *Handler) ListContentCategories(w http.ResponseWriter, r *http.Request) {
	result, err := h.sb.DB("GET", "content_categories?select=*&order=name.asc", nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// POST /admin/content/categories  (super_admin only)
func (h *Handler) CreateContentCategory(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name         string `json:"name"`
		Description  string `json:"description"`
		Slug         string `json:"slug"`
		DisciplineID string `json:"discipline_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Name == "" || req.Slug == "" {
		response.BadRequest(w, "name and slug are required")
		return
	}
	payload := map[string]interface{}{"name": req.Name, "description": req.Description, "slug": req.Slug}
	if req.DisciplineID != "" {
		payload["discipline_id"] = req.DisciplineID
	}
	result, err := h.sb.DB("POST", "content_categories", payload)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.Created(w, result)
}

// DELETE /admin/content/categories/{id}
func (h *Handler) DeleteContentCategory(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	if _, err := h.sb.DB("DELETE", "content_categories?id=eq."+id, nil); err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.NoContent(w)
}

// ─── Sport-specific content (workouts, programs) ──────────────────────────────

// GET /admin/content/workouts
func (h *Handler) ListWorkouts(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	uid := middleware.UserID(r.Context())
	role := middleware.UserRole(r.Context())
	p := pagination.Parse(r)

	filter := fmt.Sprintf("select=*,workout_categories(name)&order=created_at.desc&%s", p.QueryFragment())
	if role == middleware.RoleSportAdmin {
		filter += "&created_by=eq." + uid
	}
	if discID := q.Get("discipline_id"); discID != "" {
		filter += "&discipline_id=eq." + discID
	}
	if d := q.Get("difficulty"); d != "" {
		filter += "&difficulty=eq." + d
	}
	if pub := q.Get("published"); pub == "true" {
		filter += "&is_published=eq.true"
	}
	result, err := h.sb.DB("GET", "workouts?"+filter, nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// GET /admin/content/workouts/{id}
func (h *Handler) GetWorkout(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	result, err := h.sb.DB("GET",
		fmt.Sprintf("workouts?id=eq.%s&select=*,workout_exercises(*)", id), nil)
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

// POST /admin/content/workouts
func (h *Handler) CreateWorkout(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Title        string   `json:"title"`
		Description  string   `json:"description"`
		DurationMins int      `json:"duration_mins"`
		Difficulty   string   `json:"difficulty"`
		CategoryID   string   `json:"category_id"`
		DisciplineID string   `json:"discipline_id"`
		Tags         []string `json:"tags"`
		ThumbnailURL string   `json:"thumbnail_url"`
		VideoURL     string   `json:"video_url"`
		IsPublished  bool     `json:"is_published"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Title == "" {
		response.BadRequest(w, "title is required")
		return
	}
	payload := map[string]interface{}{
		"title": req.Title, "description": req.Description,
		"duration_mins": req.DurationMins, "difficulty": req.Difficulty,
		"category_id": req.CategoryID, "tags": req.Tags,
		"thumbnail_url": req.ThumbnailURL, "video_url": req.VideoURL,
		"is_published": req.IsPublished,
		"created_by":   middleware.UserID(r.Context()),
	}
	if req.DisciplineID != "" {
		payload["discipline_id"] = req.DisciplineID
	}
	result, err := h.sb.DB("POST", "workouts", payload)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.Created(w, result)
}

// PATCH /admin/content/workouts/{id}
func (h *Handler) UpdateWorkout(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	uid := middleware.UserID(r.Context())
	role := middleware.UserRole(r.Context())

	var req map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	filter := "workouts?id=eq." + id
	if role == middleware.RoleSportAdmin {
		filter += "&created_by=eq." + uid
	}
	result, err := h.sb.DB("PATCH", filter, req)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// DELETE /admin/content/workouts/{id}
func (h *Handler) DeleteWorkout(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	uid := middleware.UserID(r.Context())
	role := middleware.UserRole(r.Context())

	filter := "workouts?id=eq." + id
	if role == middleware.RoleSportAdmin {
		filter += "&created_by=eq." + uid
	}
	if _, err := h.sb.DB("DELETE", filter, nil); err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.NoContent(w)
}

// POST /admin/content/workouts/{id}/publish
func (h *Handler) PublishWorkout(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	result, err := h.sb.DB("PATCH", "workouts?id=eq."+id, map[string]interface{}{"is_published": true})
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// POST /admin/content/workouts/{id}/unpublish
func (h *Handler) UnpublishWorkout(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	result, err := h.sb.DB("PATCH", "workouts?id=eq."+id, map[string]interface{}{"is_published": false})
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// GET /admin/content/programs
func (h *Handler) ListPrograms(w http.ResponseWriter, r *http.Request) {
	uid := middleware.UserID(r.Context())
	role := middleware.UserRole(r.Context())
	p := pagination.Parse(r)

	filter := fmt.Sprintf("select=*&order=created_at.desc&%s", p.QueryFragment())
	if role == middleware.RoleSportAdmin {
		filter += "&created_by=eq." + uid
	}
	result, err := h.sb.DB("GET", "programs?"+filter, nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// GET /admin/content/programs/{id}
func (h *Handler) GetProgram(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	result, err := h.sb.DB("GET",
		fmt.Sprintf("programs?id=eq.%s&select=*,program_workouts(*,workouts(title,duration_mins,difficulty))", id), nil)
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

// POST /admin/content/programs
func (h *Handler) CreateProgram(w http.ResponseWriter, r *http.Request) {
	var req map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	if _, ok := req["title"]; !ok {
		response.BadRequest(w, "title is required")
		return
	}
	req["created_by"] = middleware.UserID(r.Context())
	result, err := h.sb.DB("POST", "programs", req)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.Created(w, result)
}

// PATCH /admin/content/programs/{id}
func (h *Handler) UpdateProgram(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	uid := middleware.UserID(r.Context())
	role := middleware.UserRole(r.Context())

	var req map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	filter := "programs?id=eq." + id
	if role == middleware.RoleSportAdmin {
		filter += "&created_by=eq." + uid
	}
	result, err := h.sb.DB("PATCH", filter, req)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// DELETE /admin/content/programs/{id}
func (h *Handler) DeleteProgram(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	uid := middleware.UserID(r.Context())
	role := middleware.UserRole(r.Context())

	_, _ = h.sb.DB("DELETE", "program_workouts?program_id=eq."+id, nil)

	filter := "programs?id=eq." + id
	if role == middleware.RoleSportAdmin {
		filter += "&created_by=eq." + uid
	}
	if _, err := h.sb.DB("DELETE", filter, nil); err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.NoContent(w)
}

// POST /admin/content/programs/{id}/publish
func (h *Handler) PublishProgram(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	result, err := h.sb.DB("PATCH", "programs?id=eq."+id, map[string]interface{}{"is_published": true})
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// POST /admin/content/programs/{id}/unpublish
func (h *Handler) UnpublishProgram(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	result, err := h.sb.DB("PATCH", "programs?id=eq."+id, map[string]interface{}{"is_published": false})
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// POST /admin/content/programs/{id}/workouts
func (h *Handler) AddWorkoutToProgram(w http.ResponseWriter, r *http.Request) {
	programID := middleware.URLParam(r, "id")
	var req struct {
		WorkoutID string `json:"workout_id"`
		WeekNum   int    `json:"week_num"`
		DayNum    int    `json:"day_num"`
		Order     int    `json:"order"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.WorkoutID == "" {
		response.BadRequest(w, "workout_id is required")
		return
	}
	result, err := h.sb.DB("POST", "program_workouts", map[string]interface{}{
		"program_id": programID, "workout_id": req.WorkoutID,
		"week_num": req.WeekNum, "day_num": req.DayNum, "order": req.Order,
	})
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.Created(w, result)
}

// DELETE /admin/content/programs/{id}/workouts/{workoutId}
func (h *Handler) RemoveWorkoutFromProgram(w http.ResponseWriter, r *http.Request) {
	programID := middleware.URLParam(r, "id")
	workoutID := middleware.URLParam(r, "workoutId")
	if _, err := h.sb.DB("DELETE",
		fmt.Sprintf("program_workouts?program_id=eq.%s&workout_id=eq.%s", programID, workoutID), nil); err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.NoContent(w)
}

// GET /admin/content/workout-categories
func (h *Handler) ListWorkoutCategories(w http.ResponseWriter, r *http.Request) {
	result, err := h.sb.DB("GET", "workout_categories?select=*&order=name.asc", nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// POST /admin/content/workout-categories  (super_admin only)
func (h *Handler) CreateWorkoutCategory(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name        string `json:"name"`
		Description string `json:"description"`
		Slug        string `json:"slug"`
		IconURL     string `json:"icon_url"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Name == "" {
		response.BadRequest(w, "name is required")
		return
	}
	result, err := h.sb.DB("POST", "workout_categories", map[string]interface{}{
		"name": req.Name, "description": req.Description,
		"slug": req.Slug, "icon_url": req.IconURL,
		"created_by": middleware.UserID(r.Context()),
	})
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.Created(w, result)
}

// DELETE /admin/content/workout-categories/{id}
func (h *Handler) DeleteWorkoutCategory(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	if _, err := h.sb.DB("DELETE", "workout_categories?id=eq."+id, nil); err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.NoContent(w)
}

// POST /admin/content/media/upload/image
// POST /admin/content/media/upload/video
func (h *Handler) UploadFile(w http.ResponseWriter, r *http.Request) {
	mediaType := middleware.URLParam(r, "type") // "image" or "video"

	allowed := map[string][]string{
		"image": storage.AllowedImages,
		"video": storage.AllowedVideos,
	}
	mimes, ok := allowed[mediaType]
	if !ok {
		response.BadRequest(w, "type must be image or video")
		return
	}

	uploader := storage.New(h.sb, h.cfg.SportContentBucket, mediaType+"/"+middleware.UserID(r.Context()))
	results, err := uploader.UploadFromRequest(r, "file", mimes, maxUpload)
	if err != nil {
		response.BadRequest(w, err.Error())
		return
	}

	response.Created(w, results[0])
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

func (h *Handler) saveMediaRow(postID, mediaType, url, text, caption, mime string, order int) error {
	_, err := h.sb.DB("POST", "content_media", map[string]interface{}{
		"content_post_id": postID,
		"type":            mediaType,
		"url":             url,
		"text":            text,
		"caption":         caption,
		"mime_type":       mime,
		"order":           order,
	})
	return err
}

func detectType(mime string) string {
	switch {
	case strings.HasPrefix(mime, "image/"):
		return "image"
	case strings.HasPrefix(mime, "video/"):
		return "video"
	default:
		return "file"
	}
}
