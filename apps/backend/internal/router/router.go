// Package router registers ALL routes for the unified GymPulse backend.
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  Route groups                                                   │
// ├─────────────────────────────────────────────────────────────────┤
// │  GET  /health                        — liveness probe           │
// │  /auth/*                             — mobile user auth         │
// │  /profile/*                          — mobile user profile      │
// │  /content/*                          — public content reads     │
// │  /workouts/*                         — public workout reads     │
// │  /programs/*                         — public program reads     │
// │  /shop/*                             — public + order placement │
// │  /admin/auth/*                       — admin auth (all roles)   │
// │  /admin/users/*        user_admin+   — app-user management      │
// │  /admin/admins/*       super_admin   — admin account mgmt       │
// │  /admin/shop/*         shop_admin+   — e-commerce               │
// │  /admin/content/*      sport_admin+  — sport content            │
// │  /admin/system/*       super_admin   — platform config          │
// └─────────────────────────────────────────────────────────────────┘
package router

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	chimw "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"

	"gympulse/backend/internal/config"
	adminAuthH  "gympulse/backend/internal/handlers/admin/auth"
	adminsH     "gympulse/backend/internal/handlers/admin/admins"
	analyticsH  "gympulse/backend/internal/handlers/admin/analytics"
	bookingsH   "gympulse/backend/internal/handlers/admin/bookings"
	classesH    "gympulse/backend/internal/handlers/admin/classes"
	contentH    "gympulse/backend/internal/handlers/admin/content"
	exercisesH  "gympulse/backend/internal/handlers/admin/exercises"
	shopH       "gympulse/backend/internal/handlers/admin/shop"
	systemH     "gympulse/backend/internal/handlers/admin/system"
	trainersH   "gympulse/backend/internal/handlers/admin/trainers"
	usersH      "gympulse/backend/internal/handlers/admin/users"
	authH       "gympulse/backend/internal/handlers/auth"
	mobileContentH "gympulse/backend/internal/handlers/mobile/content"
	mobileShopH    "gympulse/backend/internal/handlers/mobile/shop"
	profileH    "gympulse/backend/internal/handlers/profile"
	"gympulse/shared/middleware"
)

// New builds and returns the fully configured application router.
func New(cfg *config.Config) http.Handler {
	// ── Instantiate handlers ───────────────────────────────────────────────
	auth        := authH.New(cfg)
	profile     := profileH.New(cfg)
	mobContent  := mobileContentH.New(cfg)
	mobShop     := mobileShopH.New(cfg)

	aAuth    := adminAuthH.New(cfg)
	aUsers   := usersH.New(cfg)
	aAdmins  := adminsH.New(cfg)
	aShop    := shopH.New(cfg)
	aContent := contentH.New(cfg)
	aExercises := exercisesH.New(cfg)
	aSystem  := systemH.New(cfg)
	aClasses  := classesH.New(cfg)
	aBookings := bookingsH.New(cfg)
	aTrainers := trainersH.New(cfg)
	aAnalytics := analyticsH.New(cfg)

	r := chi.NewRouter()

	// ── Global middleware ──────────────────────────────────────────────────
	r.Use(chimw.RequestID)
	r.Use(chimw.RealIP)
	r.Use(chimw.Logger)
	r.Use(chimw.Recoverer)
	r.Use(chimw.CleanPath)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Accept", "Authorization", "Content-Type", "X-Request-ID"},
		MaxAge:         300,
	}))

	// ── Health ────────────────────────────────────────────────────────────
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"status":"ok","service":"gympulse-backend"}`))
	})

	// ═══════════════════════════════════════════════════════════════════════
	// MOBILE / PUBLIC ROUTES
	// ═══════════════════════════════════════════════════════════════════════

	// ── User auth ─────────────────────────────────────────────────────────
	r.Route("/auth", func(r chi.Router) {
		// Public
		r.Post("/signup",         auth.SignUp)
		r.Post("/signin",         auth.SignIn)
		r.Get("/google",          auth.SignInWithGoogle)
		r.Post("/refresh",        auth.RefreshToken)
		r.Post("/reset-password", auth.ResetPassword)
		// Protected
		r.Group(func(r chi.Router) {
			r.Use(middleware.Authenticate(cfg.JWTSecret))
			r.Post("/signout",        auth.SignOut)
			r.Put("/update-password", auth.UpdatePassword)
			r.Get("/me",              auth.Me)
		})
	})

	// ── User profile (authenticated) ──────────────────────────────────────
	r.Route("/profile", func(r chi.Router) {
		r.Use(middleware.Authenticate(cfg.JWTSecret))
		r.Get("/",           profile.GetProfile)
		r.Patch("/",         profile.UpdateProfile)
		r.Post("/avatar",    profile.UploadAvatar)
	})

	// ── Public announcements ─────────────────────────────────────────────
	r.Get("/announcements", mobContent.ListAnnouncements)

	// ── Public content reads ──────────────────────────────────────────────
	r.Route("/content", func(r chi.Router) {
		r.Get("/",             mobContent.ListContent)
		r.Get("/categories",   mobContent.ListCategories)
		r.Get("/{id}",         mobContent.GetContent)
	})

	// ── Public workout reads ──────────────────────────────────────────────
	r.Route("/workouts", func(r chi.Router) {
		r.Get("/",             mobContent.ListWorkouts)
		r.Get("/categories",   mobContent.ListWorkoutCategories)
		r.Get("/{id}",         mobContent.GetWorkout)
	})

	// ── Public program reads ──────────────────────────────────────────────
	r.Route("/programs", func(r chi.Router) {
		r.Get("/",     mobContent.ListPrograms)
		r.Get("/{id}", mobContent.GetProgram)
	})

	// ── Shop — public browse + authenticated orders ───────────────────────
	r.Route("/shop", func(r chi.Router) {
		// Public
		r.Get("/products",       mobShop.ListProducts)
		r.Get("/products/{id}",  mobShop.GetProduct)
		r.Get("/categories",     mobShop.ListCategories)

		// Authenticated user orders
		r.Group(func(r chi.Router) {
			r.Use(middleware.Authenticate(cfg.JWTSecret))
			r.Get("/orders",           mobShop.ListMyOrders)
			r.Get("/orders/{id}",      mobShop.GetMyOrder)
			r.Post("/orders",          mobShop.PlaceOrder)
			r.Post("/orders/{id}/cancel", mobShop.CancelOrder)
		})
	})

	// ═══════════════════════════════════════════════════════════════════════
	// ADMIN ROUTES
	// ═══════════════════════════════════════════════════════════════════════
	r.Route("/admin", func(r chi.Router) {

		// ── Admin auth (mostly public) ────────────────────────────────────
		r.Route("/auth", func(r chi.Router) {
			r.Post("/signin",         aAuth.SignIn)
			r.Post("/refresh",        aAuth.RefreshToken)
			r.Post("/reset-password", aAuth.ResetPassword)
			r.Group(func(r chi.Router) {
				r.Use(middleware.Authenticate(cfg.JWTSecret))
				r.Post("/signout",        aAuth.SignOut)
				r.Put("/update-password", aAuth.UpdatePassword)
				r.Get("/me",              aAuth.Me)
			})
		})

		// All admin routes below require a valid JWT.
		r.Group(func(r chi.Router) {
			r.Use(middleware.Authenticate(cfg.JWTSecret))

			// ── User management — user_admin, super_admin ─────────────────
			r.Route("/users", func(r chi.Router) {
				r.Use(middleware.RequireAdminRole(middleware.RoleUserAdmin, middleware.RoleSuperAdmin))
				r.Get("/",            aUsers.ListUsers)
				r.Get("/{id}",        aUsers.GetUser)
				r.Patch("/{id}",      aUsers.UpdateUser)
				r.Post("/{id}/ban",   aUsers.BanUser)
				r.Post("/{id}/unban", aUsers.UnbanUser)
				r.Delete("/{id}",     superOnly(cfg, aUsers.DeleteUser))
			})

			// ── Admin management — super_admin only ───────────────────────
			r.Route("/admins", func(r chi.Router) {
				r.Use(middleware.RequireAdminRole(middleware.RoleSuperAdmin))
				r.Get("/",        aAdmins.ListAdmins)
				r.Post("/",       aAdmins.CreateAdmin)
				r.Get("/{id}",    aAdmins.GetAdmin)
				r.Patch("/{id}",  aAdmins.UpdateAdmin)
				r.Delete("/{id}", aAdmins.DeleteAdmin)
			})

			// ── Shop — shop_admin, super_admin ────────────────────────────
			r.Route("/shop", func(r chi.Router) {
				r.Use(middleware.RequireAdminRole(middleware.RoleShopAdmin, middleware.RoleSuperAdmin))

				// Products
				r.Get("/products",                    aShop.ListProducts)
				r.Post("/products",                   aShop.CreateProduct)
				r.Get("/products/{id}",               aShop.GetProduct)
				r.Patch("/products/{id}",             aShop.UpdateProduct)
				r.Delete("/products/{id}",            aShop.DeleteProduct)
				r.Post("/products/{id}/images",       aShop.UploadProductImages)
				r.Delete("/products/{id}/images",     aShop.DeleteProductImage)

				// Categories (create/delete = super_admin only)
				r.Get("/categories",                  aShop.ListCategories)
				r.Post("/categories",                 superOnly(cfg, aShop.CreateCategory))

				// Orders
				r.Get("/orders",                      aShop.ListOrders)
				r.Get("/orders/{id}",                 aShop.GetOrder)
				r.Patch("/orders/{id}/status",        aShop.UpdateOrderStatus)

				// Suppliers
				r.Get("/suppliers",                   aShop.ListSuppliers)
				r.Post("/suppliers",                  aShop.CreateSupplier)
				r.Get("/suppliers/{id}",              aShop.GetSupplier)
				r.Patch("/suppliers/{id}",            aShop.UpdateSupplier)
				r.Delete("/suppliers/{id}",           superOnly(cfg, aShop.DeleteSupplier))

				// Coupons
				r.Get("/coupons",                     aShop.ListCoupons)
				r.Post("/coupons",                    aShop.CreateCoupon)
				r.Get("/coupons/{id}",                aShop.GetCoupon)
				r.Patch("/coupons/{id}",              aShop.UpdateCoupon)
				r.Delete("/coupons/{id}",             superOnly(cfg, aShop.DeleteCoupon))

				// Returns
				r.Get("/returns",                     aShop.ListReturns)
				r.Get("/returns/{id}",                aShop.GetReturn)
				r.Patch("/returns/{id}/status",       aShop.UpdateReturnStatus)

				// Reviews
				r.Get("/reviews",                     aShop.ListReviews)
				r.Delete("/reviews/{id}",             aShop.DeleteReview)
				r.Patch("/reviews/{id}/flag",         aShop.FlagReview)

				// Shipments
				r.Get("/shipments",                   aShop.ListShipments)
				r.Get("/shipments/{id}",              aShop.GetShipment)
				r.Patch("/shipments/{id}",            aShop.UpdateShipment)
			})

			// ── Content & sport — sport_admin, super_admin ────────────────
			r.Route("/content", func(r chi.Router) {
				r.Use(middleware.RequireAdminRole(middleware.RoleSportAdmin, middleware.RoleSuperAdmin))

				// General content posts
				r.Get("/",                  aContent.ListContent)
				r.Post("/",                 aContent.CreateContent)
				r.Get("/{id}",              aContent.GetContent)
				r.Patch("/{id}",            aContent.UpdateContent)
				r.Delete("/{id}",           aContent.DeleteContent)
				r.Post("/{id}/publish",     aContent.PublishContent)
				r.Post("/{id}/unpublish",   aContent.UnpublishContent)

				// Media blocks on a post
				r.Post("/{id}/media",              aContent.UploadMedia)
				r.Post("/{id}/text-block",         aContent.AddTextBlock)
				r.Delete("/{id}/media/{mediaId}",  aContent.DeleteMedia)
				r.Patch("/{id}/media/reorder",     aContent.ReorderMedia)

				// Content categories
				r.Get("/categories",               aContent.ListContentCategories)
				r.Post("/categories",              superOnly(cfg, aContent.CreateContentCategory))

				// Standalone file upload (thumbnails, covers)
				r.Post("/media/upload/{type}",     aContent.UploadFile)

				// Workouts
				r.Get("/workouts",                 aContent.ListWorkouts)
				r.Post("/workouts",                aContent.CreateWorkout)
				r.Get("/workouts/{id}",            aContent.GetWorkout)
				r.Patch("/workouts/{id}",          aContent.UpdateWorkout)
				r.Delete("/workouts/{id}",         aContent.DeleteWorkout)
				r.Post("/workouts/{id}/publish",   aContent.PublishWorkout)
				r.Post("/workouts/{id}/unpublish", aContent.UnpublishWorkout)

				// Workout exercises
				r.Get("/workouts/{workoutId}/exercises",          aExercises.ListExercises)
				r.Post("/workouts/{workoutId}/exercises",         aExercises.CreateExercise)
				r.Get("/workouts/{workoutId}/exercises/{id}",     aExercises.GetExercise)
				r.Patch("/workouts/{workoutId}/exercises/{id}",   aExercises.UpdateExercise)
				r.Delete("/workouts/{workoutId}/exercises/{id}",  aExercises.DeleteExercise)
				r.Patch("/workouts/{workoutId}/exercises/reorder", aExercises.ReorderExercises)

				// Workout categories
				r.Get("/workout-categories",       aContent.ListWorkoutCategories)
				r.Post("/workout-categories",      superOnly(cfg, aContent.CreateWorkoutCategory))

				// Programs
				r.Get("/programs",                 aContent.ListPrograms)
				r.Post("/programs",                aContent.CreateProgram)
				r.Get("/programs/{id}",            aContent.GetProgram)
				r.Patch("/programs/{id}",          aContent.UpdateProgram)
				r.Delete("/programs/{id}",         aContent.DeleteProgram)
				r.Post("/programs/{id}/publish",   aContent.PublishProgram)
				r.Post("/programs/{id}/unpublish", aContent.UnpublishProgram)
				r.Post("/programs/{id}/workouts",                 aContent.AddWorkoutToProgram)
				r.Delete("/programs/{id}/workouts/{workoutId}",   aContent.RemoveWorkoutFromProgram)
			})

			// ── System — super_admin only ─────────────────────────────────
			r.Route("/system", func(r chi.Router) {
				r.Use(middleware.RequireAdminRole(middleware.RoleSuperAdmin))
				r.Get("/dashboard",              aSystem.GetDashboardStats)
				r.Get("/admins/overview",        aSystem.AdminsOverview)
				r.Get("/announcements",          aSystem.ListAnnouncements)
				r.Post("/announcements",         aSystem.CreateAnnouncement)
				r.Delete("/announcements/{id}",  aSystem.DeleteAnnouncement)
				r.Get("/audit-logs",             aSystem.ListAuditLogs)
				r.Get("/settings",               aSystem.GetSettings)
				r.Patch("/settings/{key}",       aSystem.UpdateSettings)
				r.Get("/storage/buckets",        aSystem.ListStorageBuckets)

				// Locations
				r.Get("/locations",              aSystem.ListLocations)
				r.Post("/locations",             aSystem.CreateLocation)
				r.Patch("/locations/{id}",       aSystem.UpdateLocation)
				r.Delete("/locations/{id}",      aSystem.DeleteLocation)

				// Disciplines
				r.Get("/disciplines",            aSystem.ListDisciplines)
				r.Post("/disciplines",           aSystem.CreateDiscipline)
				r.Patch("/disciplines/{id}",     aSystem.UpdateDiscipline)
				r.Delete("/disciplines/{id}",    aSystem.DeleteDiscipline)
			})

			// ── Classes — user_admin, super_admin ─────────────────────────
			r.Route("/classes", func(r chi.Router) {
				r.Use(middleware.RequireAdminRole(middleware.RoleUserAdmin, middleware.RoleSuperAdmin))
				r.Get("/",                  aClasses.ListClasses)
				r.Post("/",                 aClasses.CreateClass)
				r.Get("/disciplines",       aClasses.ListDisciplines)
				r.Get("/schedule",          aClasses.GetSchedule)
				r.Get("/{id}",              aClasses.GetClass)
				r.Patch("/{id}",            aClasses.UpdateClass)
				r.Delete("/{id}",           aClasses.DeleteClass)
				r.Post("/{id}/cancel",      aClasses.CancelClass)
			})

			// ── Bookings — user_admin, super_admin ────────────────────────
			r.Route("/bookings", func(r chi.Router) {
				r.Use(middleware.RequireAdminRole(middleware.RoleUserAdmin, middleware.RoleSuperAdmin))
				r.Get("/",              aBookings.ListBookings)
				r.Get("/stats",         aBookings.GetBookingStats)
				r.Get("/{id}",          aBookings.GetBooking)
				r.Patch("/{id}/status", aBookings.UpdateBookingStatus)
			})

			// ── Trainers — user_admin, super_admin ────────────────────────
			r.Route("/trainers", func(r chi.Router) {
				r.Use(middleware.RequireAdminRole(middleware.RoleUserAdmin, middleware.RoleSuperAdmin))
				r.Get("/",               aTrainers.ListTrainers)
				r.Post("/",              aTrainers.CreateTrainer)
				r.Get("/{id}",           aTrainers.GetTrainer)
				r.Patch("/{id}",         aTrainers.UpdateTrainer)
				r.Delete("/{id}",        aTrainers.DeleteTrainer)
				r.Post("/{id}/verify",   aTrainers.VerifyTrainer)
				r.Post("/{id}/unverify", aTrainers.UnverifyTrainer)
			})

			// ── Analytics — user_admin, super_admin ───────────────────────
			r.Route("/analytics", func(r chi.Router) {
				r.Use(middleware.RequireAdminRole(middleware.RoleUserAdmin, middleware.RoleSuperAdmin))
				r.Get("/overview",       aAnalytics.Overview)
				r.Get("/member-growth",  aAnalytics.MemberGrowth)
				r.Get("/class-activity", aAnalytics.ClassActivity)
				r.Get("/revenue",        aAnalytics.Revenue)
			})
		})
	})

	return r
}

// superOnly wraps a handler to enforce super_admin within a broader role group.
func superOnly(cfg *config.Config, h http.HandlerFunc) http.HandlerFunc {
	mw := middleware.RequireAdminRole(middleware.RoleSuperAdmin)
	return func(w http.ResponseWriter, r *http.Request) {
		mw(h).ServeHTTP(w, r)
	}
}
