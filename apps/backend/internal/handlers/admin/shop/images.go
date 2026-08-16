package shop

import (
	"fmt"
	"net/http"

	"gympulse/shared/middleware"
	"gympulse/shared/response"
	"gympulse/shared/storage"
	"gympulse/shared/supabase"
)

const maxImageUpload = 20 << 20 // 20 MB

// POST /admin/shop/products/{id}/images
// Uploads one or more product images, appends their URLs to the product's images array.
// Roles: shop_admin (own products), super_admin
func (h *Handler) UploadProductImages(w http.ResponseWriter, r *http.Request) {
	productID := middleware.URLParam(r, "id")
	uid := middleware.UserID(r.Context())
	role := middleware.UserRole(r.Context())

	// Verify the product belongs to this shop_admin (unless super_admin).
	filter := "products?id=eq." + productID + "&select=id,images,shop_admin_id"
	if role == middleware.RoleShopAdmin {
		filter += "&shop_admin_id=eq." + uid
	}
	existing, err := h.sb.DB("GET", filter, nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	rows, _ := existing.([]interface{})
	if len(rows) == 0 {
		response.NotFound(w, "product not found")
		return
	}

	// Upload all files from the "images" field.
	uploader := storage.New(
		supabase.New(h.cfg.SupabaseURL, h.cfg.SupabaseAnonKey, h.cfg.SupabaseServiceKey),
		h.cfg.ProductImageBucket,
		fmt.Sprintf("products/%s", productID),
	)

	results, err := uploader.UploadFromRequest(r, "images", storage.AllowedImages, maxImageUpload)
	if err != nil {
		response.BadRequest(w, err.Error())
		return
	}

	// Collect new URLs.
	newURLs := make([]string, 0, len(results))
	for _, res := range results {
		newURLs = append(newURLs, res.URL)
	}

	// Append new URLs to the existing images array in the DB.
	// PostgREST doesn't support array_append directly; fetch existing, merge, patch.
	productRow, _ := rows[0].(map[string]interface{})
	existingImages, _ := productRow["images"].([]interface{})

	merged := make([]string, 0, len(existingImages)+len(newURLs))
	for _, img := range existingImages {
		if s, ok := img.(string); ok {
			merged = append(merged, s)
		}
	}
	merged = append(merged, newURLs...)

	if _, err := h.sb.DB("PATCH",
		fmt.Sprintf("products?id=eq.%s", productID),
		map[string]interface{}{"images": merged}); err != nil {
		response.InternalError(w, err.Error())
		return
	}

	response.Created(w, map[string]interface{}{
		"uploaded": len(newURLs),
		"urls":     newURLs,
		"all_images": merged,
	})
}

// DELETE /admin/shop/products/{id}/images
// Removes a specific image URL from the product's images array.
// Body: { url: "https://..." }
func (h *Handler) DeleteProductImage(w http.ResponseWriter, r *http.Request) {
	productID := middleware.URLParam(r, "id")
	uid := middleware.UserID(r.Context())
	role := middleware.UserRole(r.Context())

	var req struct {
		URL string `json:"url"`
	}
	if err := decodeJSON(r, &req); err != nil || req.URL == "" {
		response.BadRequest(w, "url is required")
		return
	}

	filter := "products?id=eq." + productID + "&select=id,images"
	if role == middleware.RoleShopAdmin {
		filter += "&shop_admin_id=eq." + uid
	}
	existing, err := h.sb.DB("GET", filter, nil)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}
	rows, _ := existing.([]interface{})
	if len(rows) == 0 {
		response.NotFound(w, "product not found")
		return
	}
	productRow, _ := rows[0].(map[string]interface{})
	existingImages, _ := productRow["images"].([]interface{})

	filtered := make([]string, 0, len(existingImages))
	for _, img := range existingImages {
		if s, ok := img.(string); ok && s != req.URL {
			filtered = append(filtered, s)
		}
	}

	if _, err := h.sb.DB("PATCH",
		fmt.Sprintf("products?id=eq.%s", productID),
		map[string]interface{}{"images": filtered}); err != nil {
		response.InternalError(w, err.Error())
		return
	}

	response.OK(w, map[string]interface{}{"images": filtered})
}
