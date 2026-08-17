// Package system handles platform-level configuration (super_admin only).
package system

import (
	"encoding/json"
	"net/http"

	"gympulse/shared/middleware"
	"gympulse/shared/response"
)

// ─── Locations ────────────────────────────────────────────────────────────────

// GET /admin/system/locations
func (h *Handler) ListLocations(w http.ResponseWriter, r *http.Request) {
	result, err := h.sb.DB("GET", "gym_locations?select=*&order=name.asc", nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// POST /admin/system/locations
func (h *Handler) CreateLocation(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name     string `json:"name"`
		City     string `json:"city"`
		Country  string `json:"country"`
		Address  string `json:"address"`
		Capacity int    `json:"capacity"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Name == "" {
		response.BadRequest(w, "name is required")
		return
	}
	result, err := h.sb.DB("POST", "gym_locations", map[string]interface{}{
		"name":     req.Name,
		"city":     req.City,
		"country":  req.Country,
		"address":  req.Address,
		"capacity": req.Capacity,
		"is_active": true,
	})
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.Created(w, result)
}

// PATCH /admin/system/locations/{id}
func (h *Handler) UpdateLocation(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	var req struct {
		Name     string `json:"name,omitempty"`
		City     string `json:"city,omitempty"`
		Country  string `json:"country,omitempty"`
		Address  string `json:"address,omitempty"`
		Capacity *int   `json:"capacity,omitempty"`
		IsActive *bool  `json:"is_active,omitempty"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	payload := map[string]interface{}{}
	if req.Name != "" { payload["name"] = req.Name }
	if req.City != "" { payload["city"] = req.City }
	if req.Country != "" { payload["country"] = req.Country }
	if req.Address != "" { payload["address"] = req.Address }
	if req.Capacity != nil { payload["capacity"] = *req.Capacity }
	if req.IsActive != nil { payload["is_active"] = *req.IsActive }
	result, err := h.sb.DB("PATCH", "gym_locations?id=eq."+id, payload)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// DELETE /admin/system/locations/{id}
func (h *Handler) DeleteLocation(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	if _, err := h.sb.DB("DELETE", "gym_locations?id=eq."+id, nil); err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.NoContent(w)
}

// ─── Disciplines ──────────────────────────────────────────────────────────────

// GET /admin/system/disciplines
func (h *Handler) ListDisciplines(w http.ResponseWriter, r *http.Request) {
	result, err := h.sb.DB("GET", "disciplines?select=*&order=name.asc", nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// POST /admin/system/disciplines
func (h *Handler) CreateDiscipline(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name     string `json:"name"`
		Slug     string `json:"slug"`
		Color    string `json:"color"`
		IsActive bool   `json:"is_active"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Name == "" || req.Slug == "" {
		response.BadRequest(w, "name and slug are required")
		return
	}
	result, err := h.sb.DB("POST", "disciplines", map[string]interface{}{
		"name":      req.Name,
		"slug":      req.Slug,
		"color":     req.Color,
		"is_active": req.IsActive,
	})
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.Created(w, result)
}

// PATCH /admin/system/disciplines/{id}
func (h *Handler) UpdateDiscipline(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	var req struct {
		Name     string `json:"name,omitempty"`
		Slug     string `json:"slug,omitempty"`
		Color    string `json:"color,omitempty"`
		IsActive *bool  `json:"is_active,omitempty"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	payload := map[string]interface{}{}
	if req.Name != "" { payload["name"] = req.Name }
	if req.Slug != "" { payload["slug"] = req.Slug }
	if req.Color != "" { payload["color"] = req.Color }
	if req.IsActive != nil { payload["is_active"] = *req.IsActive }
	result, err := h.sb.DB("PATCH", "disciplines?id=eq."+id, payload)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// DELETE /admin/system/disciplines/{id}
func (h *Handler) DeleteDiscipline(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	if _, err := h.sb.DB("DELETE", "disciplines?id=eq."+id, nil); err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.NoContent(w)
}
