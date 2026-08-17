package shop

import (
	"encoding/json"
	"fmt"
	"net/http"

	"gympulse/shared/middleware"
	"gympulse/shared/pagination"
	"gympulse/shared/response"
)

// GET /admin/shop/reviews
func (h *Handler) ListReviews(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	p := pagination.Parse(r)
	filter := fmt.Sprintf("product_reviews?select=*,products(name),profiles(full_name,avatar_url)&order=created_at.desc&%s", p.QueryFragment())
	if rating := q.Get("rating"); rating != "" {
		filter += "&rating=eq." + rating
	}
	if productID := q.Get("product_id"); productID != "" {
		filter += "&product_id=eq." + productID
	}
	result, err := h.sb.DB("GET", filter, nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// DELETE /admin/shop/reviews/{id}
func (h *Handler) DeleteReview(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	if _, err := h.sb.DB("DELETE", "product_reviews?id=eq."+id, nil); err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.NoContent(w)
}

// PATCH /admin/shop/reviews/{id}/flag
func (h *Handler) FlagReview(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	var req struct {
		Flagged bool   `json:"flagged"`
		Reason  string `json:"reason,omitempty"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	result, err := h.sb.DB("PATCH", "product_reviews?id=eq."+id, map[string]interface{}{
		"is_flagged":  req.Flagged,
		"flag_reason": req.Reason,
	})
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}
