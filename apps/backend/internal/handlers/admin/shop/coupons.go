package shop

import (
	"encoding/json"
	"net/http"

	"gympulse/shared/middleware"
	"gympulse/shared/pagination"
	"gympulse/shared/response"
)

// GET /admin/shop/coupons
func (h *Handler) ListCoupons(w http.ResponseWriter, r *http.Request) {
	p := pagination.Parse(r)
	result, err := h.sb.DB("GET", "coupons?select=*&order=created_at.desc&"+p.QueryFragment(), nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// POST /admin/shop/coupons
func (h *Handler) CreateCoupon(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Code           string  `json:"code"`
		DiscountType   string  `json:"discount_type"` // "percentage" | "fixed"
		DiscountValue  float64 `json:"discount_value"`
		MinOrderAmount float64 `json:"min_order_amount"`
		MaxUses        int     `json:"max_uses"`
		ExpiresAt      string  `json:"expires_at"`
		IsActive       bool    `json:"is_active"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Code == "" {
		response.BadRequest(w, "code is required")
		return
	}
	if req.DiscountType == "" {
		req.DiscountType = "percentage"
	}
	result, err := h.sb.DB("POST", "coupons", map[string]interface{}{
		"code":             req.Code,
		"discount_type":    req.DiscountType,
		"discount_value":   req.DiscountValue,
		"min_order_amount": req.MinOrderAmount,
		"max_uses":         req.MaxUses,
		"expires_at":       req.ExpiresAt,
		"is_active":        req.IsActive,
		"times_used":       0,
	})
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.Created(w, result)
}

// GET /admin/shop/coupons/{id}
func (h *Handler) GetCoupon(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	result, err := h.sb.DB("GET", "coupons?id=eq."+id+"&select=*", nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	items, _ := result.([]interface{})
	if len(items) == 0 {
		response.NotFound(w, "coupon not found")
		return
	}
	response.OK(w, items[0])
}

// PATCH /admin/shop/coupons/{id}
func (h *Handler) UpdateCoupon(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	var req struct {
		MaxUses        *int     `json:"max_uses,omitempty"`
		ExpiresAt      string   `json:"expires_at,omitempty"`
		IsActive       *bool    `json:"is_active,omitempty"`
		DiscountValue  *float64 `json:"discount_value,omitempty"`
		MinOrderAmount *float64 `json:"min_order_amount,omitempty"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	payload := map[string]interface{}{}
	if req.MaxUses != nil { payload["max_uses"] = *req.MaxUses }
	if req.ExpiresAt != "" { payload["expires_at"] = req.ExpiresAt }
	if req.IsActive != nil { payload["is_active"] = *req.IsActive }
	if req.DiscountValue != nil { payload["discount_value"] = *req.DiscountValue }
	if req.MinOrderAmount != nil { payload["min_order_amount"] = *req.MinOrderAmount }
	result, err := h.sb.DB("PATCH", "coupons?id=eq."+id, payload)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// DELETE /admin/shop/coupons/{id}
func (h *Handler) DeleteCoupon(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	if _, err := h.sb.DB("DELETE", "coupons?id=eq."+id, nil); err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.NoContent(w)
}
