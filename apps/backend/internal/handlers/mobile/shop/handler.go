// Package shop provides public shop endpoints for the mobile app.
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

// Handler serves public shop data and order placement.
type Handler struct {
	cfg *config.Config
	sb  *supabase.Client
}

// New creates a new mobile shop Handler.
func New(cfg *config.Config) *Handler {
	return &Handler{cfg: cfg, sb: supabase.New(cfg.SupabaseURL, cfg.SupabaseAnonKey, cfg.SupabaseServiceKey)}
}

// ─── Public product browsing ──────────────────────────────────────────────────

// GET /shop/products
// Query params: category_id, search, page, per_page
func (h *Handler) ListProducts(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	p := pagination.Parse(r)

	filter := fmt.Sprintf("select=*,product_categories(name)&is_active=eq.true&order=created_at.desc&%s",
		p.QueryFragment())

	if cat := q.Get("category_id"); cat != "" {
		filter += "&category_id=eq." + cat
	}

	result, err := h.sb.DB("GET", "products?"+filter, nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// GET /shop/products/{id}
func (h *Handler) GetProduct(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")

	result, err := h.sb.DB("GET",
		fmt.Sprintf("products?id=eq.%s&is_active=eq.true&select=*,product_categories(name)", id),
		nil)
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

// GET /shop/categories
func (h *Handler) ListCategories(w http.ResponseWriter, r *http.Request) {
	result, err := h.sb.DB("GET", "product_categories?select=*&order=name.asc", nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

// ─── Order management (authenticated) ────────────────────────────────────────

// GET /shop/orders
// Returns the authenticated user's orders.
func (h *Handler) ListMyOrders(w http.ResponseWriter, r *http.Request) {
	uid := middleware.UserID(r.Context())
	p := pagination.Parse(r)

	filter := fmt.Sprintf("select=*,order_items(*,products(name,images,price))&user_id=eq.%s&order=created_at.desc&%s",
		uid, p.QueryFragment())

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

// GET /shop/orders/{id}
// Returns a single order belonging to the authenticated user.
func (h *Handler) GetMyOrder(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	uid := middleware.UserID(r.Context())

	result, err := h.sb.DB("GET",
		fmt.Sprintf("orders?id=eq.%s&user_id=eq.%s&select=*,order_items(*,products(name,images,price))", id, uid),
		nil)
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

// POST /shop/orders
// Places a new order. Body: { items: [{product_id, quantity}], shipping_address: {}, notes: "" }
func (h *Handler) PlaceOrder(w http.ResponseWriter, r *http.Request) {
	uid := middleware.UserID(r.Context())

	var req struct {
		Items []struct {
			ProductID string `json:"product_id"`
			Quantity  int    `json:"quantity"`
		} `json:"items"`
		ShippingAddress map[string]interface{} `json:"shipping_address"`
		Notes           string                 `json:"notes"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "invalid request body")
		return
	}
	if len(req.Items) == 0 {
		response.BadRequest(w, "items are required")
		return
	}
	for _, item := range req.Items {
		if item.ProductID == "" || item.Quantity < 1 {
			response.BadRequest(w, "each item needs a valid product_id and quantity >= 1")
			return
		}
	}

	// Fetch product prices and validate stock.
	productIDs := make([]string, 0, len(req.Items))
	for _, item := range req.Items {
		productIDs = append(productIDs, item.ProductID)
	}

	// Build PostgREST IN filter: id=in.(id1,id2,...)
	inFilter := "id=in.(" + joinStrings(productIDs) + ")"
	productsResult, err := h.sb.DB("GET",
		fmt.Sprintf("products?%s&is_active=eq.true&select=id,name,price,stock,shop_admin_id", inFilter),
		nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}

	productList, _ := productsResult.([]interface{})
	if len(productList) != len(req.Items) {
		response.BadRequest(w, "one or more products not found or inactive")
		return
	}

	// Build price map and validate stock.
	type productInfo struct {
		price       float64
		stock       int
		shopAdminID string
	}
	priceMap := map[string]productInfo{}
	for _, p := range productList {
		pm, _ := p.(map[string]interface{})
		pid, _ := pm["id"].(string)
		price, _ := pm["price"].(float64)
		stock, _ := pm["stock"].(float64) // JSON numbers decode as float64
		shopAdminID, _ := pm["shop_admin_id"].(string)
		priceMap[pid] = productInfo{price: price, stock: int(stock), shopAdminID: shopAdminID}
	}

	var totalAmount float64
	for _, item := range req.Items {
		info, ok := priceMap[item.ProductID]
		if !ok {
			response.BadRequest(w, "product "+item.ProductID+" not found")
			return
		}
		if item.Quantity > info.stock {
			response.BadRequest(w, "insufficient stock for product "+item.ProductID)
			return
		}
		totalAmount += info.price * float64(item.Quantity)
	}

	// Determine shop_admin_id (use first item's shop — for multi-shop orders a different
	// model is needed, but this covers the common single-shop case).
	shopAdminID := priceMap[req.Items[0].ProductID].shopAdminID

	// Create the order.
	orderResult, err := h.sb.DB("POST", "orders", map[string]interface{}{
		"user_id":       uid,
		"shop_admin_id": shopAdminID,
		"status":        "pending",
		"total_amount":  totalAmount,
		"currency":      "USD",
		"shipping_addr": req.ShippingAddress,
		"notes":         req.Notes,
	})
	if err != nil {
		response.InternalError(w, "failed to create order: "+err.Error())
		return
	}

	// Extract the new order ID.
	orderRows, _ := orderResult.([]interface{})
	if len(orderRows) == 0 {
		response.InternalError(w, "order creation returned empty result")
		return
	}
	orderMap, _ := orderRows[0].(map[string]interface{})
	orderID, _ := orderMap["id"].(string)

	// Insert order items.
	for _, item := range req.Items {
		info := priceMap[item.ProductID]
		if _, err := h.sb.DB("POST", "order_items", map[string]interface{}{
			"order_id":   orderID,
			"product_id": item.ProductID,
			"quantity":   item.Quantity,
			"unit_price": info.price,
		}); err != nil {
			response.InternalError(w, "failed to create order items: "+err.Error())
			return
		}

		// Decrement stock.
		newStock := info.stock - item.Quantity
		_, _ = h.sb.DB("PATCH",
			fmt.Sprintf("products?id=eq.%s", item.ProductID),
			map[string]interface{}{"stock": newStock})
	}

	response.Created(w, orderMap)
}

// POST /shop/orders/{id}/cancel
// Allows a user to cancel their own pending order.
func (h *Handler) CancelOrder(w http.ResponseWriter, r *http.Request) {
	id := middleware.URLParam(r, "id")
	uid := middleware.UserID(r.Context())

	// Verify ownership and that it's still cancellable.
	existing, err := h.sb.DB("GET",
		fmt.Sprintf("orders?id=eq.%s&user_id=eq.%s&select=id,status", id, uid), nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	rows, _ := existing.([]interface{})
	if len(rows) == 0 {
		response.NotFound(w, "order not found")
		return
	}
	row, _ := rows[0].(map[string]interface{})
	status, _ := row["status"].(string)
	if status != "pending" && status != "processing" {
		response.BadRequest(w, "only pending or processing orders can be cancelled")
		return
	}

	result, err := h.sb.DB("PATCH",
		fmt.Sprintf("orders?id=eq.%s&user_id=eq.%s", id, uid),
		map[string]interface{}{"status": "cancelled"})
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	response.OK(w, result)
}

func joinStrings(ss []string) string {
	out := ""
	for i, s := range ss {
		if i > 0 {
			out += ","
		}
		out += s
	}
	return out
}
