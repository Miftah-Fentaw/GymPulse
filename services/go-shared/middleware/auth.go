// Package middleware provides shared HTTP middleware for Go services.
package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const (
	UserIDKey    contextKey = "user_id"
	UserEmailKey contextKey = "user_email"
	UserRoleKey  contextKey = "user_role"
	UserMetaKey  contextKey = "user_meta"
)

// Admin role constants — stored in Supabase app_metadata.admin_role.
const (
	RoleSuperAdmin = "super_admin"
	RoleUserAdmin  = "user_admin"
	RoleShopAdmin  = "shop_admin"
	RoleSportAdmin = "sport_admin"
)

// Claims mirrors the Supabase JWT payload.
type Claims struct {
	Sub   string                 `json:"sub"`
	Email string                 `json:"email"`
	Meta  map[string]interface{} `json:"app_metadata"`
	jwt.RegisteredClaims
}

// Authenticate validates the Supabase JWT and injects user info into context.
func Authenticate(jwtSecret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			hdr := r.Header.Get("Authorization")
			if hdr == "" {
				writeErr(w, http.StatusUnauthorized, "missing authorization header")
				return
			}
			parts := strings.SplitN(hdr, " ", 2)
			if len(parts) != 2 || !strings.EqualFold(parts[0], "bearer") {
				writeErr(w, http.StatusUnauthorized, "invalid authorization header format")
				return
			}

			claims := &Claims{}
			token, err := jwt.ParseWithClaims(parts[1], claims, func(t *jwt.Token) (interface{}, error) {
				if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, jwt.ErrSignatureInvalid
				}
				return []byte(jwtSecret), nil
			})
			if err != nil || !token.Valid {
				writeErr(w, http.StatusUnauthorized, "invalid or expired token")
				return
			}

			ctx := context.WithValue(r.Context(), UserIDKey, claims.Sub)
			ctx = context.WithValue(ctx, UserEmailKey, claims.Email)
			ctx = context.WithValue(ctx, UserMetaKey, claims.Meta)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// RequireAdminRole checks app_metadata.admin_role against the allowed set.
func RequireAdminRole(roles ...string) func(http.Handler) http.Handler {
	allowed := make(map[string]bool, len(roles))
	for _, r := range roles {
		allowed[r] = true
	}
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			meta, _ := r.Context().Value(UserMetaKey).(map[string]interface{})
			role, _ := meta["admin_role"].(string)
			if !allowed[role] {
				writeErr(w, http.StatusForbidden, "insufficient permissions")
				return
			}
			ctx := context.WithValue(r.Context(), UserRoleKey, role)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// UserID returns the authenticated user ID from context.
func UserID(ctx context.Context) string {
	id, _ := ctx.Value(UserIDKey).(string)
	return id
}

// UserRole returns the admin role from context.
func UserRole(ctx context.Context) string {
	role, _ := ctx.Value(UserRoleKey).(string)
	return role
}

// URLParam extracts a chi URL parameter.
func URLParam(r *http.Request, key string) string {
	return chi.URLParam(r, key)
}

func writeErr(w http.ResponseWriter, status int, msg string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_, _ = w.Write([]byte(`{"success":false,"error":"` + msg + `"}`))
}
