# GymPulse demo users

Local development accounts created by `make seed` (`gympulse seed`).

**Password for all accounts:** `GymPulse1!`

| Type | Email | App | Notes |
|---|---|---|---|
| Owner | `owner@gympulse.local` | **Admin** | Full gym control |
| Manager | `manager@gympulse.local` | **Admin** | Day-to-day ops |
| Receptionist | `receptionist@gympulse.local` | **Admin** | Front desk — QR check-in + payment screenshot review |
| Trainer | `trainer@gympulse.local` | **App (PWA)** | Primary trainer |
| Member | `member@gympulse.local` | **App (PWA)** | Check-in QR + screenshot pay |

Extra seeded members (same password): `alex|sam|jordan|chris|morgan|riley|casey|taylor.member@gympulse.local`  
Extra trainers: `alex|sam|jordan.trainer@gympulse.local`

Seed also creates plans, classes, bookings, check-ins, invoices, **pending Telebirr/CBE screenshot payments**, workouts, and hours so admin + PWA are populated.

## Seed / re-seed

```bash
make db-create
make migrate-up
make seed
```

Idempotent: re-running resets passwords and fills missing demo content.

## Admin login

Use **owner**, **manager**, or **receptionist** (`cd admin && pnpm run dev`).

## PWA login

Use `member@gympulse.local` or `trainer@gympulse.local` (`cd app && pnpm run dev`). Email/password only (no Google/Apple).
