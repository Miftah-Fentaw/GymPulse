import { useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui";
import { fetchSessions, fetchTrainers, fetchWorkouts } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function TrainerDetailPage() {
  const { t } = useTranslation();
  const { trainerId } = useParams({ strict: false }) as { trainerId: string };
  const trainers = useQuery({ queryKey: ["catalog-trainers"], queryFn: fetchTrainers });
  const workouts = useQuery({ queryKey: ["catalog-workouts"], queryFn: fetchWorkouts });
  const sessions = useQuery({ queryKey: ["catalog-sessions"], queryFn: fetchSessions });
  const [tab, setTab] = useState<"course" | "schedule">("course");

  const trainer = (trainers.data ?? []).find((tr) => tr.id === trainerId);
  const courses = (workouts.data ?? []).filter((w) => w.trainerId === trainerId);
  const schedule = (sessions.data ?? []).filter((s) => s.trainerId === trainerId).slice(0, 6);

  if (trainers.isLoading) {
    return <p className="py-10 text-center text-sm text-muted">…</p>;
  }

  if (!trainer) {
    return (
      <div className="py-10 text-center text-muted">
        <Link to="/explore">{t("common.back")}</Link>
      </div>
    );
  }

  return (
    <div className="-mx-4 -mt-4 space-y-5 md:mx-0 md:mt-0">
      <div className="relative">
        <img src={trainer.image} alt="" className="h-72 w-full object-cover md:h-96 md:rounded-3xl" />
        <Link
          to="/explore"
          className="absolute left-4 top-4 grid size-10 place-items-center rounded-full bg-black/45 text-white"
        >
          ←
        </Link>
      </div>

      <div className="space-y-4 px-4 md:px-0">
        <div>
          <h1 className="font-display text-3xl font-bold">{trainer.name}</h1>
          <p className="text-sm text-muted">
            {trainer.role} · {t("trainer.rating", { rating: trainer.rating.toFixed(1) })}
          </p>
        </div>
        <p className="text-sm leading-relaxed text-ink-soft">{trainer.bio}</p>

        <div className="grid grid-cols-2 rounded-2xl bg-card p-1 shadow-[var(--shadow-card)]">
          {(["course", "schedule"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                "rounded-xl py-2.5 text-sm font-semibold",
                tab === key ? "bg-brand text-white" : "text-muted",
              )}
            >
              {t(`trainer.${key}`)}
            </button>
          ))}
        </div>

        {tab === "course" ? (
          <div className="space-y-3">
            {(courses.length ? courses : workouts.data ?? []).slice(0, 4).map((w) => (
              <Link key={w.id} to="/workouts/$workoutId" params={{ workoutId: w.id }}>
                <Card className="mb-3 flex gap-3 p-2.5">
                  <img src={w.image} alt="" className="size-16 rounded-xl object-cover" />
                  <div className="py-1">
                    <h3 className="font-semibold">{w.title}</h3>
                    <p className="text-xs text-muted">
                      {w.durationMin} mins · {w.level}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="space-y-3 p-4 text-sm text-ink-soft">
            {schedule.length === 0 ? (
              <p>{t("explore.empty")}</p>
            ) : (
              schedule.map((s) => (
                <p key={s.id}>
                  {new Date(s.startsAt).toLocaleString(undefined, {
                    weekday: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  — {s.name}
                </p>
              ))
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
