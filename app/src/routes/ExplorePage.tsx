import { useMemo, useState } from "react";
import { Link, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { Card, Input } from "@/components/ui";
import { fetchTrainers, fetchWorkouts } from "@/lib/catalog";

export function ExplorePage() {
  const { t } = useTranslation();
  const search = useSearch({ strict: false }) as { q?: string };
  const [q, setQ] = useState(search.q ?? "");
  const workouts = useQuery({ queryKey: ["catalog-workouts"], queryFn: fetchWorkouts });
  const trainers = useQuery({ queryKey: ["catalog-trainers"], queryFn: fetchTrainers });

  const filtered = useMemo(() => {
    const list = workouts.data ?? [];
    const needle = q.trim().toLowerCase();
    if (!needle) return list;
    return list.filter(
      (w) =>
        w.title.toLowerCase().includes(needle) ||
        w.category.toLowerCase().includes(needle) ||
        w.level.toLowerCase().includes(needle),
    );
  }, [q, workouts.data]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold text-ink">{t("explore.title")}</h1>
        <div className="relative mt-4">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <Input
            className="pl-10"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("explore.placeholder")}
          />
        </div>
      </header>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold">{t("trainer.pro")}</h2>
        {(trainers.data ?? []).length === 0 ? (
          <p className="text-sm text-muted">{t("explore.empty")}</p>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-4">
            {(trainers.data ?? []).map((tr) => (
              <Link
                key={tr.id}
                to="/trainers/$trainerId"
                params={{ trainerId: tr.id }}
                className="relative min-w-[70%] shrink-0 overflow-hidden rounded-3xl md:min-w-0"
              >
                <img src={tr.image} alt="" className="h-52 w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <h3 className="font-display text-lg font-bold">{tr.name}</h3>
                  <p className="text-xs text-white/80">{tr.role}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold">{t("explore.results")}</h2>
        {filtered.length === 0 ? (
          <p className="text-sm text-muted">{t("explore.empty")}</p>
        ) : (
          <div className="space-y-3 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
            {filtered.map((w) => (
              <Link key={w.id} to="/workouts/$workoutId" params={{ workoutId: w.id }}>
                <Card className="flex gap-3 p-2.5">
                  <img src={w.image} alt="" className="size-20 rounded-xl object-cover" />
                  <div className="min-w-0 py-1">
                    <h3 className="truncate font-semibold">{w.title}</h3>
                    <p className="mt-1 text-xs text-muted">
                      {w.level} · {t("home.min", { count: w.durationMin })}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
