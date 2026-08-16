// Package profile handles authenticated user profile endpoints for the mobile app.
package profile

import (
	"encoding/json"
	"net/http"

	"gympulse/backend/internal/config"
	"gympulse/shared/middleware"
	"gympulse/shared/response"
	"gympulse/shared/storage"
	"gympulse/shared/supabase"
)

const maxAvatarSize = 10 << 20 // 10 MB

// Handler manages user profile operations.
type Handler struct {
	cfg      *config.Config
	sb       *supabase.Client
	uploader *storage.Uploader
}

// New creates a new profile Handler.
func New(cfg *config.Config) *Handler {
	sb := supabase.New(cfg.SupabaseURL, cfg.SupabaseAnonKey, cfg.SupabaseServiceKey)
	return &Handler{
		cfg:      cfg,
		sb:       sb,
		uploader: storage.New(sb, "avatars", "avatars"),
	}
}

// GET /profile
// Returns the authenticated user's profile row.
func (h *Handler) GetProfile(w http.ResponseWriter, r *http.Request) {
	uid := middleware.UserID(r.Context())
	result, err := h.sb.DB("GET", "profiles?id=eq."+uid+"&select=*", nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	items, _ := result.([]interface{})
	if len(items) == 0 {
		response.NotFound(w, "profile not found")
		return
	}
	response.OK(w, items[0])
}

// PATCH /profile
// Updates the authenticated user's profile fields.
func (h *Handler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	uid := middleware.UserID(r.Context())

	var req struct {
		FullName    string `json:"full_name,omitempty"`
		Phone       string `json:"phone,omitempty"`
		DateOfBirth string `json:"date_of_birth,omitempty"` // YYYY-MM-DD
		Gender      string `json:"gender,omitempty"`
		Bio         string `json:"bio,omitempty"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}

	payload := map[string]interface{}{"updated_at": "now()"}
	if req.FullName != "" {
		payload["full_name"] = req.FullName
	}
	if req.Phone != "" {
		payload["phone"] = req.Phone
	}
	if req.DateOfBirth != "" {
		payload["date_of_birth"] = req.DateOfBirth
	}
	if req.Gender != "" {
		valid := map[string]bool{"male": true, "female": true, "other": true, "prefer_not_to_say": true}
		if !valid[req.Gender] {
			response.BadRequest(w, "gender must be male, female, other, or prefer_not_to_say")
			return
		}
		payload["gender"] = req.Gender
	}
	if req.Bio != "" {
		payload["bio"] = req.Bio
	}

	result, err := h.sb.DB("PATCH", "profiles?id=eq."+uid, payload)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// POST /profile/avatar
// Uploads a new avatar image and updates the profile.
func (h *Handler) UploadAvatar(w http.ResponseWriter, r *http.Request) {
	uid := middleware.UserID(r.Context())

	results, err := h.uploader.UploadFromRequest(r, "file", storage.AllowedImages, maxAvatarSize)
	if err != nil {
		response.BadRequest(w, err.Error())
		return
	}

	avatarURL := results[0].URL

	// Update the profile row with the new avatar URL.
	if _, err := h.sb.DB("PATCH", "profiles?id=eq."+uid,
		map[string]interface{}{"avatar_url": avatarURL}); err != nil {
		response.InternalError(w, err.Error())
		return
	}

	// Also sync to Supabase Auth user metadata.
	token := bearerToken(r)
	if token != "" {
		_, _ = h.sb.AuthRequest("PUT", "/auth/v1/user",
			map[string]interface{}{"data": map[string]interface{}{"avatar_url": avatarURL}}, token)
	}

	response.OK(w, map[string]string{"avatar_url": avatarURL})
}

func bearerToken(r *http.Request) string {
	h := r.Header.Get("Authorization")
	if len(h) > 7 && h[:7] == "Bearer " {
		return h[7:]
	}
	return ""
}
