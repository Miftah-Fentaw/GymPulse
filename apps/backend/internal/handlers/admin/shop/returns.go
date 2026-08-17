package shop

import (
	"encoding/json"
	"net/http"

	"gympulse/shared/middleware"
	"gympulse/shared/pagination"
	"gympulse/shared/response"
)

// GET /admin/shop/returns
func (h *Handler) ListReturns(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	p := pagination.Parse(r)
	filter := "order_returns?select=*,orders(id),profiles(full_name,email)&order=created_at.desc&" + p.QueryFragment()
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

// GET /admin/shop/returns/{id}
func (h *Handler) GetReturn(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	result, err := h.sb.DB("GET", "order_returns?id=eq."+id+"&select=*,orders(*),profiles(full_name,email)", nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	items, _ := result.([]interface{})
	if len(items) == 0 {
		response.NotFound(w, "return not found")
		return
	}
	response.OK(w, items[0])
}

// PATCH /admin/shop/returns/{id}/status
func (h *Handler) UpdateReturnStatus(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	var req struct {
		Status string `json:"status"`
		Notes  string `json:"notes,omitempty"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	valid := map[string]bool{"pending": true, "approved": true, "rejected": true, "refunded": true}
	if !valid[req.Status] {
		response.BadRequest(w, "invalid status")
		return
	}
	payload := map[string]interface{}{"status": req.Status}
	if req.Notes != "" {
		payload["admin_notes"] = req.Notes
	}
	result, err := h.sb.DB("PATCH", "order_returns?id=eq."+id, payload)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}
