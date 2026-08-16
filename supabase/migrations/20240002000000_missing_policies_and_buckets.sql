-- =============================================================================
-- GymPulse — Migration 002
-- Adds missing RLS policies, indexes, and storage bucket setup
-- =============================================================================

-- =============================================================================
-- workout_exercises — missing RLS
-- =============================================================================
alter table public.workout_exercises enable row level security;

create policy "Anyone can view exercises of published workouts"
  on public.workout_exercises for select
  using (
    exists (
      select 1 from public.workouts w
      where w.id = workout_exercises.workout_id
        and w.is_published = true
    )
  );

create policy "Service role full access on workout_exercises"
  on public.workout_exercises for all
  using (auth.role() = 'service_role');

-- =============================================================================
-- program_workouts — public read for published programs
-- =============================================================================
alter table public.program_workouts enable row level security;

create policy "Anyone can view workouts in published programs"
  on public.program_workouts for select
  using (
    exists (
      select 1 from public.programs p
      where p.id = program_workouts.program_id
        and p.is_published = true
    )
  );

create policy "Service role full access on program_workouts"
  on public.program_workouts for all
  using (auth.role() = 'service_role');

-- =============================================================================
-- workout_categories — public read
-- =============================================================================
alter table public.workout_categories enable row level security;

create policy "Anyone can view workout categories"
  on public.workout_categories for select using (true);

create policy "Service role full access on workout_categories"
  on public.workout_categories for all
  using (auth.role() = 'service_role');

-- =============================================================================
-- content_categories — public read
-- =============================================================================
alter table public.content_categories enable row level security;

create policy "Anyone can view content categories"
  on public.content_categories for select using (true);

create policy "Service role full access on content_categories"
  on public.content_categories for all
  using (auth.role() = 'service_role');

-- =============================================================================
-- product_categories — public read
-- =============================================================================
alter table public.product_categories enable row level security;

create policy "Anyone can view product categories"
  on public.product_categories for select using (true);

create policy "Service role full access on product_categories"
  on public.product_categories for all
  using (auth.role() = 'service_role');

-- =============================================================================
-- announcements — public read for non-expired, user-facing announcements
-- =============================================================================
create policy "Anyone can view active user announcements"
  on public.announcements for select
  using (
    audience in ('all', 'users')
    and (expires_at is null or expires_at > now())
  );

-- =============================================================================
-- profiles — allow service role insert (for the trigger)
-- =============================================================================
create policy "Service role can insert profiles"
  on public.profiles for insert
  using (auth.role() = 'service_role')
  with check (true);

-- =============================================================================
-- updated_at auto-maintenance triggers
-- =============================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create or replace trigger set_updated_at_workouts
  before update on public.workouts
  for each row execute procedure public.set_updated_at();

create or replace trigger set_updated_at_programs
  before update on public.programs
  for each row execute procedure public.set_updated_at();

create or replace trigger set_updated_at_products
  before update on public.products
  for each row execute procedure public.set_updated_at();

create or replace trigger set_updated_at_orders
  before update on public.orders
  for each row execute procedure public.set_updated_at();

-- =============================================================================
-- Storage buckets
-- =============================================================================
insert into storage.buckets (id, name, public)
values
  ('sport-content',   'sport-content',   true),
  ('product-images',  'product-images',  true),
  ('avatars',         'avatars',         true)
on conflict (id) do nothing;

-- Storage RLS: allow authenticated uploads, public reads
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

-- =============================================================================
-- Additional platform settings
-- =============================================================================
insert into public.platform_settings (key, value, description) values
  ('allow_guest_orders', 'false',     'Allow unauthenticated users to place orders'),
  ('featured_programs',  '[]',        'Array of program IDs to feature on the home screen'),
  ('featured_workouts',  '[]',        'Array of workout IDs to feature on the home screen')
on conflict (key) do nothing;
