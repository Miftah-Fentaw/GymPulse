// Package middleware provides shared HTTP middleware for Go services.
package middleware

import (
	"context"
	"net/http"
	"strings"
	"sync"

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
	Email string                 `json:"email"`
	Meta  map[string]interface{} `json:"app_metadata"`
	jwt.RegisteredClaims
}

var (
	verifierOnce sync.Once
	jwks         *jwksCache
)

// Authenticate validates a Supabase JWT (HS256 legacy secret or ES256 JWKS)
// and injects user info into context.
func Authenticate(jwtSecret, supabaseURL string) func(http.Handler) http.Handler {
	verifierOnce.Do(func() {
		if supabaseURL != "" {
			jwks = newJWKSCache(supabaseURL)
		}
	})

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

			claims, err := parseSupabaseJWT(parts[1], jwtSecret)
			if err != nil {
				writeErr(w, http.StatusUnauthorized, "invalid or expired token")
				return
			}

			userID := claims.Subject
			ctx := context.WithValue(r.Context(), UserIDKey, userID)
			ctx = context.WithValue(ctx, UserEmailKey, claims.Email)
			ctx = context.WithValue(ctx, UserMetaKey, claims.Meta)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func parseSupabaseJWT(tokenStr, jwtSecret string) (*Claims, error) {
	header, err := parseJWTHeader(tokenStr)
	if err != nil {
		return nil, err
	}

	claims := &Claims{}
	parser := jwt.NewParser(jwt.WithValidMethods([]string{"HS256", "ES256", "ES384", "ES512"}))

	keyFunc := func(t *jwt.Token) (interface{}, error) {
		switch t.Method.(type) {
		case *jwt.SigningMethodHMAC:
			if jwtSecret == "" {
				return nil, jwt.ErrSignatureInvalid
			}
			return []byte(jwtSecret), nil
		case *jwt.SigningMethodECDSA:
			if jwks == nil {
				return nil, jwt.ErrSignatureInvalid
			}
			key, err := jwks.keyFor(header.Kid)
			if err != nil {
				return nil, err
			}
			pub, err := key.ecdsaPublicKey()
			if err != nil {
				return nil, err
			}
			return pub, nil
		default:
			return nil, jwt.ErrSignatureInvalid
		}
	}

	token, err := parser.ParseWithClaims(tokenStr, claims, keyFunc)
	if err != nil {
		return nil, err
	}
	if !token.Valid {
		return nil, jwt.ErrTokenInvalidClaims
	}
	if claims.Meta == nil {
		claims.Meta = map[string]interface{}{}
	}
	return claims, nil
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
