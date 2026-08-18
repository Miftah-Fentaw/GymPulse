-- Directory views so admin UIs can list users when Auth Admin list is unavailable.
-- DROP first: CREATE OR REPLACE cannot insert/rename columns on an existing view.

drop view if exists public.app_users;
drop view if exists public.admin_users;

create view public.admin_users as
select
  u.id,
  u.email,
  u.created_at,
  u.last_sign_in_at,
  u.banned_until,
  u.raw_user_meta_data->>'full_name' as full_name,
  u.raw_app_meta_data->>'admin_role' as admin_role,
  (u.raw_app_meta_data->>'is_admin')::boolean as is_admin,
  u.email_confirmed_at
from auth.users u
where u.raw_app_meta_data->>'admin_role' is not null;

create view public.app_users as
select
  u.id,
  u.email,
  u.created_at,
  u.last_sign_in_at,
  u.banned_until,
  u.raw_user_meta_data->>'full_name' as full_name,
  u.raw_app_meta_data->>'admin_role' as admin_role,
  p.phone,
  p.avatar_url,
  u.email_confirmed_at
from auth.users u
left join public.profiles p on p.id = u.id;

grant select on public.admin_users to service_role;
grant select on public.app_users to service_role;
