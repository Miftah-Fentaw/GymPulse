import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import { Bell, Star } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui";
import { displayName, getSession, subscribeSession } from "@/lib/auth";
import { fetchWorkouts, workoutTypes } from "@/lib/catalog";

export function HomePage() {
  const { t } = useTranslation();
  const session = useSyncExternalStore(subscribeSession, getSession, getSession);
  const name = displayName(session.user);
  const workouts = useQuery({ queryKey: ["catalog-workouts"], queryFn: fetchWorkouts });
  const list = workouts.data ?? [];

  return (
    <div className="space-y-7">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted">{t("home.hello", { name })}</p>
          <h1 className="font-display text-2xl font-bold text-ink md:text-3xl">{t("home.tagline")}</h1>
        </div>
        <button
          type="button"
          className="grid size-11 place-items-center rounded-2xl bg-card text-ink shadow-[var(--shadow-card)]"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
        </button>
      </header>

      <section>
        <SectionTitle title={t("home.trending")} />
        {list.length === 0 ? (
          <p className="text-sm text-muted">{t("explore.empty")}</p>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-3">
            {list.slice(0, 3).map((w) => (
              <Link
                key={w.id}
                to="/workouts/$workoutId"
                params={{ workoutId: w.id }}
                className="relative block min-w-[78%] shrink-0 overflow-hidden rounded-3xl md:min-w-0"
              >
                <img src={w.image} alt="" className="h-48 w-full object-cover md:h-56" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <div className="mb-1 flex items-center gap-1 text-xs font-semibold text-white/90">
                    <Star className="size-3.5 fill-current text-brand" />
                    {w.rating.toFixed(1)}
                  </div>
                  <h3 className="font-display text-lg font-bold leading-tight">{w.title}</h3>
                  <p className="text-xs text-white/80">
                    {t("home.min", { count: w.durationMin })} · {w.level}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionTitle title={t("home.types")} />
        <div className="flex gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-4 md:overflow-visible">
          {workoutTypes.map((type) => (
            <Link
              key={type.id}
              to="/explore"
              search={{ q: type.id }}
              className="relative min-w-[42%] shrink-0 overflow-hidden rounded-2xl md:min-w-0"
            >
              <img src={type.image} alt="" className="h-28 w-full object-cover" />
              <div className="absolute inset-0 bg-black/35" />
              <span className="absolute inset-x-0 bottom-3 text-center font-display text-sm font-bold text-white">
                {t(type.labelKey)}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle
          title={t("home.additional")}
          action={
            <Link to="/explore" className="text-sm font-semibold text-brand">
              {t("home.seeAll")}
            </Link>
          }
        />
        <div className="space-y-3 md:grid md:grid-cols-2 md:gap-3 md:space-y-0 lg:grid-cols-3">
          {list.map((w) => (
            <Link key={w.id} to="/workouts/$workoutId" params={{ workoutId: w.id }}>
              <Card className="flex gap-3 p-2.5 transition hover:ring-1 hover:ring-brand/20">
                <img src={w.image} alt="" className="size-20 rounded-xl object-cover" />
                <div className="min-w-0 py-1">
                  <h3 className="truncate font-semibold text-ink">{w.title}</h3>
                  <p className="mt-1 text-xs text-muted">
                    {t("home.level", { level: w.level })} · {t("home.min", { count: w.durationMin })}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
