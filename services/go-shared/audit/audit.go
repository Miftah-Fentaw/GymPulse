// Package audit provides a fire-and-forget helper for writing audit log entries.
// Used by admin handlers to record significant actions (create/update/delete).
package audit

import (
	"net/http"

	"gympulse/shared/middleware"
	"gympulse/shared/supabase"
)

// Entry describes a single audit event.
type Entry struct {
	Action     string                 // e.g. "create_product", "ban_user", "delete_admin"
	Resource   string                 // table or domain name, e.g. "products", "users"
	ResourceID string                 // ID of the affected record
	Metadata   map[string]interface{} // arbitrary extra context
}

// Log writes an audit entry for the current request's admin user.
// It is fire-and-forget — errors are silently discarded to never block responses.
func Log(r *http.Request, sb *supabase.Client, entry Entry) {
	adminID := middleware.UserID(r.Context())
	if adminID == "" {
		return
	}

	ip := r.Header.Get("X-Real-IP")
	if ip == "" {
		ip = r.RemoteAddr
	}

	payload := map[string]interface{}{
		"admin_id":    adminID,
		"action":      entry.Action,
		"resource":    entry.Resource,
		"resource_id": entry.ResourceID,
		"ip_address":  ip,
	}
	if entry.Metadata != nil {
		payload["metadata"] = entry.Metadata
	}

	// Run in a goroutine so it never adds latency to the response.
	go func() {
		_, _ = sb.DB("POST", "audit_logs", payload)
	}()
}
