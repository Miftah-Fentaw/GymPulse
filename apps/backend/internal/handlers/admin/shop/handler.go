// Package shop handles e-commerce management (shop_admin + super_admin).
package shop

import (
	"encoding/json"
	"fmt"
	"net/http"

	"gympulse/backend/internal/config"
	"gympulse/shared/middleware"
	"gympulse/shared/pagination"
	"gympulse/shared/response"
	"gympulse/shared/supabase"
)

type Handler struct {
	cfg *config.Config
	sb  *supabase.Client
}

func New(cfg *config.Config) *Handler {
	return &Handler{cfg: cfg, sb: supabase.New(cfg.SupabaseURL, cfg.SupabaseAnonKey, cfg.SupabaseServiceKey)}
}

// ─── Products ─────────────────────────────────────────────────────────────────

// GET /admin/shop/products
func (h *Handler) ListProducts(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	uid := middleware.UserID(r.Context())
	role := middleware.UserRole(r.Context())
	p := pagination.Parse(r)

	filter := fmt.Sprintf("select=*,product_categories(name)&order=created_at.desc&%s", p.QueryFragment())
	if role == middleware.RoleShopAdmin {
		filter += "&shop_admin_id=eq." + uid
	}
	if cat := q.Get("category_id"); cat != "" {
		filter += "&category_id=eq." + cat
	}
	if status := q.Get("status"); status == "active" {
		filter += "&is_active=eq.true"
	} else if status == "inactive" {
		filter += "&is_active=eq.false"
	}

	result, err := h.sb.DB("GET", "products?"+filter, nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// GET /admin/shop/products/{id}
func (h *Handler) GetProduct(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	result, err := h.sb.DB("GET", "products?id=eq."+id+"&select=*,product_categories(name)", nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	items, _ := result.([]interface{})
	if len(items) == 0 {
		response.NotFound(w, "product not found")
		return
	}
	response.OK(w, items[0])
}

// POST /admin/shop/products
func (h *Handler) CreateProduct(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name        string   `json:"name"`
		Description string   `json:"description"`
		Price       float64  `json:"price"`
		Stock       int      `json:"stock"`
		CategoryID  string   `json:"category_id"`
		Images      []string `json:"images"`
		IsActive    bool     `json:"is_active"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	if req.Name == "" || req.Price <= 0 {
		response.BadRequest(w, "name and price are required")
		return
	}
	result, err := h.sb.DB("POST", "products", map[string]interface{}{
		"name":          req.Name,
		"description":   req.Description,
		"price":         req.Price,
		"stock":         req.Stock,
		"category_id":   req.CategoryID,
		"images":        req.Images,
		"is_active":     req.IsActive,
		"shop_admin_id": middleware.UserID(r.Context()),
	})
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.Created(w, result)
}

// PATCH /admin/shop/products/{id}
func (h *Handler) UpdateProduct(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	uid := middleware.UserID(r.Context())
	role := middleware.UserRole(r.Context())

	var req struct {
		Name        string   `json:"name,omitempty"`
		Description string   `json:"description,omitempty"`
		Price       *float64 `json:"price,omitempty"`
		Stock       *int     `json:"stock,omitempty"`
		CategoryID  string   `json:"category_id,omitempty"`
		Images      []string `json:"images,omitempty"`
		IsActive    *bool    `json:"is_active,omitempty"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}

	payload := map[string]interface{}{}
	if req.Name != "" {
		payload["name"] = req.Name
	}
	if req.Description != "" {
		payload["description"] = req.Description
	}
	if req.Price != nil {
		payload["price"] = *req.Price
	}
	if req.Stock != nil {
		payload["stock"] = *req.Stock
	}
	if req.CategoryID != "" {
		payload["category_id"] = req.CategoryID
	}
	if len(req.Images) > 0 {
		payload["images"] = req.Images
	}
	if req.IsActive != nil {
		payload["is_active"] = *req.IsActive
	}

	filter := "products?id=eq." + id
	if role == middleware.RoleShopAdmin {
		filter += "&shop_admin_id=eq." + uid
	}
	result, err := h.sb.DB("PATCH", filter, payload)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// DELETE /admin/shop/products/{id}
func (h *Handler) DeleteProduct(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	uid := middleware.UserID(r.Context())
	role := middleware.UserRole(r.Context())

	filter := "products?id=eq." + id
	if role == middleware.RoleShopAdmin {
		filter += "&shop_admin_id=eq." + uid
	}
	if _, err := h.sb.DB("DELETE", filter, nil); err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.NoContent(w)
}

// ─── Categories ───────────────────────────────────────────────────────────────

// GET /admin/shop/categories
func (h *Handler) ListCategories(w http.ResponseWriter, r *http.Request) {
	result, err := h.sb.DB("GET", "product_categories?select=*&order=name.asc", nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// POST /admin/shop/categories  (super_admin only)
func (h *Handler) CreateCategory(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name        string `json:"name"`
		Description string `json:"description"`
		Slug        string `json:"slug"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Name == "" || req.Slug == "" {
		response.BadRequest(w, "name and slug are required")
		return
	}
	result, err := h.sb.DB("POST", "product_categories",
		map[string]interface{}{"name": req.Name, "description": req.Description, "slug": req.Slug})
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.Created(w, result)
}

// DELETE /admin/shop/categories/{id}
func (h *Handler) DeleteCategory(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	if _, err := h.sb.DB("DELETE", "product_categories?id=eq."+id, nil); err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.NoContent(w)
}

// ─── Orders ───────────────────────────────────────────────────────────────────

// GET /admin/shop/orders
func (h *Handler) ListOrders(w http.ResponseWriter, r *http.Request) {
	uid := middleware.UserID(r.Context())
	role := middleware.UserRole(r.Context())
	p := pagination.Parse(r)

	filter := fmt.Sprintf("select=*,order_items(product_id,quantity,unit_price)&order=created_at.desc&%s", p.QueryFragment())
	if role == middleware.RoleShopAdmin {
		filter += "&shop_admin_id=eq." + uid
	}
	if status := r.URL.Query().Get("status"); status != "" {
		filter += "&status=eq." + status
	}
	result, err := h.sb.DB("GET", "orders?"+filter, nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// GET /admin/shop/orders/{id}
func (h *Handler) GetOrder(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	result, err := h.sb.DB("GET",
		fmt.Sprintf("orders?id=eq.%s&select=*,order_items(*,products(name,images))", id), nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	items, _ := result.([]interface{})
	if len(items) == 0 {
		response.NotFound(w, "order not found")
		return
	}
	response.OK(w, items[0])
}

// PATCH /admin/shop/orders/{id}/status
func (h *Handler) UpdateOrderStatus(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	var req struct {
		Status string `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	validStatuses := map[string]bool{
		"pending": true, "processing": true, "shipped": true,
		"delivered": true, "cancelled": true, "refunded": true,
	}
	if !validStatuses[req.Status] {
		response.BadRequest(w, "invalid order status")
		return
	}
	result, err := h.sb.DB("PATCH", "orders?id=eq."+id, map[string]interface{}{"status": req.Status})
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}
