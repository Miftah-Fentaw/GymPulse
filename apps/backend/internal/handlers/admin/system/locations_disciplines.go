// Package system handles platform-level configuration and discipline management.
package system

import (
	"encoding/json"
	"fmt"
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
		"name":      req.Name,
		"city":      req.City,
		"country":   req.Country,
		"address":   req.Address,
		"capacity":  req.Capacity,
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

// GET /admin/disciplines
func (h *Handler) ListDisciplines(w http.ResponseWriter, r *http.Request) {
	result, err := h.sb.DB("GET", "disciplines?select=*&order=name.asc", nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// GET /admin/my-disciplines
func (h *Handler) GetMyDisciplines(w http.ResponseWriter, r *http.Request) {
	uid := middleware.UserID(r.Context())
	role := middleware.UserRole(r.Context())

	// Super admins have access to all disciplines
	if role == middleware.RoleSuperAdmin {
		result, err := h.sb.DB("GET", "disciplines?select=*&order=name.asc", nil)
		if err != nil {
			response.InternalError(w, err.Error())
			return
		}
		response.OK(w, result)
		return
	}

	// Fetch disciplines assigned to this admin in admin_disciplines
	query := fmt.Sprintf("admin_disciplines?admin_id=eq.%s&select=disciplines(*)", uid)
	result, err := h.sb.DB("GET", query, nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}

	// Flatten nested discipline objects
	items, ok := result.([]interface{})
	if !ok {
		response.OK(w, []interface{}{})
		return
	}

	disciplines := make([]interface{}, 0, len(items))
	for _, item := range items {
		if m, ok := item.(map[string]interface{}); ok {
			if disc, ok := m["disciplines"]; ok && disc != nil {
				disciplines = append(disciplines, disc)
			}
		}
	}
	response.OK(w, disciplines)
}

// POST /admin/system/disciplines
func (h *Handler) CreateDiscipline(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name        string `json:"name"`
		Slug        string `json:"slug"`
		Description string `json:"description"`
		Color       string `json:"color"`
		Icon        string `json:"icon"`
		IsActive    bool   `json:"is_active"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Name == "" || req.Slug == "" {
		response.BadRequest(w, "name and slug are required")
		return
	}
	result, err := h.sb.DB("POST", "disciplines", map[string]interface{}{
		"name":        req.Name,
		"slug":        req.Slug,
		"description": req.Description,
		"color":       req.Color,
		"icon":        req.Icon,
		"is_active":   req.IsActive,
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
		Name        string `json:"name,omitempty"`
		Slug        string `json:"slug,omitempty"`
		Description string `json:"description,omitempty"`
		Color       string `json:"color,omitempty"`
		Icon        string `json:"icon,omitempty"`
		IsActive    *bool  `json:"is_active,omitempty"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	payload := map[string]interface{}{}
	if req.Name != "" { payload["name"] = req.Name }
	if req.Slug != "" { payload["slug"] = req.Slug }
	if req.Description != "" { payload["description"] = req.Description }
	if req.Color != "" { payload["color"] = req.Color }
	if req.Icon != "" { payload["icon"] = req.Icon }
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

// ─── Admin Discipline Mapping ──────────────────────────────────────────────────

// GET /admin/admins/{id}/disciplines
func (h *Handler) ListAdminDisciplines(w http.ResponseWriter, r *http.Request) {
	adminID := middleware.URLParam(r, "id")
	result, err := h.sb.DB("GET", fmt.Sprintf("admin_disciplines?admin_id=eq.%s&select=*,disciplines(*)", adminID), nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// POST /admin/admins/{id}/disciplines
func (h *Handler) AssignAdminDiscipline(w http.ResponseWriter, r *http.Request) {
	adminID := middleware.URLParam(r, "id")
	var req struct {
		DisciplineID string `json:"discipline_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.DisciplineID == "" {
		response.BadRequest(w, "discipline_id is required")
		return
	}
	result, err := h.sb.DB("POST", "admin_disciplines", map[string]interface{}{
		"admin_id":      adminID,
		"discipline_id": req.DisciplineID,
	})
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.Created(w, result)
}

// DELETE /admin/admins/{id}/disciplines/{disciplineId}
func (h *Handler) UnassignAdminDiscipline(w http.ResponseWriter, r *http.Request) {
	adminID := middleware.URLParam(r, "id")
	disciplineID := middleware.URLParam(r, "disciplineId")
	query := fmt.Sprintf("admin_disciplines?admin_id=eq.%s&discipline_id=eq.%s", adminID, disciplineID)
	if _, err := h.sb.DB("DELETE", query, nil); err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.NoContent(w)
}
