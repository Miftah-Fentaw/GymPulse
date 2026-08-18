drop policy "Admins view own discipline assignments" on "public"."admin_disciplines";

drop policy "Sport admin manage class bookings" on "public"."bookings";

drop policy "Users create own bookings" on "public"."bookings";

drop policy "Users view own bookings" on "public"."bookings";

drop policy "Anyone can view active classes" on "public"."classes";

drop policy "Sport admin manage discipline classes" on "public"."classes";

drop policy "Sport admin manage content categories" on "public"."content_categories";

drop policy "Sport admin manage discipline content" on "public"."content_posts";

drop policy "Anyone can view disciplines" on "public"."disciplines";

drop policy "Super admin manage disciplines" on "public"."disciplines";

drop policy "Shop admin full access on order_items" on "public"."order_items";

drop policy "Shop admin full access on orders" on "public"."orders";

drop policy "Shop admin manage product categories" on "public"."product_categories";

drop policy "Shop admin and service role manage products" on "public"."products";

drop policy "Sport admin manage program workouts" on "public"."program_workouts";

drop policy "Sport admin manage discipline programs" on "public"."programs";

drop policy "Users manage own discipline enrollments" on "public"."user_disciplines";

drop policy "Sport admin manage workout categories" on "public"."workout_categories";

drop policy "Sport admin manage workout exercises" on "public"."workout_exercises";

drop policy "Sport admin manage discipline workouts" on "public"."workouts";

revoke references on table "public"."admin_disciplines" from "anon";

revoke trigger on table "public"."admin_disciplines" from "anon";

revoke truncate on table "public"."admin_disciplines" from "anon";

revoke references on table "public"."admin_disciplines" from "authenticated";

revoke trigger on table "public"."admin_disciplines" from "authenticated";

revoke truncate on table "public"."admin_disciplines" from "authenticated";

revoke references on table "public"."admin_disciplines" from "service_role";

revoke trigger on table "public"."admin_disciplines" from "service_role";

revoke truncate on table "public"."admin_disciplines" from "service_role";

revoke references on table "public"."user_disciplines" from "anon";

revoke trigger on table "public"."user_disciplines" from "anon";

revoke truncate on table "public"."user_disciplines" from "anon";

revoke references on table "public"."user_disciplines" from "authenticated";

revoke trigger on table "public"."user_disciplines" from "authenticated";

revoke truncate on table "public"."user_disciplines" from "authenticated";

revoke references on table "public"."user_disciplines" from "service_role";

revoke trigger on table "public"."user_disciplines" from "service_role";

revoke truncate on table "public"."user_disciplines" from "service_role";

alter table "public"."admin_disciplines" drop constraint "admin_disciplines_admin_id_discipline_id_key";

alter table "public"."admin_disciplines" drop constraint "admin_disciplines_admin_id_fkey";

alter table "public"."admin_disciplines" drop constraint "admin_disciplines_discipline_id_fkey";

alter table "public"."announcements" drop constraint "announcements_discipline_id_fkey";

alter table "public"."classes" drop constraint "classes_location_id_fkey";

alter table "public"."content_categories" drop constraint "content_categories_discipline_id_fkey";

alter table "public"."content_posts" drop constraint "content_posts_discipline_id_fkey";

alter table "public"."programs" drop constraint "programs_discipline_id_fkey";

alter table "public"."user_disciplines" drop constraint "user_disciplines_discipline_id_fkey";

alter table "public"."user_disciplines" drop constraint "user_disciplines_user_id_discipline_id_key";

alter table "public"."user_disciplines" drop constraint "user_disciplines_user_id_fkey";

alter table "public"."workout_categories" drop constraint "workout_categories_discipline_id_fkey";

alter table "public"."workouts" drop constraint "workouts_discipline_id_fkey";

drop function if exists "public"."is_discipline_admin"(d_id uuid);

drop function if exists "public"."is_super_admin"();

alter table "public"."admin_disciplines" drop constraint "admin_disciplines_pkey";

alter table "public"."user_disciplines" drop constraint "user_disciplines_pkey";

drop index if exists "public"."admin_disciplines_admin_id_discipline_id_key";

drop index if exists "public"."admin_disciplines_pkey";

drop index if exists "public"."idx_admin_disciplines_admin";

drop index if exists "public"."idx_admin_disciplines_discipline";

drop index if exists "public"."idx_announcements_discipline";

drop index if exists "public"."idx_bookings_class";

drop index if exists "public"."idx_bookings_user";

drop index if exists "public"."idx_classes_discipline";

drop index if exists "public"."idx_classes_trainer";

drop index if exists "public"."idx_content_categories_discipline";

drop index if exists "public"."idx_content_posts_discipline";

drop index if exists "public"."idx_programs_discipline";

drop index if exists "public"."idx_user_disciplines_discipline";

drop index if exists "public"."idx_user_disciplines_user";

drop index if exists "public"."idx_workout_categories_discipline";

drop index if exists "public"."idx_workouts_discipline";

drop index if exists "public"."user_disciplines_pkey";

drop index if exists "public"."user_disciplines_user_id_discipline_id_key";

drop table "public"."admin_disciplines";

drop table "public"."user_disciplines";

alter table "public"."announcements" drop column "discipline_id";

alter table "public"."bookings" disable row level security;

alter table "public"."classes" drop column "location_id";

alter table "public"."classes" disable row level security;

alter table "public"."content_categories" drop column "discipline_id";

alter table "public"."content_posts" drop column "discipline_id";

alter table "public"."disciplines" drop column "description";

alter table "public"."disciplines" drop column "icon_url";

alter table "public"."disciplines" disable row level security;

alter table "public"."gym_locations" disable row level security;

alter table "public"."programs" drop column "discipline_id";

alter table "public"."trainers" disable row level security;

alter table "public"."workout_categories" drop column "discipline_id";

alter table "public"."workouts" drop column "discipline_id";

CREATE INDEX idx_workouts_difficulty ON public.workouts USING btree (difficulty);


  create policy "Service role full access on content_categories"
  on "public"."content_categories"
  as permissive
  for all
  to public
using ((auth.role() = 'service_role'::text));



  create policy "Service role full access on content_posts"
  on "public"."content_posts"
  as permissive
  for all
  to public
using ((auth.role() = 'service_role'::text));



  create policy "Service role full access on order_items"
  on "public"."order_items"
  as permissive
  for all
  to public
using ((auth.role() = 'service_role'::text));



  create policy "Service role full access on orders"
  on "public"."orders"
  as permissive
  for all
  to public
using ((auth.role() = 'service_role'::text));



  create policy "Service role full access on product_categories"
  on "public"."product_categories"
  as permissive
  for all
  to public
using ((auth.role() = 'service_role'::text));



  create policy "Service role full access on products"
  on "public"."products"
  as permissive
  for all
  to public
using ((auth.role() = 'service_role'::text));



  create policy "Service role full access on program_workouts"
  on "public"."program_workouts"
  as permissive
  for all
  to public
using ((auth.role() = 'service_role'::text));



  create policy "Service role full access on programs"
  on "public"."programs"
  as permissive
  for all
  to public
using ((auth.role() = 'service_role'::text));



  create policy "Service role full access on workout_categories"
  on "public"."workout_categories"
  as permissive
  for all
  to public
using ((auth.role() = 'service_role'::text));



  create policy "Service role full access on workout_exercises"
  on "public"."workout_exercises"
  as permissive
  for all
  to public
using ((auth.role() = 'service_role'::text));



  create policy "Service role full access on workouts"
  on "public"."workouts"
  as permissive
  for all
  to public
using ((auth.role() = 'service_role'::text));



