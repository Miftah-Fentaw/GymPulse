package shop

import (
	"encoding/json"
	"fmt"
	"net/http"

	"gympulse/shared/middleware"
	"gympulse/shared/pagination"
	"gympulse/shared/response"
)

// GET /admin/shop/shipments
func (h *Handler) ListShipments(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	p := pagination.Parse(r)
	filter := fmt.Sprintf(
		"shipments?select=*,orders(id,user_id,total_amount)&order=created_at.desc&%s",
		p.QueryFragment(),
	)
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

// GET /admin/shop/shipments/{id}
func (h *Handler) GetShipment(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	result, err := h.sb.DB("GET",
		"shipments?id=eq."+id+"&select=*,orders(*,order_items(*,products(name,images)))", nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	items, _ := result.([]interface{})
	if len(items) == 0 {
		response.NotFound(w, "shipment not found")
		return
	}
	response.OK(w, items[0])
}

// PATCH /admin/shop/shipments/{id}
func (h *Handler) UpdateShipment(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	var req struct {
		TrackingNumber string `json:"tracking_number,omitempty"`
		Carrier        string `json:"carrier,omitempty"`
		Status         string `json:"status,omitempty"`
		EstimatedAt    string `json:"estimated_delivery_at,omitempty"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	payload := map[string]interface{}{}
	if req.TrackingNumber != "" { payload["tracking_number"] = req.TrackingNumber }
	if req.Carrier != "" { payload["carrier"] = req.Carrier }
	if req.Status != "" { payload["status"] = req.Status }
	if req.EstimatedAt != "" { payload["estimated_delivery_at"] = req.EstimatedAt }
	result, err := h.sb.DB("PATCH", "shipments?id=eq."+id, payload)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}
