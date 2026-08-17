package shop

import (
	"encoding/json"
	"net/http"

	"gympulse/shared/middleware"
	"gympulse/shared/pagination"
	"gympulse/shared/response"
)

// GET /admin/shop/suppliers
func (h *Handler) ListSuppliers(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	p := pagination.Parse(r)
	filter := "suppliers?select=*&order=name.asc&" + p.QueryFragment()
	if cat := q.Get("category"); cat != "" {
		filter += "&category=eq." + cat
	}
	if status := q.Get("status"); status != "" {
		filter += "&status=eq." + status
	}
	result, err := h.sb.DB("GET", filter, nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// POST /admin/shop/suppliers
func (h *Handler) CreateSupplier(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name        string `json:"name"`
		ContactName string `json:"contact_name"`
		Email       string `json:"email"`
		Phone       string `json:"phone"`
		Category    string `json:"category"`
		Address     string `json:"address"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Name == "" {
		response.BadRequest(w, "name is required")
		return
	}
	result, err := h.sb.DB("POST", "suppliers", map[string]interface{}{
		"name":         req.Name,
		"contact_name": req.ContactName,
		"email":        req.Email,
		"phone":        req.Phone,
		"category":     req.Category,
		"address":      req.Address,
		"status":       "active",
	})
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.Created(w, result)
}

// GET /admin/shop/suppliers/{id}
func (h *Handler) GetSupplier(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	result, err := h.sb.DB("GET", "suppliers?id=eq."+id+"&select=*", nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	items, _ := result.([]interface{})
	if len(items) == 0 {
		response.NotFound(w, "supplier not found")
		return
	}
	response.OK(w, items[0])
}

// PATCH /admin/shop/suppliers/{id}
func (h *Handler) UpdateSupplier(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	var req struct {
		Name        string `json:"name,omitempty"`
		ContactName string `json:"contact_name,omitempty"`
		Email       string `json:"email,omitempty"`
		Phone       string `json:"phone,omitempty"`
		Category    string `json:"category,omitempty"`
		Address     string `json:"address,omitempty"`
		Status      string `json:"status,omitempty"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	payload := map[string]interface{}{}
	if req.Name != "" { payload["name"] = req.Name }
	if req.ContactName != "" { payload["contact_name"] = req.ContactName }
	if req.Email != "" { payload["email"] = req.Email }
	if req.Phone != "" { payload["phone"] = req.Phone }
	if req.Category != "" { payload["category"] = req.Category }
	if req.Address != "" { payload["address"] = req.Address }
	if req.Status != "" { payload["status"] = req.Status }
	result, err := h.sb.DB("PATCH", "suppliers?id=eq."+id, payload)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// DELETE /admin/shop/suppliers/{id}
func (h *Handler) DeleteSupplier(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	if _, err := h.sb.DB("DELETE", "suppliers?id=eq."+id, nil); err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.NoContent(w)
}
