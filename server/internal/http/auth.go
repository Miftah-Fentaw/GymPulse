package httpserver

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"errors"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	openapi_types "github.com/oapi-codegen/runtime/types"
	"golang.org/x/crypto/argon2"

	"gympulse-server/internal/http/api"
)

type authClaims struct {
	UserID string   `json:"user_id"`
	GymID  string   `json:"gym_id"`
	Roles  []string `json:"staff_roles"`
	Member bool     `json:"has_member_profile"`
	jwt.RegisteredClaims
}

func newUUID() uuid.UUID {
	id, err := uuid.NewV7()
	if err != nil {
		return uuid.New()
	}
	return id
}

func hashPassword(password string) string {
	salt := make([]byte, 16)
	_, _ = rand.Read(salt)
	key := argon2.IDKey([]byte(password), salt, 1, 64*1024, 4, 32)
	return fmt.Sprintf("$argon2id$v=19$m=65536,t=1,p=4$%s$%s",
		base64.RawStdEncoding.EncodeToString(salt), base64.RawStdEncoding.EncodeToString(key))
}

func verifyPassword(password, encoded string) bool {
	var s, h string
	var m, t, p uint32
	if _, err := fmt.Sscanf(encoded, "$argon2id$v=19$m=%d,t=%d,p=%d$%s$%s", &m, &t, &p, &s, &h); err != nil {
		return false
	}
	salt, err := base64.RawStdEncoding.DecodeString(s)
	if err != nil {
		return false
	}
	want, err := base64.RawStdEncoding.DecodeString(h)
	if err != nil {
		return false
	}
	got := argon2.IDKey([]byte(password), salt, t, m, uint8(p), uint32(len(want)))
	return string(got) == string(want)
}

func tokenHash(token string) []byte { h := sha256.Sum256([]byte(token)); return h[:] }

func (a *apiImpl) secret() []byte { return []byte(os.Getenv("AUTH_JWT_SECRET")) }

func parseAccess(raw string, secret []byte) (authClaims, error) {
	var c authClaims
	t, err := jwt.ParseWithClaims(raw, &c, func(t *jwt.Token) (interface{}, error) {
		if t.Method != jwt.SigningMethodHS256 {
			return nil, errors.New("unexpected signing method")
		}
		return secret, nil
	})
	if err != nil || !t.Valid {
		return c, errors.New("invalid token")
	}
	return c, nil
}

func (a *apiImpl) issueAccess(user, gym uuid.UUID, roles []string, member bool) (string, error) {
	now := time.Now()
	c := authClaims{UserID: user.String(), GymID: gym.String(), Roles: roles, Member: member,
		RegisteredClaims: jwt.RegisteredClaims{ExpiresAt: jwt.NewNumericDate(now.Add(15 * time.Minute)), IssuedAt: jwt.NewNumericDate(now), Subject: user.String()}}
	return jwt.NewWithClaims(jwt.SigningMethodHS256, c).SignedString(a.secret())
}

func (a *apiImpl) summary(ctx context.Context, id uuid.UUID) (api.UserSummary, []string, error) {
	var s api.UserSummary
	var email, name *string
	var gym uuid.UUID
	if err := a.pool.QueryRow(ctx, `SELECT id,gym_id,email,name FROM users WHERE id=$1 AND deactivated_at IS NULL`, id).Scan(&s.Id, &gym, &email, &name); err != nil {
		return s, nil, err
	}
	s.GymId, s.Name = gym, name
	if email != nil {
		e := openapi_types.Email(*email)
		s.Email = &e
	}
	rows, err := a.pool.Query(ctx, `SELECT role FROM user_staff_roles WHERE user_id=$1 ORDER BY role`, id)
	if err != nil {
		return s, nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var r string
		if err := rows.Scan(&r); err != nil {
			return s, nil, err
		}
		s.StaffRoles = append(s.StaffRoles, api.Role(r))
	}
	s.HasMemberProfile = false
	return s, makeRoles(s.StaffRoles), rows.Err()
}
func makeRoles(r []api.Role) []string {
	out := make([]string, len(r))
	for i := range r {
		out[i] = string(r[i])
	}
	return out
}

func (a *apiImpl) newRefresh(ctx context.Context, user uuid.UUID, family *uuid.UUID, r *http.Request) (string, error) {
	raw := make([]byte, 32)
	if _, err := rand.Read(raw); err != nil {
		return "", err
	}
	tok := base64.RawURLEncoding.EncodeToString(raw)
	f := newUUID()
	if family != nil {
		f = *family
	}
	id := newUUID()
	_, err := a.pool.Exec(ctx, `INSERT INTO refresh_tokens(id,user_id,token_hash,family_id,expires_at,user_agent,ip) VALUES($1,$2,$3,$4,$5,$6,$7)`, id, user, tokenHash(tok), f, time.Now().Add(30*24*time.Hour), r.UserAgent(), r.RemoteAddr)
	return tok, err
}
func (a *apiImpl) PostAuthLogin(ctx context.Context, req api.PostAuthLoginRequestObject) (api.PostAuthLoginResponseObject, error) {
	if req.Body == nil {
		return nil, errors.New("missing body")
	}
	key := string(req.Body.Email)
	now := time.Now()
	a.rateMu.Lock()
	if a.rate == nil {
		a.rate = map[string][]time.Time{}
	}
	recent := a.rate[key][:0]
	for _, t := range a.rate[key] {
		if now.Sub(t) < time.Minute {
			recent = append(recent, t)
		}
	}
	a.rate[key] = append(recent, now)
	limited := len(a.rate[key]) > 10
	a.rateMu.Unlock()
	if limited {
		return api.PostAuthLogin429JSONResponse(api.ErrorEnvelope{}), nil
	}
	var id, gym uuid.UUID
	var hash string
	err := a.pool.QueryRow(ctx, `SELECT id,gym_id,password_hash FROM users WHERE lower(email)=lower($1) AND deactivated_at IS NULL`, req.Body.Email).Scan(&id, &gym, &hash)
	if err != nil || !verifyPassword(req.Body.Password, hash) {
		return api.PostAuthLogin401JSONResponse(api.ErrorEnvelope{}), nil
	}
	s, roles, err := a.summary(ctx, id)
	if err != nil {
		return nil, err
	}
	r, _ := ctx.Value(requestKey).(*http.Request)
	if r == nil {
		r = &http.Request{}
	}
	refresh, err := a.newRefresh(ctx, id, nil, r)
	if err != nil {
		return nil, err
	}
	access, err := a.issueAccess(id, gym, roles, s.HasMemberProfile)
	if err != nil {
		return nil, err
	}
	cookie := a.refreshCookie(refresh, 2592000).String()
	return api.PostAuthLogin200JSONResponse{Body: api.LoginResponse{AccessToken: access, ExpiresIn: ptr(900), RefreshToken: &refresh, User: s}, Headers: api.PostAuthLogin200ResponseHeaders{SetCookie: &cookie}}, nil
}

func (a *apiImpl) refreshCookie(value string, maxAge int) *http.Cookie {
	secure := os.Getenv("AUTH_COOKIE_SECURE") != "false"
	return &http.Cookie{
		Name:     "gympulse_refresh",
		Value:    value,
		Path:     "/v1/auth",
		HttpOnly: true,
		Secure:   secure,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   maxAge,
	}
}
func ptr[T any](v T) *T { return &v }

func (a *apiImpl) PostAuthRefresh(ctx context.Context, req api.PostAuthRefreshRequestObject) (api.PostAuthRefreshResponseObject, error) {
	var raw string
	if c, err := httpRequestCookie(ctx); err == nil {
		raw = c
	}
	if raw == "" && req.Body != nil && req.Body.RefreshToken != nil {
		raw = *req.Body.RefreshToken
	}
	if raw == "" {
		return api.PostAuthRefresh401JSONResponse(api.ErrorEnvelope{}), nil
	}
	var id, family uuid.UUID
	var rotated, revoked *time.Time
	var exp time.Time
	err := a.pool.QueryRow(ctx, `SELECT user_id,family_id,rotated_at,revoked_at,expires_at FROM refresh_tokens WHERE token_hash=$1`, tokenHash(raw)).Scan(&id, &family, &rotated, &revoked, &exp)
	if err != nil || revoked != nil || exp.Before(time.Now()) {
		return api.PostAuthRefresh401JSONResponse(api.ErrorEnvelope{}), nil
	}
	if rotated != nil {
		_, _ = a.pool.Exec(ctx, `UPDATE refresh_tokens SET revoked_at=now() WHERE family_id=$1`, family)
		return api.PostAuthRefresh401JSONResponse(api.ErrorEnvelope{}), nil
	}
	_, _ = a.pool.Exec(ctx, `UPDATE refresh_tokens SET rotated_at=now(),last_used_at=now() WHERE token_hash=$1`, tokenHash(raw))
	r, _ := ctx.Value(requestKey).(*http.Request)
	if r == nil {
		r = &http.Request{}
	}
	newToken, err := a.newRefresh(ctx, id, &family, r)
	if err != nil {
		return nil, err
	}
	s, roles, err := a.summary(ctx, id)
	if err != nil {
		return nil, err
	}
	access, err := a.issueAccess(id, s.GymId, roles, s.HasMemberProfile)
	if err != nil {
		return nil, err
	}
	cookie := a.refreshCookie(newToken, 2592000).String()
	return api.PostAuthRefresh200JSONResponse{Body: api.LoginResponse{AccessToken: access, ExpiresIn: ptr(900), RefreshToken: &newToken, User: s}, Headers: api.PostAuthRefresh200ResponseHeaders{SetCookie: &cookie}}, nil
}
func httpRequestCookie(ctx context.Context) (string, error) {
	r, ok := ctx.Value(requestKey).(*http.Request)
	if !ok {
		return "", errors.New("request unavailable")
	}
	c, err := r.Cookie("gympulse_refresh")
	if err != nil {
		return "", err
	}
	return c.Value, nil
}

func (a *apiImpl) GetMe(ctx context.Context, _ api.GetMeRequestObject) (api.GetMeResponseObject, error) {
	id, ok := ctx.Value(authUserKey).(uuid.UUID)
	if !ok {
		return api.GetMe401JSONResponse(api.ErrorEnvelope{}), nil
	}
	s, _, err := a.summary(ctx, id)
	if err != nil {
		return api.GetMe401JSONResponse(api.ErrorEnvelope{}), nil
	}
	return api.GetMe200JSONResponse(s), nil
}

func (a *apiImpl) PatchMe(ctx context.Context, req api.PatchMeRequestObject) (api.PatchMeResponseObject, error) {
	id, ok := ctx.Value(authUserKey).(uuid.UUID)
	if !ok || req.Body == nil {
		return api.PatchMe401JSONResponse(api.ErrorEnvelope{}), nil
	}
	if req.Body.Name != nil {
		_, _ = a.pool.Exec(ctx, `UPDATE users SET name=$1,updated_at=now() WHERE id=$2`, *req.Body.Name, id)
	}
	if req.Body.Phone != nil {
		_, _ = a.pool.Exec(ctx, `UPDATE users SET phone=$1,updated_at=now() WHERE id=$2`, *req.Body.Phone, id)
	}
	s, _, err := a.summary(ctx, id)
	if err != nil {
		return api.PatchMe401JSONResponse(api.ErrorEnvelope{}), nil
	}
	return api.PatchMe200JSONResponse(s), nil
}

func (a *apiImpl) PostAuthLogout(ctx context.Context, _ api.PostAuthLogoutRequestObject) (api.PostAuthLogoutResponseObject, error) {
	if raw, err := httpRequestCookie(ctx); err == nil {
		_, _ = a.pool.Exec(ctx, `UPDATE refresh_tokens SET revoked_at=now() WHERE token_hash=$1`, tokenHash(raw))
	}
	clear := a.refreshCookie("", -1).String()
	return api.PostAuthLogout204Response{Headers: api.PostAuthLogout204ResponseHeaders{SetCookie: &clear}}, nil
}

func (a *apiImpl) ListMySessions(ctx context.Context, _ api.ListMySessionsRequestObject) (api.ListMySessionsResponseObject, error) {
	id, ok := ctx.Value(authUserKey).(uuid.UUID)
	if !ok {
		return api.ListMySessions401JSONResponse(api.ErrorEnvelope{}), nil
	}
	rows, err := a.pool.Query(ctx, `SELECT id,created_at,last_used_at,revoked_at,user_agent,ip FROM refresh_tokens WHERE user_id=$1 ORDER BY created_at DESC`, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []api.Session{}
	for rows.Next() {
		var s api.Session
		var revoked *time.Time
		if err := rows.Scan(&s.Id, &s.CreatedAt, &s.LastUsed, &revoked, &s.Device, &s.Ip); err != nil {
			return nil, err
		}
		s.Revoked = ptr(revoked != nil)
		items = append(items, s)
	}
	return api.ListMySessions200JSONResponse{Items: &items}, nil
}
func (a *apiImpl) RevokeMySession(ctx context.Context, req api.RevokeMySessionRequestObject) (api.RevokeMySessionResponseObject, error) {
	id, ok := ctx.Value(authUserKey).(uuid.UUID)
	if !ok {
		return api.RevokeMySession401JSONResponse(api.ErrorEnvelope{}), nil
	}
	_, _ = a.pool.Exec(ctx, `UPDATE refresh_tokens SET revoked_at=now() WHERE id=$1 AND user_id=$2`, req.SessionId, id)
	return api.RevokeMySession204Response{}, nil
}

func (a *apiImpl) PostAuthBootstrapOwner(ctx context.Context, req api.PostAuthBootstrapOwnerRequestObject) (api.PostAuthBootstrapOwnerResponseObject, error) {
	if req.Body == nil || os.Getenv("BOOTSTRAP_TOKEN") == "" || req.Body.SetupToken != os.Getenv("BOOTSTRAP_TOKEN") {
		return api.PostAuthBootstrapOwner400JSONResponse{}, nil
	}
	var exists bool
	if err := a.pool.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM user_staff_roles WHERE role='owner')`).Scan(&exists); err != nil || exists {
		return api.PostAuthBootstrapOwner409JSONResponse(api.ErrorEnvelope{}), nil
	}
	gym, user := newUUID(), newUUID()
	if _, err := a.pool.Exec(ctx, `INSERT INTO gyms(id,name,timezone,currency) VALUES($1,$2,'UTC','USD')`, gym, req.Body.GymName); err != nil {
		return nil, err
	}
	if _, err := a.pool.Exec(ctx, `INSERT INTO users(id,gym_id,email,password_hash) VALUES($1,$2,$3,$4)`, user, gym, req.Body.Email, hashPassword(req.Body.Password)); err != nil {
		return nil, err
	}
	if _, err := a.pool.Exec(ctx, `INSERT INTO user_staff_roles(user_id,role) VALUES($1,'owner')`, user); err != nil {
		return nil, err
	}
	return api.PostAuthBootstrapOwner201JSONResponse{"user_id": user.String()}, nil
}
func (a *apiImpl) PostAuthInvite(ctx context.Context, req api.PostAuthInviteRequestObject) (api.PostAuthInviteResponseObject, error) {
	id, ok := ctx.Value(authUserKey).(uuid.UUID)
	if !ok || req.Body == nil {
		return api.PostAuthInvite401JSONResponse(api.ErrorEnvelope{}), nil
	}
	var gym uuid.UUID
	var role string
	if a.pool.QueryRow(ctx, `SELECT gym_id FROM users WHERE id=$1`, id).Scan(&gym) != nil || a.pool.QueryRow(ctx, `SELECT role FROM user_staff_roles WHERE user_id=$1 AND role IN ('owner','manager') LIMIT 1`, id).Scan(&role) != nil {
		return api.PostAuthInvite403JSONResponse(api.ErrorEnvelope{}), nil
	}
	raw := make([]byte, 32)
	_, _ = rand.Read(raw)
	token := base64.RawURLEncoding.EncodeToString(raw)
	iid := newUUID()
	roles := make([]string, len(req.Body.Roles))
	for i, r := range req.Body.Roles {
		roles[i] = string(r)
	}
	if _, err := a.pool.Exec(ctx, `INSERT INTO staff_invites(id,gym_id,email,token_hash,roles,expires_at) VALUES($1,$2,$3,$4,$5,$6)`, iid, gym, req.Body.Email, tokenHash(token), roles, time.Now().Add(72*time.Hour)); err != nil {
		return nil, err
	}
	_, _ = a.pool.Exec(ctx, `INSERT INTO notification_outbox(id,gym_id,kind,recipient,payload) VALUES($1,$2,'staff_invite',$3,$4)`, newUUID(), gym, req.Body.Email, fmt.Sprintf(`{"invite_id":%q,"token":%q}`, iid.String(), token))
	return api.PostAuthInvite201JSONResponse{InviteId: &iid, Email: &req.Body.Email, Roles: &req.Body.Roles}, nil
}
func (a *apiImpl) PostAuthInviteAccept(ctx context.Context, req api.PostAuthInviteAcceptRequestObject) (api.PostAuthInviteAcceptResponseObject, error) {
	if req.Body == nil {
		return api.PostAuthInviteAccept400JSONResponse{}, nil
	}
	var iid uuid.UUID
	var gym uuid.UUID
	var email string
	var roles []string
	if err := a.pool.QueryRow(ctx, `UPDATE staff_invites SET accepted_at=now() WHERE token_hash=$1 AND accepted_at IS NULL AND expires_at>now() RETURNING id,gym_id,email,roles`, tokenHash(req.Body.Token)).Scan(&iid, &gym, &email, &roles); err != nil {
		return api.PostAuthInviteAccept409JSONResponse(api.ErrorEnvelope{}), nil
	}
	var uid uuid.UUID
	if err := a.pool.QueryRow(ctx, `SELECT id FROM users WHERE gym_id=$1 AND lower(email)=lower($2)`, gym, email).Scan(&uid); err != nil {
		uid = newUUID()
		if _, err = a.pool.Exec(ctx, `INSERT INTO users(id,gym_id,email,password_hash,name) VALUES($1,$2,$3,$4,$5)`, uid, gym, email, hashPassword(req.Body.Password), req.Body.Name); err != nil {
			return nil, err
		}
	} else {
		_, _ = a.pool.Exec(ctx, `UPDATE users SET password_hash=$1,name=COALESCE($2,name) WHERE id=$3`, hashPassword(req.Body.Password), req.Body.Name, uid)
	}
	for _, r := range roles {
		_, _ = a.pool.Exec(ctx, `INSERT INTO user_staff_roles(user_id,role) VALUES($1,$2) ON CONFLICT DO NOTHING`, uid, r)
	}
	return api.PostAuthInviteAccept201JSONResponse{UserId: &uid}, nil
}
func (a *apiImpl) PostAuthPasswordChange(ctx context.Context, req api.PostAuthPasswordChangeRequestObject) (api.PostAuthPasswordChangeResponseObject, error) {
	id, ok := ctx.Value(authUserKey).(uuid.UUID)
	if !ok || req.Body == nil {
		return api.PostAuthPasswordChange401JSONResponse(api.ErrorEnvelope{}), nil
	}
	var hash string
	if err := a.pool.QueryRow(ctx, `SELECT password_hash FROM users WHERE id=$1`, id).Scan(&hash); err != nil || !verifyPassword(req.Body.CurrentPassword, hash) {
		return api.PostAuthPasswordChange403JSONResponse(api.ErrorEnvelope{}), nil
	}
	_, err := a.pool.Exec(ctx, `UPDATE users SET password_hash=$1,updated_at=now() WHERE id=$2`, hashPassword(req.Body.NewPassword), id)
	if err != nil {
		return nil, err
	}
	_, _ = a.pool.Exec(ctx, `UPDATE refresh_tokens SET revoked_at=now() WHERE user_id=$1`, id)
	return api.PostAuthPasswordChange204Response{}, nil
}
func (a *apiImpl) PostAuthPasswordForgot(ctx context.Context, req api.PostAuthPasswordForgotRequestObject) (api.PostAuthPasswordForgotResponseObject, error) {
	if req.Body != nil {
		var id uuid.UUID
		if a.pool.QueryRow(ctx, `SELECT id FROM users WHERE lower(email)=lower($1)`, req.Body.Email).Scan(&id) == nil {
			raw := make([]byte, 32)
			_, _ = rand.Read(raw)
			_, _ = a.pool.Exec(ctx, `INSERT INTO auth_tokens(id,user_id,token_hash,kind,expires_at) VALUES($1,$2,$3,'reset',$4)`, newUUID(), id, tokenHash(base64.RawURLEncoding.EncodeToString(raw)), time.Now().Add(time.Hour))
		}
	}
	return api.PostAuthPasswordForgot202Response{}, nil
}
func (a *apiImpl) PostAuthPasswordReset(ctx context.Context, req api.PostAuthPasswordResetRequestObject) (api.PostAuthPasswordResetResponseObject, error) {
	if req.Body == nil {
		return api.PostAuthPasswordReset400JSONResponse{}, nil
	}
	var id uuid.UUID
	err := a.pool.QueryRow(ctx, `UPDATE auth_tokens SET used_at=now() WHERE token_hash=$1 AND kind='reset' AND used_at IS NULL AND expires_at>now() RETURNING user_id`, tokenHash(req.Body.Token)).Scan(&id)
	if err != nil {
		return api.PostAuthPasswordReset401JSONResponse(api.ErrorEnvelope{}), nil
	}
	if _, err = a.pool.Exec(ctx, `UPDATE users SET password_hash=$1,updated_at=now() WHERE id=$2`, hashPassword(req.Body.NewPassword), id); err != nil {
		return nil, err
	}
	_, _ = a.pool.Exec(ctx, `UPDATE refresh_tokens SET revoked_at=now() WHERE user_id=$1`, id)
	return api.PostAuthPasswordReset204Response{}, nil
}
func (a *apiImpl) PostAuthVerifyEmail(ctx context.Context, _ api.PostAuthVerifyEmailRequestObject) (api.PostAuthVerifyEmailResponseObject, error) {
	token, err := a.startVerification(ctx, "email")
	if err != nil {
		return api.PostAuthVerifyEmail403JSONResponse(api.ErrorEnvelope{}), nil
	}
	return api.PostAuthVerifyEmail201JSONResponse{"token": token}, nil
}
func (a *apiImpl) PostAuthVerifyPhone(ctx context.Context, _ api.PostAuthVerifyPhoneRequestObject) (api.PostAuthVerifyPhoneResponseObject, error) {
	token, err := a.startVerification(ctx, "phone")
	if err != nil {
		return api.PostAuthVerifyPhone403JSONResponse(api.ErrorEnvelope{}), nil
	}
	return api.PostAuthVerifyPhone201JSONResponse{"token": token}, nil
}
func (a *apiImpl) startVerification(ctx context.Context, kind string) (string, error) {
	id, ok := ctx.Value(authUserKey).(uuid.UUID)
	if !ok {
		return "", errors.New("unauthorized")
	}
	raw := make([]byte, 32)
	_, _ = rand.Read(raw)
	tok := base64.RawURLEncoding.EncodeToString(raw)
	var gym uuid.UUID
	var recipient string
	if a.pool.QueryRow(ctx, `SELECT gym_id,COALESCE(email,'') FROM users WHERE id=$1`, id).Scan(&gym, &recipient) != nil {
		return "", errors.New("user not found")
	}
	_, _ = a.pool.Exec(ctx, `INSERT INTO auth_tokens(id,user_id,token_hash,kind,expires_at) VALUES($1,$2,$3,$4,$5)`, newUUID(), id, tokenHash(tok), kind, time.Now().Add(time.Hour))
	_, _ = a.pool.Exec(ctx, `INSERT INTO notification_outbox(id,gym_id,kind,recipient,payload) VALUES($1,$2,$3,$4,$5)`, newUUID(), gym, "verify_"+kind, recipient, fmt.Sprintf(`{"token":%q}`, tok))
	return tok, nil
}
func (a *apiImpl) PostAuthVerifyConfirm(ctx context.Context, req api.PostAuthVerifyConfirmRequestObject) (api.PostAuthVerifyConfirmResponseObject, error) {
	if req.Body == nil {
		return api.PostAuthVerifyConfirm400JSONResponse{}, nil
	}
	var id uuid.UUID
	var kind string
	if err := a.pool.QueryRow(ctx, `UPDATE auth_tokens SET used_at=now() WHERE token_hash=$1 AND used_at IS NULL AND expires_at>now() RETURNING user_id,kind`, tokenHash(req.Body.Token)).Scan(&id, &kind); err != nil {
		return api.PostAuthVerifyConfirm400JSONResponse{}, nil
	}
	if kind == "email" {
		_, _ = a.pool.Exec(ctx, `UPDATE users SET email_verified_at=now() WHERE id=$1`, id)
	} else {
		_, _ = a.pool.Exec(ctx, `UPDATE users SET phone_verified_at=now() WHERE id=$1`, id)
	}
	return api.PostAuthVerifyConfirm201JSONResponse{"verified": true}, nil
}
