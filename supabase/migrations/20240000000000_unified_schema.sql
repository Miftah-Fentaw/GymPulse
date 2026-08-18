-- =============================================================================
-- GymPulse Unified Database Schema
-- Combines initial schema, sport/discipline isolation, RLS, and storage
-- =============================================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- =============================================================================
-- PROFILES (mirrors auth.users for app-level data)
-- =============================================================================
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text,
  avatar_url    text,
  phone         text,
  date_of_birth date,
  gender        text check (gender in ('male', 'female', 'other', 'prefer_not_to_say')),
  bio           text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================================================
-- DISCIPLINES / SPORTS DOMAIN
-- =============================================================================

-- DISCIPLINES (Sports like Boxing, Aerobics, Gym, MMA, Muay Thai, Yoga, CrossFit)
create table if not exists public.disciplines (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  description text,
  color       text,
  icon_url    text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ADMIN DISCIPLINE MAPPING (Links sport_admin / user_admin to specific sports)
create table if not exists public.admin_disciplines (
  id            uuid primary key default uuid_generate_v4(),
  admin_id      uuid not null references auth.users(id) on delete cascade,
  discipline_id uuid not null references public.disciplines(id) on delete cascade,
  assigned_at   timestamptz not null default now(),
  unique (admin_id, discipline_id)
);

create index if not exists idx_admin_disciplines_admin on public.admin_disciplines(admin_id);
create index if not exists idx_admin_disciplines_discipline on public.admin_disciplines(discipline_id);

-- USER DISCIPLINE MAPPING (Links users to enrolled / followed sports)
create table if not exists public.user_disciplines (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  discipline_id uuid not null references public.disciplines(id) on delete cascade,
  enrolled_at   timestamptz not null default now(),
  unique (user_id, discipline_id)
);

create index if not exists idx_user_disciplines_user on public.user_disciplines(user_id);
create index if not exists idx_user_disciplines_discipline on public.user_disciplines(discipline_id);

-- =============================================================================
-- ADMIN USERS (view over auth.users filtered by app_metadata)
-- =============================================================================
-- Admin roles stored in auth.users app_metadata.admin_role:
--   super_admin  - full platform access across all sports & shop
--   user_admin   - manage app users & content in their assigned sport(s) (sport_admin)
--   shop_admin   - manage products, orders, & shop logistics (web-shop)

create or replace view public.admin_users as
select
  u.id,
  u.email,
  u.created_at,
  u.last_sign_in_at,
  u.banned_until,
  u.raw_user_meta_data->>'full_name' as full_name,
  u.raw_app_meta_data->>'admin_role' as admin_role,
  (u.raw_app_meta_data->>'is_admin')::boolean as is_admin
from auth.users u
where u.raw_app_meta_data->>'admin_role' is not null;

-- =============================================================================
-- AUDIT LOGS & PLATFORM SETTINGS
-- =============================================================================
create table if not exists public.audit_logs (
  id          uuid primary key default uuid_generate_v4(),
  admin_id    uuid references auth.users(id) on delete set null,
  action      text not null,
  resource    text,
  resource_id text,
  metadata    jsonb,
  ip_address  inet,
  created_at  timestamptz not null default now()
);

create index if not exists idx_audit_logs_admin_id on public.audit_logs(admin_id);
create index if not exists idx_audit_logs_created_at on public.audit_logs(created_at desc);

create table if not exists public.platform_settings (
  key         text primary key,
  value       jsonb not null,
  description text,
  updated_by  uuid references auth.users(id) on delete set null,
  updated_at  timestamptz not null default now()
);

insert into public.platform_settings (key, value, description) values
  ('app_name',           '"GymPulse"',           'Application name'),
  ('maintenance_mode',   'false',                 'Put the platform in maintenance mode'),
  ('signup_enabled',     'true',                  'Allow new user registrations'),
  ('max_upload_mb',      '200',                   'Maximum file upload size in MB'),
  ('allow_guest_orders',  'false',                 'Allow unauthenticated users to place orders'),
  ('featured_programs',   '[]',                    'Array of program IDs to feature on home screen'),
  ('featured_workouts',   '[]',                    'Array of workout IDs to feature on home screen')
on conflict (key) do nothing;

-- ANNOUNCEMENTS (Can be global or sport-specific)
create table if not exists public.announcements (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  message       text not null,
  discipline_id uuid references public.disciplines(id) on delete cascade,
  audience      text not null default 'all'
                  check (audience in ('all', 'users', 'admins', 'shop_admins', 'sport_admins')),
  tags          text[] default '{}',
  expires_at    timestamptz,
  created_by    uuid references auth.users(id) on delete set null,
  created_at    timestamptz not null default now()
);

create index if not exists idx_announcements_discipline on public.announcements(discipline_id);

-- =============================================================================
-- SPORT CONTENT DOMAIN (Isolated by Discipline)
-- =============================================================================

-- CONTENT CATEGORIES (Per discipline)
create table if not exists public.content_categories (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  description   text,
  slug          text not null unique,
  discipline_id uuid references public.disciplines(id) on delete cascade,
  created_at    timestamptz not null default now()
);

create index if not exists idx_content_categories_discipline on public.content_categories(discipline_id);

-- CONTENT POSTS (Articles, tips, etc., specific to a sport)
create table if not exists public.content_posts (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  description   text,
  content_type  text not null check (content_type in ('article', 'workout', 'program', 'tip', 'announcement')),
  discipline_id uuid references public.disciplines(id) on delete cascade,
  tags          text[] default '{}',
  category_id   uuid references public.content_categories(id) on delete set null,
  is_published  boolean not null default false,
  created_by    uuid references auth.users(id) on delete set null,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_content_posts_discipline on public.content_posts(discipline_id);
create index if not exists idx_content_posts_type on public.content_posts(content_type);
create index if not exists idx_content_posts_published on public.content_posts(is_published);
create index if not exists idx_content_posts_created_by on public.content_posts(created_by);

-- Auto-set published_at when is_published flips to true
create or replace function public.handle_content_publish()
returns trigger language plpgsql as $$
begin
  if new.is_published = true and (old.is_published = false or old.is_published is null) then
    new.published_at := now();
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create or replace trigger on_content_publish
  before update on public.content_posts
  for each row execute procedure public.handle_content_publish();

-- CONTENT MEDIA BLOCKS
create table if not exists public.content_media (
  id              uuid primary key default uuid_generate_v4(),
  content_post_id uuid not null references public.content_posts(id) on delete cascade,
  type            text not null check (type in ('image', 'video', 'text', 'file')),
  url             text,
  text            text,
  caption         text,
  mime_type       text,
  "order"         int not null default 0,
  created_at      timestamptz not null default now()
);

create index if not exists idx_content_media_post_id on public.content_media(content_post_id);

-- WORKOUT CATEGORIES
create table if not exists public.workout_categories (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  description   text,
  slug          text not null unique,
  icon_url      text,
  discipline_id uuid references public.disciplines(id) on delete cascade,
  created_by    uuid references auth.users(id) on delete set null,
  created_at    timestamptz not null default now()
);

create index if not exists idx_workout_categories_discipline on public.workout_categories(discipline_id);

-- WORKOUTS
create table if not exists public.workouts (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  description   text,
  duration_mins int,
  difficulty    text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  discipline_id uuid references public.disciplines(id) on delete cascade,
  category_id   uuid references public.workout_categories(id) on delete set null,
  tags          text[] default '{}',
  thumbnail_url text,
  video_url     text,
  is_published  boolean not null default false,
  created_by    uuid references auth.users(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_workouts_discipline on public.workouts(discipline_id);
create index if not exists idx_workouts_category on public.workouts(category_id);
create index if not exists idx_workouts_published on public.workouts(is_published);
create index if not exists idx_workouts_created_by on public.workouts(created_by);

-- WORKOUT EXERCISES
create table if not exists public.workout_exercises (
  id           uuid primary key default uuid_generate_v4(),
  workout_id   uuid not null references public.workouts(id) on delete cascade,
  name         text not null,
  description  text,
  sets         int,
  reps         int,
  duration_sec int,
  rest_sec     int,
  "order"      int not null default 0,
  video_url    text,
  image_url    text,
  created_at   timestamptz not null default now()
);

create index if not exists idx_workout_exercises_workout on public.workout_exercises(workout_id);

-- FITNESS PROGRAMS
create table if not exists public.programs (
  id             uuid primary key default uuid_generate_v4(),
  title          text not null,
  description    text,
  duration_weeks int,
  difficulty     text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  discipline_id  uuid references public.disciplines(id) on delete cascade,
  category_id    uuid references public.workout_categories(id) on delete set null,
  tags           text[] default '{}',
  thumbnail_url  text,
  is_published   boolean not null default false,
  created_by     uuid references auth.users(id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists idx_programs_discipline on public.programs(discipline_id);

-- PROGRAM WORKOUTS
create table if not exists public.program_workouts (
  id         uuid primary key default uuid_generate_v4(),
  program_id uuid not null references public.programs(id) on delete cascade,
  workout_id uuid not null references public.workouts(id) on delete cascade,
  week_num   int not null,
  day_num    int not null,
  "order"    int not null default 0,
  unique (program_id, week_num, day_num, "order")
);

-- =============================================================================
-- GYM FACILITIES & CLASSES DOMAIN
-- =============================================================================

-- GYM LOCATIONS
create table if not exists public.gym_locations (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  city        text,
  country     text,
  address     text,
  capacity    int,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- TRAINERS
create table if not exists public.trainers (
  id               uuid primary key default uuid_generate_v4(),
  profile_id       uuid not null references public.profiles(id) on delete cascade,
  bio              text,
  specialties      text[] default '{}',
  certifications   text[] default '{}',
  years_experience int,
  hourly_rate      numeric(10,2),
  is_verified      boolean not null default false,
  rating           numeric(3,2) default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- CLASSES
create table if not exists public.classes (
  id               uuid primary key default uuid_generate_v4(),
  title            text not null,
  description      text,
  discipline_id    uuid references public.disciplines(id) on delete set null,
  trainer_id       uuid references public.trainers(id) on delete set null,
  location_id      uuid references public.gym_locations(id) on delete set null,
  difficulty_level text check (difficulty_level in ('beginner', 'intermediate', 'advanced')),
  duration_minutes int,
  max_participants int,
  price            numeric(10,2),
  start_time       timestamptz not null,
  end_time         timestamptz not null,
  status           text not null default 'active' check (status in ('active', 'cancelled', 'completed')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists idx_classes_discipline on public.classes(discipline_id);
create index if not exists idx_classes_trainer on public.classes(trainer_id);

-- BOOKINGS
create table if not exists public.bookings (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  class_id      uuid not null references public.classes(id) on delete cascade,
  status        text not null default 'pending' check (status in ('pending', 'confirmed', 'checked_in', 'no_show', 'cancelled', 'refunded')),
  checked_in_at timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique(user_id, class_id)
);

create index if not exists idx_bookings_user on public.bookings(user_id);
create index if not exists idx_bookings_class on public.bookings(class_id);

-- =============================================================================
-- UNIFIED E-COMMERCE DOMAIN
-- =============================================================================

-- PRODUCT CATEGORIES
create table if not exists public.product_categories (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  description text,
  slug        text not null unique,
  created_at  timestamptz not null default now()
);

-- SUPPLIERS
create table if not exists public.suppliers (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  contact_name text,
  email        text,
  phone        text,
  category     text,
  address      text,
  status       text not null default 'active' check (status in ('active', 'inactive')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- PRODUCTS
create table if not exists public.products (
  id             uuid primary key default uuid_generate_v4(),
  name           text not null,
  description    text,
  price          numeric(10,2) not null check (price >= 0),
  stock          int not null default 0 check (stock >= 0),
  category_id    uuid references public.product_categories(id) on delete set null,
  supplier_id    uuid references public.suppliers(id) on delete set null,
  images         text[] default '{}',
  is_active      boolean not null default true,
  shop_admin_id  uuid references auth.users(id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_shop_admin on public.products(shop_admin_id);
create index if not exists idx_products_active on public.products(is_active);

-- PRODUCT REVIEWS
create table if not exists public.product_reviews (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid not null references public.products(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  rating      int not null check (rating >= 1 and rating <= 5),
  review_text text,
  is_flagged  boolean not null default false,
  flag_reason text,
  created_at  timestamptz not null default now()
);

-- COUPONS
create table if not exists public.coupons (
  id               uuid primary key default uuid_generate_v4(),
  code             text not null unique,
  discount_type    text not null check (discount_type in ('percentage', 'fixed')),
  discount_value   numeric(10,2) not null,
  min_order_amount numeric(10,2) default 0,
  max_uses         int,
  times_used       int not null default 0,
  expires_at       timestamptz,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ORDERS
create table if not exists public.orders (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references auth.users(id) on delete set null,
  shop_admin_id uuid references auth.users(id) on delete set null,
  coupon_id     uuid references public.coupons(id) on delete set null,
  status        text not null default 'pending'
                  check (status in ('pending','processing','shipped','delivered','cancelled','refunded')),
  total_amount  numeric(10,2) not null check (total_amount >= 0),
  currency      text not null default 'USD',
  shipping_addr jsonb,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_shop_admin on public.orders(shop_admin_id);
create index if not exists idx_orders_status on public.orders(status);

-- ORDER ITEMS
create table if not exists public.order_items (
  id          uuid primary key default uuid_generate_v4(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  product_id  uuid references public.products(id) on delete set null,
  quantity    int not null check (quantity > 0),
  unit_price  numeric(10,2) not null,
  created_at  timestamptz not null default now()
);

create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_order_items_product on public.order_items(product_id);

-- SHIPMENTS
create table if not exists public.shipments (
  id                    uuid primary key default uuid_generate_v4(),
  order_id              uuid not null references public.orders(id) on delete cascade,
  tracking_number       text,
  carrier               text,
  status                text not null default 'pending' check (status in ('pending', 'in_transit', 'delivered', 'failed')),
  estimated_delivery_at timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- ORDER RETURNS
create table if not exists public.order_returns (
  id          uuid primary key default uuid_generate_v4(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  reason      text not null,
  status      text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'refunded')),
  admin_notes text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- =============================================================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================================================

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create or replace trigger set_updated_at_disciplines before update on public.disciplines for each row execute procedure public.set_updated_at();
create or replace trigger set_updated_at_gym_locations before update on public.gym_locations for each row execute procedure public.set_updated_at();
create or replace trigger set_updated_at_trainers before update on public.trainers for each row execute procedure public.set_updated_at();
create or replace trigger set_updated_at_classes before update on public.classes for each row execute procedure public.set_updated_at();
create or replace trigger set_updated_at_bookings before update on public.bookings for each row execute procedure public.set_updated_at();
create or replace trigger set_updated_at_suppliers before update on public.suppliers for each row execute procedure public.set_updated_at();
create or replace trigger set_updated_at_coupons before update on public.coupons for each row execute procedure public.set_updated_at();
create or replace trigger set_updated_at_shipments before update on public.shipments for each row execute procedure public.set_updated_at();
create or replace trigger set_updated_at_order_returns before update on public.order_returns for each row execute procedure public.set_updated_at();
create or replace trigger set_updated_at_workouts before update on public.workouts for each row execute procedure public.set_updated_at();
create or replace trigger set_updated_at_programs before update on public.programs for each row execute procedure public.set_updated_at();
create or replace trigger set_updated_at_products before update on public.products for each row execute procedure public.set_updated_at();
create or replace trigger set_updated_at_orders before update on public.orders for each row execute procedure public.set_updated_at();

-- =============================================================================
-- HELPER FUNCTIONS FOR RLS POLICIES
-- =============================================================================

-- Check if current user is a Super Admin
create or replace function public.is_super_admin()
returns boolean language sql security definer as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'admin_role') = 'super_admin',
    false
  );
$$;

-- Check if current user is an admin of a specific discipline
create or replace function public.is_discipline_admin(d_id uuid)
returns boolean language sql security definer as $$
  select exists (
    select 1 from public.admin_disciplines
    where admin_id = auth.uid() and discipline_id = d_id
  ) or public.is_super_admin();
$$;

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

alter table public.profiles enable row level security;
alter table public.disciplines enable row level security;
alter table public.admin_disciplines enable row level security;
alter table public.user_disciplines enable row level security;
alter table public.content_posts enable row level security;
alter table public.content_media enable row level security;
alter table public.workouts enable row level security;
alter table public.workout_categories enable row level security;
alter table public.workout_exercises enable row level security;
alter table public.programs enable row level security;
alter table public.program_workouts enable row level security;
alter table public.product_categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.audit_logs enable row level security;
alter table public.announcements enable row level security;
alter table public.platform_settings enable row level security;
alter table public.content_categories enable row level security;
alter table public.gym_locations enable row level security;
alter table public.trainers enable row level security;
alter table public.classes enable row level security;
alter table public.bookings enable row level security;

-- PROFILES
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Service role full access on profiles"
  on public.profiles for all using (auth.role() = 'service_role');

create policy "Service role can insert profiles"
  on public.profiles for insert
  with check (auth.role() = 'service_role');

-- DISCIPLINE MAPPINGS
create policy "Anyone can view disciplines"
  on public.disciplines for select using (true);

create policy "Super admin manage disciplines"
  on public.disciplines for all using (public.is_super_admin() or auth.role() = 'service_role');

create policy "Admins view own discipline assignments"
  on public.admin_disciplines for select
  using (admin_id = auth.uid() or public.is_super_admin() or auth.role() = 'service_role');

create policy "Users manage own discipline enrollments"
  on public.user_disciplines for all
  using (user_id = auth.uid() or public.is_super_admin() or auth.role() = 'service_role');

-- CONTENT POSTS & MEDIA
create policy "Anyone can view published content"
  on public.content_posts for select using (is_published = true);

create policy "Sport admin manage discipline content"
  on public.content_posts for all
  using (public.is_discipline_admin(discipline_id) or auth.role() = 'service_role');

create policy "Service role full access on content_media"
  on public.content_media for all using (auth.role() = 'service_role');

create policy "Anyone can view content categories"
  on public.content_categories for select using (true);

create policy "Sport admin manage content categories"
  on public.content_categories for all
  using (public.is_discipline_admin(discipline_id) or auth.role() = 'service_role');

-- WORKOUTS & EXERCISES
create policy "Anyone can view published workouts"
  on public.workouts for select using (is_published = true);

create policy "Sport admin manage discipline workouts"
  on public.workouts for all
  using (public.is_discipline_admin(discipline_id) or auth.role() = 'service_role');

create policy "Anyone can view exercises of published workouts"
  on public.workout_exercises for select
  using (
    exists (
      select 1 from public.workouts w
      where w.id = workout_exercises.workout_id
        and w.is_published = true
    )
  );

create policy "Sport admin manage workout exercises"
  on public.workout_exercises for all
  using (
    exists (
      select 1 from public.workouts w
      where w.id = workout_exercises.workout_id
        and (public.is_discipline_admin(w.discipline_id) or auth.role() = 'service_role')
    )
  );

create policy "Anyone can view workout categories"
  on public.workout_categories for select using (true);

create policy "Sport admin manage workout categories"
  on public.workout_categories for all
  using (public.is_discipline_admin(discipline_id) or auth.role() = 'service_role');

-- PROGRAMS
create policy "Anyone can view published programs"
  on public.programs for select using (is_published = true);

create policy "Sport admin manage discipline programs"
  on public.programs for all
  using (public.is_discipline_admin(discipline_id) or auth.role() = 'service_role');

create policy "Anyone can view workouts in published programs"
  on public.program_workouts for select
  using (
    exists (
      select 1 from public.programs p
      where p.id = program_workouts.program_id
        and p.is_published = true
    )
  );

create policy "Sport admin manage program workouts"
  on public.program_workouts for all
  using (
    exists (
      select 1 from public.programs p
      where p.id = program_workouts.program_id
        and (public.is_discipline_admin(p.discipline_id) or auth.role() = 'service_role')
    )
  );

-- CLASSES & BOOKINGS
create policy "Anyone can view active classes"
  on public.classes for select using (true);

create policy "Sport admin manage discipline classes"
  on public.classes for all
  using (public.is_discipline_admin(discipline_id) or auth.role() = 'service_role');

create policy "Users view own bookings"
  on public.bookings for select using (auth.uid() = user_id or auth.role() = 'service_role');

create policy "Users create own bookings"
  on public.bookings for insert with check (auth.uid() = user_id or auth.role() = 'service_role');

create policy "Sport admin manage class bookings"
  on public.bookings for all
  using (
    exists (
      select 1 from public.classes c
      where c.id = bookings.class_id
        and (public.is_discipline_admin(c.discipline_id) or auth.role() = 'service_role')
    )
  );

-- PRODUCTS & E-COMMERCE
create policy "Anyone can view active products"
  on public.products for select using (is_active = true);

create policy "Shop admin and service role manage products"
  on public.products for all using (
    (auth.jwt() -> 'app_metadata' ->> 'admin_role') in ('shop_admin', 'super_admin')
    or auth.role() = 'service_role'
  );

create policy "Anyone can view product categories"
  on public.product_categories for select using (true);

create policy "Shop admin manage product categories"
  on public.product_categories for all using (
    (auth.jwt() -> 'app_metadata' ->> 'admin_role') in ('shop_admin', 'super_admin')
    or auth.role() = 'service_role'
  );

-- ORDERS
create policy "Users can view own orders"
  on public.orders for select using (auth.uid() = user_id);

create policy "Shop admin full access on orders"
  on public.orders for all using (
    (auth.jwt() -> 'app_metadata' ->> 'admin_role') in ('shop_admin', 'super_admin')
    or auth.role() = 'service_role'
  );

create policy "Shop admin full access on order_items"
  on public.order_items for all using (
    (auth.jwt() -> 'app_metadata' ->> 'admin_role') in ('shop_admin', 'super_admin')
    or auth.role() = 'service_role'
  );

-- ANNOUNCEMENTS & ADMIN TABLES
create policy "Anyone can view active user announcements"
  on public.announcements for select
  using (
    audience in ('all', 'users')
    and (expires_at is null or expires_at > now())
  );

create policy "Service role full access on audit_logs"
  on public.audit_logs for all using (auth.role() = 'service_role');

create policy "Service role full access on announcements"
  on public.announcements for all using (auth.role() = 'service_role');

create policy "Service role full access on platform_settings"
  on public.platform_settings for all using (auth.role() = 'service_role');

-- =============================================================================
-- STORAGE BUCKETS
-- =============================================================================
insert into storage.buckets (id, name, public)
values
  ('sport-content',   'sport-content',   true),
  ('product-images',  'product-images',  true),
  ('avatars',         'avatars',         true)
on conflict (id) do nothing;

create policy "Public read sport-content"
  on storage.objects for select
  using (bucket_id = 'sport-content');

create policy "Authenticated upload sport-content"
  on storage.objects for insert
  with check (bucket_id = 'sport-content' and auth.role() = 'authenticated');

create policy "Service role manage sport-content"
  on storage.objects for all
  using (bucket_id = 'sport-content' and auth.role() = 'service_role');

create policy "Public read product-images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Authenticated upload product-images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "Service role manage product-images"
  on storage.objects for all
  using (bucket_id = 'product-images' and auth.role() = 'service_role');

create policy "Public read avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users upload own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Service role manage avatars"
  on storage.objects for all
  using (bucket_id = 'avatars' and auth.role() = 'service_role');
