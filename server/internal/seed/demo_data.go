package seed

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

// seedDemoContent fills the gym with realistic rows so admin + PWA are not empty.
// Idempotent: skips when demo markers already exist.
func seedDemoContent(ctx context.Context, pool *pgxpool.Pool, gymID, branchID uuid.UUID) error {
	ownerID, err := userIDByEmail(ctx, pool, gymID, "owner@gympulse.local")
	if err != nil {
		return err
	}
	trainerID, err := userIDByEmail(ctx, pool, gymID, "trainer@gympulse.local")
	if err != nil {
		return err
	}
	memberUserID, err := userIDByEmail(ctx, pool, gymID, "member@gympulse.local")
	if err != nil {
		return err
	}
	memberID, err := memberIDByUser(ctx, pool, memberUserID)
	if err != nil {
		return err
	}

	if err := seedBranchHours(ctx, pool, branchID); err != nil {
		return err
	}
	if err := seedHoliday(ctx, pool, gymID); err != nil {
		return err
	}
	planIDs, err := seedPlans(ctx, pool, gymID)
	if err != nil {
		return err
	}
	extraMembers, err := seedExtraMembers(ctx, pool, gymID, branchID)
	if err != nil {
		return err
	}
	allMembers := append([]uuid.UUID{memberID}, extraMembers...)
	if err := seedMemberships(ctx, pool, gymID, allMembers, planIDs, ownerID); err != nil {
		return err
	}
	if err := seedLeads(ctx, pool, gymID); err != nil {
		return err
	}
	classTypes, err := seedClassTypes(ctx, pool, gymID)
	if err != nil {
		return err
	}
	sessions, err := seedSessions(ctx, pool, gymID, branchID, trainerID, classTypes)
	if err != nil {
		return err
	}
	if err := seedBookings(ctx, pool, gymID, sessions, allMembers); err != nil {
		return err
	}
	if err := seedCheckins(ctx, pool, gymID, branchID, allMembers); err != nil {
		return err
	}
	if err := seedBilling(ctx, pool, gymID, allMembers, ownerID); err != nil {
		return err
	}
	if err := seedTrainerExtras(ctx, pool, gymID, branchID, trainerID, allMembers, ownerID); err != nil {
		return err
	}
	if err := seedWorkouts(ctx, pool, gymID, allMembers, trainerID); err != nil {
		return err
	}
	return nil
}

func userIDByEmail(ctx context.Context, pool *pgxpool.Pool, gymID uuid.UUID, email string) (uuid.UUID, error) {
	var id uuid.UUID
	err := pool.QueryRow(ctx, `SELECT id FROM users WHERE gym_id=$1 AND lower(email)=lower($2)`, gymID, email).Scan(&id)
	return id, err
}

func memberIDByUser(ctx context.Context, pool *pgxpool.Pool, userID uuid.UUID) (uuid.UUID, error) {
	var id uuid.UUID
	err := pool.QueryRow(ctx, `SELECT id FROM members WHERE user_id=$1`, userID).Scan(&id)
	return id, err
}

func seedBranchHours(ctx context.Context, pool *pgxpool.Pool, branchID uuid.UUID) error {
	var n int
	if err := pool.QueryRow(ctx, `SELECT count(*) FROM branch_hours WHERE branch_id=$1`, branchID).Scan(&n); err != nil {
		return err
	}
	if n > 0 {
		return nil
	}
	for weekday := 1; weekday <= 7; weekday++ {
		opens, closes := "06:00", "22:00"
		if weekday >= 6 {
			opens, closes = "08:00", "20:00"
		}
		if _, err := pool.Exec(ctx,
			`INSERT INTO branch_hours(id,branch_id,weekday,opens_at,closes_at) VALUES($1,$2,$3,$4::time,$5::time)`,
			newID(), branchID, weekday, opens, closes,
		); err != nil {
			return err
		}
	}
	return nil
}

func seedHoliday(ctx context.Context, pool *pgxpool.Pool, gymID uuid.UUID) error {
	var n int
	if err := pool.QueryRow(ctx, `SELECT count(*) FROM gym_holidays WHERE gym_id=$1`, gymID).Scan(&n); err != nil {
		return err
	}
	if n > 0 {
		return nil
	}
	_, err := pool.Exec(ctx,
		`INSERT INTO gym_holidays(id,gym_id,date,name) VALUES($1,$2,CURRENT_DATE + 30,'Staff training day')`,
		newID(), gymID,
	)
	return err
}

func seedPlans(ctx context.Context, pool *pgxpool.Pool, gymID uuid.UUID) ([]uuid.UUID, error) {
	plans := []struct {
		name  string
		price int64
		desc  string
	}{
		{"Basic", 15000, "Gym floor + locker"},
		{"Standard", 20000, "Unlimited classes + sauna"},
		{"Premium", 25000, "PT sessions + nutrition"},
	}
	ids := make([]uuid.UUID, 0, len(plans))
	for _, p := range plans {
		var id uuid.UUID
		err := pool.QueryRow(ctx, `SELECT id FROM membership_plans WHERE gym_id=$1 AND name=$2`, gymID, p.name).Scan(&id)
		if err != nil {
			id = newID()
			if _, err := pool.Exec(ctx,
				`INSERT INTO membership_plans(id,gym_id,name,description,price_minor,currency,period_unit,period_count)
				 VALUES($1,$2,$3,$4,$5,'USD','month',1)`,
				id, gymID, p.name, p.desc, p.price,
			); err != nil {
				return nil, err
			}
		}
		ids = append(ids, id)
	}
	return ids, nil
}

func seedExtraMembers(ctx context.Context, pool *pgxpool.Pool, gymID, branchID uuid.UUID) ([]uuid.UUID, error) {
	people := []struct{ email, name, code string }{
		{"alex.member@gympulse.local", "Alex Member", "M-ALEX01"},
		{"sam.member@gympulse.local", "Sam Member", "M-SAM01"},
		{"jordan.member@gympulse.local", "Jordan Member", "M-JORD01"},
		{"chris.member@gympulse.local", "Chris Member", "M-CHRIS1"},
		{"morgan.member@gympulse.local", "Morgan Member", "M-MORG01"},
		{"riley.member@gympulse.local", "Riley Member", "M-RILEY1"},
		{"casey.member@gympulse.local", "Casey Member", "M-CASEY1"},
		{"taylor.member@gympulse.local", "Taylor Member", "M-TAYL01"},
	}
	ids := make([]uuid.UUID, 0, len(people))
	hash := hashPassword(DefaultPassword)
	for _, p := range people {
		var userID uuid.UUID
		err := pool.QueryRow(ctx, `SELECT id FROM users WHERE gym_id=$1 AND lower(email)=lower($2)`, gymID, p.email).Scan(&userID)
		if err != nil {
			userID = newID()
			if _, err := pool.Exec(ctx,
				`INSERT INTO users(id,gym_id,email,password_hash,name) VALUES($1,$2,$3,$4,$5)`,
				userID, gymID, p.email, hash, p.name,
			); err != nil {
				return nil, err
			}
		}
		var memberID uuid.UUID
		err = pool.QueryRow(ctx, `SELECT id FROM members WHERE user_id=$1`, userID).Scan(&memberID)
		if err != nil {
			memberID = newID()
			if _, err := pool.Exec(ctx,
				`INSERT INTO members(id,gym_id,branch_id,user_id,member_code,status)
				 VALUES($1,$2,$3,$4,$5,'active')`,
				memberID, gymID, branchID, userID, p.code,
			); err != nil {
				return nil, err
			}
		}
		ids = append(ids, memberID)
	}
	return ids, nil
}

func seedMemberships(ctx context.Context, pool *pgxpool.Pool, gymID uuid.UUID, members, plans []uuid.UUID, actor uuid.UUID) error {
	for i, mid := range members {
		var n int
		if err := pool.QueryRow(ctx, `SELECT count(*) FROM memberships WHERE member_id=$1 AND status='active'`, mid).Scan(&n); err != nil {
			return err
		}
		if n > 0 {
			continue
		}
		plan := plans[i%len(plans)]
		if _, err := pool.Exec(ctx,
			`INSERT INTO memberships(id,gym_id,member_id,plan_id,starts_at,ends_at,status,created_by)
			 VALUES($1,$2,$3,$4,now()-interval '10 days',now()+interval '50 days','active',$5)`,
			newID(), gymID, mid, plan, actor,
		); err != nil {
			return err
		}
	}
	return nil
}

func seedLeads(ctx context.Context, pool *pgxpool.Pool, gymID uuid.UUID) error {
	var n int
	if err := pool.QueryRow(ctx, `SELECT count(*) FROM leads WHERE gym_id=$1`, gymID).Scan(&n); err != nil {
		return err
	}
	if n > 0 {
		return nil
	}
	leads := []struct{ name, email, phone, msg string }{
		{"Taylor Prospect", "taylor@example.com", "+15550101111", "Interested in Premium trial"},
		{"Riley Walkin", "riley@example.com", "+15550102222", "Saw the landing page"},
		{"Casey Trial", "casey@example.com", "+15550103333", "Want morning classes"},
	}
	for _, l := range leads {
		if _, err := pool.Exec(ctx,
			`INSERT INTO leads(id,gym_id,name,email,phone,message,source,status)
			 VALUES($1,$2,$3,$4,$5,$6,'public','open')`,
			newID(), gymID, l.name, l.email, l.phone, l.msg,
		); err != nil {
			return err
		}
	}
	return nil
}

func seedClassTypes(ctx context.Context, pool *pgxpool.Pool, gymID uuid.UUID) ([]uuid.UUID, error) {
	types := []struct {
		name string
		cap  int
	}{
		{"Fitness", 20},
		{"Yoga", 15},
		{"HIIT", 18},
		{"Strength", 12},
	}
	ids := make([]uuid.UUID, 0, len(types))
	for _, t := range types {
		var id uuid.UUID
		err := pool.QueryRow(ctx, `SELECT id FROM class_types WHERE gym_id=$1 AND name=$2`, gymID, t.name).Scan(&id)
		if err != nil {
			id = newID()
			if _, err := pool.Exec(ctx,
				`INSERT INTO class_types(id,gym_id,name,description,capacity) VALUES($1,$2,$3,$4,$5)`,
				id, gymID, t.name, t.name+" group class", t.cap,
			); err != nil {
				return nil, err
			}
		}
		ids = append(ids, id)
	}
	return ids, nil
}

func seedSessions(ctx context.Context, pool *pgxpool.Pool, gymID, branchID, trainer uuid.UUID, classTypes []uuid.UUID) ([]uuid.UUID, error) {
	var n int
	if err := pool.QueryRow(ctx, `SELECT count(*) FROM class_sessions WHERE gym_id=$1 AND starts_at>now()`, gymID).Scan(&n); err != nil {
		return nil, err
	}
	if n >= 8 {
		rows, err := pool.Query(ctx, `SELECT id FROM class_sessions WHERE gym_id=$1 AND starts_at>now() ORDER BY starts_at LIMIT 12`, gymID)
		if err != nil {
			return nil, err
		}
		defer rows.Close()
		var ids []uuid.UUID
		for rows.Next() {
			var id uuid.UUID
			if rows.Scan(&id) == nil {
				ids = append(ids, id)
			}
		}
		return ids, nil
	}
	ids := make([]uuid.UUID, 0, 12)
	now := time.Now().UTC().Truncate(time.Hour)
	for i := 0; i < 12; i++ {
		start := now.Add(time.Duration(i+1) * 6 * time.Hour)
		end := start.Add(55 * time.Minute)
		ct := classTypes[i%len(classTypes)]
		id := newID()
		cap := 16
		if _, err := pool.Exec(ctx,
			`INSERT INTO class_sessions(id,gym_id,branch_id,class_type_id,trainer_user_id,starts_at,ends_at,capacity)
			 VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
			id, gymID, branchID, ct, trainer, start, end, cap,
		); err != nil {
			return nil, err
		}
		ids = append(ids, id)
	}
	return ids, nil
}

func seedBookings(ctx context.Context, pool *pgxpool.Pool, gymID uuid.UUID, sessions, members []uuid.UUID) error {
	if len(sessions) == 0 || len(members) == 0 {
		return nil
	}
	for i, sid := range sessions {
		mid := members[i%len(members)]
		if _, err := pool.Exec(ctx,
			`INSERT INTO class_bookings(id,session_id,gym_id,member_id,status)
			 VALUES($1,$2,$3,$4,'booked') ON CONFLICT (session_id,member_id) DO NOTHING`,
			newID(), sid, gymID, mid,
		); err != nil {
			return err
		}
	}
	return nil
}

func seedCheckins(ctx context.Context, pool *pgxpool.Pool, gymID, branchID uuid.UUID, members []uuid.UUID) error {
	var n int
	if err := pool.QueryRow(ctx, `SELECT count(*) FROM attendance_events WHERE gym_id=$1`, gymID).Scan(&n); err != nil {
		return err
	}
	if n >= len(members) {
		return nil
	}
	for i, mid := range members {
		key := fmt.Sprintf("seed-checkin-%d", i)
		if _, err := pool.Exec(ctx,
			`INSERT INTO attendance_events(id,gym_id,branch_id,member_id,method,checked_in_at,idempotency_key)
			 VALUES($1,$2,$3,$4,'staff',now()-($5::int * interval '1 hour'),$6)
			 ON CONFLICT (gym_id, idempotency_key) DO NOTHING`,
			newID(), gymID, branchID, mid, i+1, key,
		); err != nil {
			return err
		}
	}
	return nil
}

func seedBilling(ctx context.Context, pool *pgxpool.Pool, gymID uuid.UUID, members []uuid.UUID, actor uuid.UUID) error {
	var n int
	if err := pool.QueryRow(ctx, `SELECT count(*) FROM invoices WHERE gym_id=$1`, gymID).Scan(&n); err != nil {
		return err
	}
	if n > 0 {
		// Still ensure pending screenshot payments exist for demo review queue
		return seedPendingScreenshotPayments(ctx, pool, gymID, members, actor)
	}
	statuses := []struct {
		status string
		paid   int64
		dueOff int
	}{
		{"unpaid", 0, -3},
		{"partial", 5000, 5},
		{"paid", 15000, -10},
		{"unpaid", 0, 14},
		{"unpaid", 0, 7},
		{"unpaid", 0, 21},
	}
	for i, mid := range members {
		st := statuses[i%len(statuses)]
		total := int64(15000 + (i%3)*2500)
		inv := newID()
		num := fmt.Sprintf("INV-SEED-%04d", i+1)
		if _, err := pool.Exec(ctx,
			`INSERT INTO invoices(id,gym_id,member_id,invoice_number,subtotal_minor,total_minor,paid_minor,due_at,status)
			 VALUES($1,$2,$3,$4,$5,$5,$6,now()+($7::int * interval '1 day'),$8)`,
			inv, gymID, mid, num, total, st.paid, st.dueOff, st.status,
		); err != nil {
			return err
		}
		if _, err := pool.Exec(ctx,
			`INSERT INTO invoice_lines(id,invoice_id,description,quantity,unit_price_minor)
			 VALUES($1,$2,'Monthly membership',1,$3)`,
			newID(), inv, total,
		); err != nil {
			return err
		}
		if st.paid > 0 {
			if _, err := pool.Exec(ctx,
				`INSERT INTO payments(id,gym_id,invoice_id,member_id,amount_minor,method,status,created_by,idempotency_key)
				 VALUES($1,$2,$3,$4,$5,'cash','approved',$6,$7)`,
				newID(), gymID, inv, mid, st.paid, actor, fmt.Sprintf("seed-pay-%d", i),
			); err != nil {
				return err
			}
		}
	}
	return seedPendingScreenshotPayments(ctx, pool, gymID, members, actor)
}

func seedPendingScreenshotPayments(ctx context.Context, pool *pgxpool.Pool, gymID uuid.UUID, members []uuid.UUID, actor uuid.UUID) error {
	var pending int
	_ = pool.QueryRow(ctx, `SELECT count(*) FROM payments WHERE gym_id=$1 AND status='pending'`, gymID).Scan(&pending)
	if pending >= 2 {
		return nil
	}
	providers := []string{"telebirr", "cbe"}
	for i := 0; i < 2 && i < len(members); i++ {
		mid := members[i]
		var inv uuid.UUID
		err := pool.QueryRow(ctx, `SELECT id FROM invoices WHERE gym_id=$1 AND member_id=$2 AND status IN ('unpaid','partial') ORDER BY due_at LIMIT 1`, gymID, mid).Scan(&inv)
		if err != nil {
			inv = newID()
			num := fmt.Sprintf("INV-PEND-%04d", i+1)
			if _, err := pool.Exec(ctx,
				`INSERT INTO invoices(id,gym_id,member_id,invoice_number,subtotal_minor,total_minor,paid_minor,due_at,status)
				 VALUES($1,$2,$3,$4,20000,20000,0,now()+interval '5 days','unpaid')`,
				inv, gymID, mid, num,
			); err != nil {
				return err
			}
			_, _ = pool.Exec(ctx,
				`INSERT INTO invoice_lines(id,invoice_id,description,quantity,unit_price_minor) VALUES($1,$2,'Membership dues',1,20000)`,
				newID(), inv,
			)
		}
		fileID := newID()
		key := fmt.Sprintf("seed/evidence-%d.png", i+1)
		_, _ = pool.Exec(ctx,
			`INSERT INTO files(id,gym_id,object_key,content_type,size_bytes,created_by) VALUES($1,$2,$3,'image/png',128,$4)
			 ON CONFLICT (gym_id, object_key) DO NOTHING`,
			fileID, gymID, key, actor,
		)
		_ = pool.QueryRow(ctx, `SELECT id FROM files WHERE gym_id=$1 AND object_key=$2`, gymID, key).Scan(&fileID)
		if _, err := pool.Exec(ctx,
			`INSERT INTO payments(id,gym_id,invoice_id,member_id,amount_minor,method,provider,reference,status,evidence_file_id,created_by,idempotency_key)
			 VALUES($1,$2,$3,$4,20000,'mobile_money',$5,$6,'pending',$7,$8,$9)
			 ON CONFLICT (gym_id, idempotency_key) DO NOTHING`,
			newID(), gymID, inv, mid, providers[i], fmt.Sprintf("TXN-SEED-%d", i+1), fileID, actor, fmt.Sprintf("seed-pending-%d", i),
		); err != nil {
			return err
		}
	}
	return nil
}

func seedTrainerExtras(ctx context.Context, pool *pgxpool.Pool, gymID, branchID, trainer uuid.UUID, members []uuid.UUID, actor uuid.UUID) error {
	extraTrainers := []struct{ email, name string }{
		{"alex.trainer@gympulse.local", "Alex Rivera"},
		{"sam.trainer@gympulse.local", "Sam Carter"},
		{"jordan.trainer@gympulse.local", "Jordan Lee"},
	}
	hash := hashPassword(DefaultPassword)
	trainerIDs := []uuid.UUID{trainer}
	for _, t := range extraTrainers {
		var id uuid.UUID
		err := pool.QueryRow(ctx, `SELECT id FROM users WHERE gym_id=$1 AND lower(email)=lower($2)`, gymID, t.email).Scan(&id)
		if err != nil {
			id = newID()
			if _, err := pool.Exec(ctx,
				`INSERT INTO users(id,gym_id,email,password_hash,name) VALUES($1,$2,$3,$4,$5)`,
				id, gymID, t.email, hash, t.name,
			); err != nil {
				return err
			}
			if _, err := pool.Exec(ctx,
				`INSERT INTO user_staff_roles(user_id,role) VALUES($1,'trainer') ON CONFLICT DO NOTHING`,
				id,
			); err != nil {
				return err
			}
		}
		trainerIDs = append(trainerIDs, id)
	}

	for i, mid := range members {
		tid := trainerIDs[i%len(trainerIDs)]
		if _, err := pool.Exec(ctx,
			`INSERT INTO trainer_assignments(id,gym_id,trainer_user_id,member_id,assigned_by)
			 VALUES($1,$2,$3,$4,$5)
			 ON CONFLICT (trainer_user_id, member_id) DO NOTHING`,
			newID(), gymID, tid, mid, actor,
		); err != nil {
			return err
		}
	}
	for _, tid := range trainerIDs {
		var n int
		_ = pool.QueryRow(ctx, `SELECT count(*) FROM trainer_availability WHERE trainer_user_id=$1`, tid).Scan(&n)
		if n > 0 {
			continue
		}
		start := time.Now().UTC().Truncate(time.Hour).Add(24 * time.Hour)
		for i := 0; i < 5; i++ {
			st := start.Add(time.Duration(i*24) * time.Hour)
			en := st.Add(2 * time.Hour)
			if _, err := pool.Exec(ctx,
				`INSERT INTO trainer_availability(id,gym_id,trainer_user_id,branch_id,starts_at,ends_at)
				 VALUES($1,$2,$3,$4,$5,$6)`,
				newID(), gymID, tid, branchID, st, en,
			); err != nil {
				return err
			}
		}
	}
	return nil
}

func seedWorkouts(ctx context.Context, pool *pgxpool.Pool, gymID uuid.UUID, members []uuid.UUID, author uuid.UUID) error {
	var n int
	if err := pool.QueryRow(ctx, `SELECT count(*) FROM workout_logs WHERE gym_id=$1`, gymID).Scan(&n); err != nil {
		return err
	}
	if n > 0 {
		return nil
	}
	titles := []string{"Upper body power", "Core strength", "HIIT burner", "Mobility reset"}
	for i, mid := range members {
		title := titles[i%len(titles)]
		if _, err := pool.Exec(ctx,
			`INSERT INTO workout_logs(id,gym_id,member_id,author_user_id,performed_at,title,notes,metrics)
			 VALUES($1,$2,$3,$4,now()-($5::int * interval '1 day'),$6,'Seeded demo workout',$7::jsonb)`,
			newID(), gymID, mid, author, i+1, title, `{"kcal":220,"minutes":35}`,
		); err != nil {
			return err
		}
		if _, err := pool.Exec(ctx,
			`INSERT INTO progress_measurements(id,gym_id,member_id,measured_at,kind,value,unit)
			 VALUES($1,$2,$3,now()-($4::int * interval '1 day'),'weight',$5,'kg')`,
			newID(), gymID, mid, i, 70+i,
		); err != nil {
			return err
		}
	}
	return nil
}
