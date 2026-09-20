package httpserver

import (
	"context"
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"gympulse-server/internal/http/api"
)

func (a *apiImpl) authGym(ctx context.Context) (uuid.UUID, bool) {
	id, ok := ctx.Value(authUserKey).(uuid.UUID)
	if !ok {
		return uuid.Nil, false
	}
	var gym uuid.UUID
	if a.pool.QueryRow(ctx, `SELECT gym_id FROM users WHERE id=$1 AND deactivated_at IS NULL`, id).Scan(&gym) != nil {
		return uuid.Nil, false
	}
	return gym, true
}
func (a *apiImpl) authManager(ctx context.Context) (uuid.UUID, bool) {
	gym, ok := a.authGym(ctx)
	if !ok {
		return uuid.Nil, false
	}

	id := ctx.Value(authUserKey).(uuid.UUID)
	var role string
	if a.pool.QueryRow(ctx, `SELECT role FROM user_staff_roles WHERE user_id=$1 AND role IN ('owner','manager')`, id).Scan(&role) != nil {
		return uuid.Nil, false
	}
	return gym, true
}

func (a *apiImpl) audit(ctx context.Context, gym, actor, entity uuid.UUID, action, kind string, details map[string]interface{}) {
	data, _ := json.Marshal(details)
	_, _ = a.pool.Exec(ctx, `INSERT INTO audit_events(id,gym_id,actor_user_id,action,entity_type,entity_id,details) VALUES($1,$2,$3,$4,$5,$6,$7)`, newUUID(), gym, actor, action, kind, entity, data)
}

func (a *apiImpl) ListAuditEvents(ctx context.Context, _ api.ListAuditEventsRequestObject) (api.ListAuditEventsResponseObject, error) {
	id, ok := ctx.Value(authUserKey).(uuid.UUID)
	if !ok {
		return api.ListAuditEvents401JSONResponse(api.ErrorEnvelope{}), nil
	}
	var gym uuid.UUID
	if err := a.pool.QueryRow(ctx, `SELECT gym_id FROM users WHERE id=$1`, id).Scan(&gym); err != nil {
		return api.ListAuditEvents403JSONResponse(api.ErrorEnvelope{}), nil
	}
	var role string
	if err := a.pool.QueryRow(ctx, `SELECT role FROM user_staff_roles WHERE user_id=$1 AND role IN ('owner','manager') LIMIT 1`, id).Scan(&role); err != nil {
		return api.ListAuditEvents403JSONResponse(api.ErrorEnvelope{}), nil
	}
	rows, err := a.pool.Query(ctx, `SELECT id,action,entity_type,entity_id,details,created_at FROM audit_events WHERE gym_id=$1 ORDER BY created_at DESC LIMIT 100`, gym)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []api.JsonObject{}
	for rows.Next() {
		var eid, entity *uuid.UUID
		var action, typ string
		var details []byte
		var created time.Time
		if err := rows.Scan(&eid, &action, &typ, &entity, &details, &created); err != nil {
			return nil, err
		}
		var d map[string]interface{}
		_ = json.Unmarshal(details, &d)
		items = append(items, api.JsonObject{"id": eid, "action": action, "entity_type": typ, "entity_id": entity, "details": d, "created_at": created})
	}
	return api.ListAuditEvents200JSONResponse{Items: items}, nil
}
func (a *apiImpl) ListBranches(ctx context.Context, _ api.ListBranchesRequestObject) (api.ListBranchesResponseObject, error) {
	gym, ok := a.authManager(ctx)
	if !ok {
		return api.ListBranches401JSONResponse(api.ErrorEnvelope{}), nil
	}
	rows, err := a.pool.Query(ctx, `SELECT id,name,address,phone FROM branches WHERE gym_id=$1 AND archived_at IS NULL ORDER BY name`, gym)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []api.JsonObject{}
	for rows.Next() {
		var id uuid.UUID
		var name string
		var address, phone *string
		if err := rows.Scan(&id, &name, &address, &phone); err != nil {
			return nil, err
		}
		items = append(items, api.JsonObject{"id": id, "name": name, "address": address, "phone": phone})
	}
	return api.ListBranches200JSONResponse{"items": items}, nil
}
func (a *apiImpl) CreateBranch(ctx context.Context, req api.CreateBranchRequestObject) (api.CreateBranchResponseObject, error) {
	gym, ok := a.authGym(ctx)
	if !ok || req.Body == nil {
		return api.CreateBranch403JSONResponse(api.ErrorEnvelope{}), nil
	}
	id := newUUID()
	_, err := a.pool.Exec(ctx, `INSERT INTO branches(id,gym_id,name,address,phone) VALUES($1,$2,$3,$4,$5)`, id, gym, req.Body.Name, req.Body.Address, req.Body.Phone)
	if err != nil {
		return nil, err
	}
	return api.CreateBranch201JSONResponse{"id": id, "name": req.Body.Name, "address": req.Body.Address, "phone": req.Body.Phone}, nil
}
func (a *apiImpl) GetBranch(ctx context.Context, req api.GetBranchRequestObject) (api.GetBranchResponseObject, error) {
	gym, ok := a.authGym(ctx)
	if !ok {
		return api.GetBranch403JSONResponse(api.ErrorEnvelope{}), nil
	}
	var name string
	var address, phone *string
	if err := a.pool.QueryRow(ctx, `SELECT name,address,phone FROM branches WHERE id=$1 AND gym_id=$2`, req.BranchId, gym).Scan(&name, &address, &phone); err != nil {
		return api.GetBranch404JSONResponse(api.ErrorEnvelope{}), nil
	}
	return api.GetBranch200JSONResponse{"id": req.BranchId, "name": name, "address": address, "phone": phone}, nil
}
func (a *apiImpl) PatchBranch(ctx context.Context, req api.PatchBranchRequestObject) (api.PatchBranchResponseObject, error) {
	gym, ok := a.authManager(ctx)
	if !ok || req.Body == nil {
		return api.PatchBranch403JSONResponse(api.ErrorEnvelope{}), nil
	}
	b := req.Body
	_, err := a.pool.Exec(ctx, `UPDATE branches SET name=COALESCE($1,name),address=COALESCE($2,address),phone=COALESCE($3,phone),updated_at=now() WHERE id=$4 AND gym_id=$5`, b.Name, b.Address, b.Phone, req.BranchId, gym)
	if err != nil {
		return nil, err
	}
	return api.PatchBranch200JSONResponse{"id": req.BranchId}, nil
}
func (a *apiImpl) ArchiveBranch(ctx context.Context, req api.ArchiveBranchRequestObject) (api.ArchiveBranchResponseObject, error) {
	gym, ok := a.authManager(ctx)
	if !ok {
		return api.ArchiveBranch403JSONResponse(api.ErrorEnvelope{}), nil
	}
	_, err := a.pool.Exec(ctx, `UPDATE branches SET archived_at=now(),updated_at=now() WHERE id=$1 AND gym_id=$2`, req.BranchId, gym)
	if err != nil {
		return nil, err
	}
	return api.ArchiveBranch200JSONResponse{"id": req.BranchId}, nil
}
func (a *apiImpl) GetGym(ctx context.Context, _ api.GetGymRequestObject) (api.GetGymResponseObject, error) {
	id, ok := ctx.Value(authUserKey).(uuid.UUID)
	if !ok {
		return api.GetGym401JSONResponse(api.ErrorEnvelope{}), nil
	}
	var gym uuid.UUID
	if err := a.pool.QueryRow(ctx, `SELECT gym_id FROM users WHERE id=$1`, id).Scan(&gym); err != nil {
		return api.GetGym403JSONResponse(api.ErrorEnvelope{}), nil
	}
	var name, tz, currency string
	var phone, email, address *string
	if err := a.pool.QueryRow(ctx, `SELECT name,timezone,currency,phone,email,address FROM gyms WHERE id=$1`, gym).Scan(&name, &tz, &currency, &phone, &email, &address); err != nil {
		return api.GetGym404JSONResponse(api.ErrorEnvelope{}), nil
	}
	return api.GetGym200JSONResponse{"id": gym, "name": name, "timezone": tz, "currency": currency, "phone": phone, "email": email, "address": address}, nil
}
func (a *apiImpl) PatchGym(ctx context.Context, req api.PatchGymRequestObject) (api.PatchGymResponseObject, error) {
	id, ok := ctx.Value(authUserKey).(uuid.UUID)
	if !ok || req.Body == nil {
		return api.PatchGym401JSONResponse(api.ErrorEnvelope{}), nil
	}
	var gym uuid.UUID
	if err := a.pool.QueryRow(ctx, `SELECT gym_id FROM users WHERE id=$1`, id).Scan(&gym); err != nil {
		return api.PatchGym403JSONResponse(api.ErrorEnvelope{}), nil
	}
	var role string
	if err := a.pool.QueryRow(ctx, `SELECT role FROM user_staff_roles WHERE user_id=$1 AND role IN ('owner','manager') LIMIT 1`, id).Scan(&role); err != nil {
		return api.PatchGym403JSONResponse(api.ErrorEnvelope{}), nil
	}
	b := req.Body
	_, err := a.pool.Exec(ctx, `UPDATE gyms SET name=COALESCE($1,name),timezone=COALESCE($2,timezone),currency=COALESCE($3,currency),phone=COALESCE($4,phone),email=COALESCE($5,email),address=COALESCE($6,address),updated_at=now() WHERE id=$7`, b.Name, b.Timezone, b.Currency, b.Phone, b.Email, b.Address, gym)
	if err != nil {
		return nil, err
	}
	return api.PatchGym200JSONResponse{"id": gym}, nil
}
func (a *apiImpl) GetGymBranding(ctx context.Context, _ api.GetGymBrandingRequestObject) (api.GetGymBrandingResponseObject, error) {
	gym, ok := a.authGym(ctx)
	if !ok {
		return api.GetGymBranding401JSONResponse(api.ErrorEnvelope{}), nil
	}
	var logo *uuid.UUID
	var color, tag *string
	if err := a.pool.QueryRow(ctx, `SELECT logo_file_id,primary_color,public_tagline FROM gyms WHERE id=$1`, gym).Scan(&logo, &color, &tag); err != nil {
		return api.GetGymBranding404JSONResponse(api.ErrorEnvelope{}), nil
	}
	return api.GetGymBranding200JSONResponse{"logo_file_id": logo, "primary_color": color, "public_tagline": tag}, nil
}
func (a *apiImpl) PatchGymBranding(ctx context.Context, req api.PatchGymBrandingRequestObject) (api.PatchGymBrandingResponseObject, error) {
	gym, ok := a.authManager(ctx)
	if !ok || req.Body == nil {
		return api.PatchGymBranding403JSONResponse(api.ErrorEnvelope{}), nil
	}
	b := req.Body
	_, err := a.pool.Exec(ctx, `UPDATE gyms SET logo_file_id=COALESCE($1,logo_file_id),primary_color=COALESCE($2,primary_color),public_tagline=COALESCE($3,public_tagline),updated_at=now() WHERE id=$4`, b.LogoFileId, b.PrimaryColor, b.PublicTagline, gym)
	if err != nil {
		return nil, err
	}
	return api.PatchGymBranding200JSONResponse{"id": gym}, nil
}
func (a *apiImpl) ListStaff(ctx context.Context, _ api.ListStaffRequestObject) (api.ListStaffResponseObject, error) {
	gym, ok := a.authGym(ctx)
	if !ok {
		return api.ListStaff401JSONResponse(api.ErrorEnvelope{}), nil
	}
	rows, err := a.pool.Query(ctx, `SELECT id FROM users WHERE gym_id=$1 AND deactivated_at IS NULL ORDER BY created_at DESC LIMIT 100`, gym)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []api.JsonObject{}
	for rows.Next() {
		var id uuid.UUID
		if err := rows.Scan(&id); err != nil {
			return nil, err
		}
		s, _, err := a.summary(ctx, id)
		if err != nil {
			return nil, err
		}
		items = append(items, api.JsonObject{"id": s.Id, "gym_id": s.GymId, "email": s.Email, "name": s.Name, "staff_roles": s.StaffRoles, "has_member_profile": s.HasMemberProfile})
	}
	return api.ListStaff200JSONResponse{Items: items}, nil
}
func (a *apiImpl) GetStaff(ctx context.Context, req api.GetStaffRequestObject) (api.GetStaffResponseObject, error) {
	gym, ok := a.authManager(ctx)
	if !ok {
		return api.GetStaff403JSONResponse(api.ErrorEnvelope{}), nil
	}
	s, _, err := a.summary(ctx, req.StaffId)
	if err != nil || s.GymId != gym {
		return api.GetStaff404JSONResponse(api.ErrorEnvelope{}), nil
	}
	return api.GetStaff200JSONResponse{"id": s.Id, "gym_id": s.GymId, "email": s.Email, "name": s.Name, "staff_roles": s.StaffRoles, "has_member_profile": s.HasMemberProfile}, nil
}
func (a *apiImpl) PatchStaff(ctx context.Context, req api.PatchStaffRequestObject) (api.PatchStaffResponseObject, error) {
	gym, ok := a.authManager(ctx)
	if !ok || req.Body == nil {
		return api.PatchStaff403JSONResponse(api.ErrorEnvelope{}), nil
	}
	b := req.Body
	_, err := a.pool.Exec(ctx, `UPDATE users SET name=COALESCE($1,name),phone=COALESCE($2,phone),updated_at=now() WHERE id=$3 AND gym_id=$4`, b.Name, b.Phone, req.StaffId, gym)
	if err != nil {
		return nil, err
	}
	return api.PatchStaff200JSONResponse{"id": req.StaffId}, nil
}
func (a *apiImpl) PostStaffDeactivate(ctx context.Context, req api.PostStaffDeactivateRequestObject) (api.PostStaffDeactivateResponseObject, error) {
	gym, ok := a.authManager(ctx)
	if !ok {
		return api.PostStaffDeactivate403JSONResponse(api.ErrorEnvelope{}), nil
	}
	_, err := a.pool.Exec(ctx, `UPDATE users SET deactivated_at=now() WHERE id=$1 AND gym_id=$2`, req.StaffId, gym)
	if err != nil {
		return nil, err
	}
	return api.PostStaffDeactivate200JSONResponse{"id": req.StaffId}, nil
}
func (a *apiImpl) PostStaffReactivate(ctx context.Context, req api.PostStaffReactivateRequestObject) (api.PostStaffReactivateResponseObject, error) {
	gym, ok := a.authManager(ctx)
	if !ok {
		return api.PostStaffReactivate403JSONResponse(api.ErrorEnvelope{}), nil
	}
	_, err := a.pool.Exec(ctx, `UPDATE users SET deactivated_at=NULL WHERE id=$1 AND gym_id=$2`, req.StaffId, gym)
	if err != nil {
		return nil, err
	}
	return api.PostStaffReactivate200JSONResponse{"id": req.StaffId}, nil
}
func (a *apiImpl) PostStaffRevokeSessions(ctx context.Context, req api.PostStaffRevokeSessionsRequestObject) (api.PostStaffRevokeSessionsResponseObject, error) {
	gym, ok := a.authManager(ctx)
	if !ok {
		return api.PostStaffRevokeSessions403JSONResponse(api.ErrorEnvelope{}), nil
	}
	_, err := a.pool.Exec(ctx, `UPDATE refresh_tokens SET revoked_at=now() WHERE user_id=$1 AND user_id IN (SELECT id FROM users WHERE gym_id=$2)`, req.StaffId, gym)
	if err != nil {
		return nil, err
	}
	return api.PostStaffRevokeSessions204Response{}, nil
}
func (a *apiImpl) PutStaffRoles(ctx context.Context, req api.PutStaffRolesRequestObject) (api.PutStaffRolesResponseObject, error) {
	gym, ok := a.authManager(ctx)
	if !ok || req.Body == nil {
		return api.PutStaffRoles403JSONResponse(api.ErrorEnvelope{}), nil
	}

	var old int
	if err := a.pool.QueryRow(ctx, `SELECT count(*) FROM user_staff_roles r JOIN users u ON u.id=r.user_id WHERE u.gym_id=$1 AND r.role='owner' AND r.user_id=$2`, gym, req.StaffId).Scan(&old); err != nil {
		return nil, err
	}
	hasOwner := false
	for _, r := range req.Body.Roles {
		if r == api.Owner {
			hasOwner = true
		}
	}
	if old > 0 && !hasOwner {
		return api.PutStaffRoles409JSONResponse(api.ErrorEnvelope{}), nil
	}
	_, _ = a.pool.Exec(ctx, `DELETE FROM user_staff_roles WHERE user_id=$1`, req.StaffId)
	for _, r := range req.Body.Roles {
		_, _ = a.pool.Exec(ctx, `INSERT INTO user_staff_roles(user_id,role) VALUES($1,$2)`, req.StaffId, string(r))
	}
	a.audit(ctx, gym, ctx.Value(authUserKey).(uuid.UUID), req.StaffId, "staff.roles.updated", "user", map[string]interface{}{"roles": req.Body.Roles})
	return api.PutStaffRoles200JSONResponse{"id": req.StaffId, "roles": req.Body.Roles}, nil
}

func (a *apiImpl) GetBranchHours(ctx context.Context, req api.GetBranchHoursRequestObject) (api.GetBranchHoursResponseObject, error) {
	gym, ok := a.authGym(ctx)
	if !ok {
		return api.GetBranchHours401JSONResponse(api.ErrorEnvelope{}), nil
	}
	rows, err := a.pool.Query(ctx, `SELECT weekday,opens_at::text,closes_at::text FROM branch_hours WHERE branch_id=$1 AND branch_id IN (SELECT id FROM branches WHERE gym_id=$2) ORDER BY weekday`, req.BranchId, gym)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []api.JsonObject{}
	for rows.Next() {
		var day int
		var open, close string
		if err := rows.Scan(&day, &open, &close); err != nil {
			return nil, err
		}
		items = append(items, api.JsonObject{"weekday": day, "opens_at": open, "closes_at": close})
	}
	return api.GetBranchHours200JSONResponse{"items": items}, nil
}

func (a *apiImpl) PutBranchHours(ctx context.Context, req api.PutBranchHoursRequestObject) (api.PutBranchHoursResponseObject, error) {
	gym, ok := a.authManager(ctx)
	if !ok || req.Body == nil {
		return api.PutBranchHours403JSONResponse(api.ErrorEnvelope{}), nil
	}
	if _, err := a.pool.Exec(ctx, `DELETE FROM branch_hours WHERE branch_id=$1`, req.BranchId); err != nil {
		return nil, err
	}
	for _, day := range req.Body.Days {
		if day.Closed || day.Intervals == nil {
			continue
		}
		for _, interval := range *day.Intervals {
			if _, err := a.pool.Exec(ctx, `INSERT INTO branch_hours(id,branch_id,weekday,opens_at,closes_at) VALUES($1,$2,$3,$4,$5)`, newUUID(), req.BranchId, day.Weekday, interval.OpensAt, interval.ClosesAt); err != nil {
				return nil, err
			}
		}
	}
	return api.PutBranchHours200JSONResponse{"branch_id": req.BranchId, "gym_id": gym}, nil
}

func (a *apiImpl) ListHolidays(ctx context.Context, _ api.ListHolidaysRequestObject) (api.ListHolidaysResponseObject, error) {
	gym, ok := a.authGym(ctx)
	if !ok {
		return api.ListHolidays401JSONResponse(api.ErrorEnvelope{}), nil
	}
	rows, err := a.pool.Query(ctx, `SELECT id,date,name FROM gym_holidays WHERE gym_id=$1 ORDER BY date`, gym)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []api.JsonObject{}
	for rows.Next() {
		var id uuid.UUID
		var date time.Time
		var name string
		if err := rows.Scan(&id, &date, &name); err != nil {
			return nil, err
		}
		items = append(items, api.JsonObject{"id": id, "date": date.Format("2006-01-02"), "name": name})
	}
	return api.ListHolidays200JSONResponse{"items": items}, nil
}

func (a *apiImpl) CreateHoliday(ctx context.Context, req api.CreateHolidayRequestObject) (api.CreateHolidayResponseObject, error) {
	gym, ok := a.authManager(ctx)
	if !ok || req.Body == nil {
		return api.CreateHoliday403JSONResponse(api.ErrorEnvelope{}), nil
	}
	id := newUUID()
	if _, err := a.pool.Exec(ctx, `INSERT INTO gym_holidays(id,gym_id,date,name) VALUES($1,$2,$3,$4)`, id, gym, req.Body.Date, req.Body.Name); err != nil {
		return nil, err
	}
	return api.CreateHoliday201JSONResponse{"id": id, "name": req.Body.Name}, nil
}

func (a *apiImpl) DeleteHoliday(ctx context.Context, req api.DeleteHolidayRequestObject) (api.DeleteHolidayResponseObject, error) {
	gym, ok := a.authManager(ctx)
	if !ok {
		return api.DeleteHoliday403JSONResponse(api.ErrorEnvelope{}), nil
	}
	if _, err := a.pool.Exec(ctx, `DELETE FROM gym_holidays WHERE id=$1 AND gym_id=$2`, req.HolidayId, gym); err != nil {
		return nil, err
	}
	return api.DeleteHoliday204Response{}, nil
}
