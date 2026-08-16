-- =============================================================================
-- GymPulse Database Schema
-- Migration: 20240001000000_init_schema
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
-- ADMIN USERS (view over auth.users filtered by app_metadata)
-- =============================================================================
-- Admin roles are stored in auth.users app_metadata.admin_role:
--   super_admin  - full platform access
--   user_admin   - manage app users (web-user-admin)
--   shop_admin   - manage products & orders (web-shop)
--   sport_admin  - manage sport content (apps/sport-admin-backend)

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
-- AUDIT LOGS
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

-- =============================================================================
-- PLATFORM SETTINGS
-- =============================================================================
create table if not exists public.platform_settings (
  key         text primary key,
  value       jsonb not null,
  description text,
  updated_by  uuid references auth.users(id) on delete set null,
  updated_at  timestamptz not null default now()
);

insert into public.platform_settings (key, value, description) values
  ('app_name',          '"GymPulse"',           'Application name'),
  ('maintenance_mode',  'false',                 'Put the platform in maintenance mode'),
  ('signup_enabled',    'true',                  'Allow new user registrations'),
  ('max_upload_mb',     '200',                   'Maximum file upload size in MB')
on conflict (key) do nothing;

-- =============================================================================
-- ANNOUNCEMENTS
-- =============================================================================
create table if not exists public.announcements (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  message     text not null,
  audience    text not null default 'all'
                check (audience in ('all', 'users', 'admins', 'shop_admins', 'sport_admins')),
  tags        text[] default '{}',
  expires_at  timestamptz,
  created_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- =============================================================================
-- CONTENT CATEGORIES
-- =============================================================================
create table if not exists public.content_categories (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  description text,
  slug        text not null unique,
  created_at  timestamptz not null default now()
);

-- =============================================================================
-- CONTENT POSTS
-- =============================================================================
create table if not exists public.content_posts (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  description  text,
  content_type text not null check (content_type in ('article', 'workout', 'program', 'tip', 'announcement')),
  tags         text[] default '{}',
  category_id  uuid references public.content_categories(id) on delete set null,
  is_published boolean not null default false,
  created_by   uuid references auth.users(id) on delete set null,
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

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

-- =============================================================================
-- CONTENT MEDIA BLOCKS
-- =============================================================================
create table if not exists public.content_media (
  id              uuid primary key default uuid_generate_v4(),
  content_post_id uuid not null references public.content_posts(id) on delete cascade,
  type            text not null check (type in ('image', 'video', 'text', 'file')),
  url             text,              -- storage URL (for image/video/file)
  text            text,              -- text content (for text blocks)
  caption         text,
  mime_type       text,
  "order"         int not null default 0,
  created_at      timestamptz not null default now()
);

create index if not exists idx_content_media_post_id on public.content_media(content_post_id);

-- =============================================================================
-- WORKOUT CATEGORIES
-- =============================================================================
create table if not exists public.workout_categories (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  description text,
  slug        text not null unique,
  icon_url    text,
  created_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- =============================================================================
-- WORKOUTS
-- =============================================================================
create table if not exists public.workouts (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  description   text,
  duration_mins int,
  difficulty    text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  category_id   uuid references public.workout_categories(id) on delete set null,
  tags          text[] default '{}',
  thumbnail_url text,
  video_url     text,
  is_published  boolean not null default false,
  created_by    uuid references auth.users(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_workouts_category on public.workouts(category_id);
create index if not exists idx_workouts_difficulty on public.workouts(difficulty);
create index if not exists idx_workouts_published on public.workouts(is_published);
create index if not exists idx_workouts_created_by on public.workouts(created_by);

-- =============================================================================
-- WORKOUT EXERCISES
-- =============================================================================
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

-- =============================================================================
-- FITNESS PROGRAMS
-- =============================================================================
create table if not exists public.programs (
  id             uuid primary key default uuid_generate_v4(),
  title          text not null,
  description    text,
  duration_weeks int,
  difficulty     text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  category_id    uuid references public.workout_categories(id) on delete set null,
  tags           text[] default '{}',
  thumbnail_url  text,
  is_published   boolean not null default false,
  created_by     uuid references auth.users(id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- =============================================================================
-- PROGRAM WORKOUTS (schedule)
-- =============================================================================
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
-- PRODUCT CATEGORIES
-- =============================================================================
create table if not exists public.product_categories (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  description text,
  slug        text not null unique,
  created_at  timestamptz not null default now()
);

-- =============================================================================
-- PRODUCTS
-- =============================================================================
create table if not exists public.products (
  id             uuid primary key default uuid_generate_v4(),
  name           text not null,
  description    text,
  price          numeric(10,2) not null check (price >= 0),
  stock          int not null default 0 check (stock >= 0),
  category_id    uuid references public.product_categories(id) on delete set null,
  images         text[] default '{}',
  is_active      boolean not null default true,
  shop_admin_id  uuid references auth.users(id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_shop_admin on public.products(shop_admin_id);
create index if not exists idx_products_active on public.products(is_active);

-- =============================================================================
-- ORDERS
-- =============================================================================
create table if not exists public.orders (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references auth.users(id) on delete set null,
  shop_admin_id uuid references auth.users(id) on delete set null,
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

-- =============================================================================
-- ORDER ITEMS
-- =============================================================================
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

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

alter table public.profiles enable row level security;
alter table public.content_posts enable row level security;
alter table public.content_media enable row level security;
alter table public.workouts enable row level security;
alter table public.programs enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.audit_logs enable row level security;
alter table public.announcements enable row level security;
alter table public.platform_settings enable row level security;

-- Profiles: users can read/update their own; service role can do anything.
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Service role full access on profiles"
  on public.profiles for all using (auth.role() = 'service_role');

-- Content posts: published content is public; service role unrestricted.
create policy "Anyone can view published content"
  on public.content_posts for select using (is_published = true);

create policy "Service role full access on content_posts"
  on public.content_posts for all using (auth.role() = 'service_role');

create policy "Service role full access on content_media"
  on public.content_media for all using (auth.role() = 'service_role');

-- Workouts: published workouts are public.
create policy "Anyone can view published workouts"
  on public.workouts for select using (is_published = true);

create policy "Service role full access on workouts"
  on public.workouts for all using (auth.role() = 'service_role');

-- Programs: published programs are public.
create policy "Anyone can view published programs"
  on public.programs for select using (is_published = true);

create policy "Service role full access on programs"
  on public.programs for all using (auth.role() = 'service_role');

-- Products: active products are public.
create policy "Anyone can view active products"
  on public.products for select using (is_active = true);

create policy "Service role full access on products"
  on public.products for all using (auth.role() = 'service_role');

-- Orders: users can view their own orders.
create policy "Users can view own orders"
  on public.orders for select using (auth.uid() = user_id);

create policy "Service role full access on orders"
  on public.orders for all using (auth.role() = 'service_role');

create policy "Service role full access on order_items"
  on public.order_items for all using (auth.role() = 'service_role');

-- Admin-only tables: service role only.
create policy "Service role full access on audit_logs"
  on public.audit_logs for all using (auth.role() = 'service_role');

create policy "Service role full access on announcements"
  on public.announcements for all using (auth.role() = 'service_role');

create policy "Service role full access on platform_settings"
  on public.platform_settings for all using (auth.role() = 'service_role');
