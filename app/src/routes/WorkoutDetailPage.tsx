import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Button, Card } from "@/components/ui";
import { fetchTrainers, fetchWorkouts } from "@/lib/catalog";

export function WorkoutDetailPage() {
  const { t } = useTranslation();
  const { workoutId } = useParams({ strict: false }) as { workoutId: string };
  const workouts = useQuery({ queryKey: ["catalog-workouts"], queryFn: fetchWorkouts });
  const trainers = useQuery({ queryKey: ["catalog-trainers"], queryFn: fetchTrainers });

  const workout = (workouts.data ?? []).find((w) => w.id === workoutId);
  const trainer =
    (trainers.data ?? []).find((tr) => tr.id === workout?.trainerId) ?? (trainers.data ?? [])[0];

  if (workouts.isLoading) {
    return <p className="py-10 text-center text-sm text-muted">…</p>;
  }

  if (!workout) {
    return (
      <div className="py-10 text-center text-muted">
        <Link to="/">{t("common.back")}</Link>
      </div>
    );
  }

  return (
    <div className="-mx-4 -mt-4 md:mx-0 md:mt-0">
      <div className="relative">
        <img src={workout.image} alt="" className="h-72 w-full object-cover md:h-96 md:rounded-3xl" />
        <Link
          to="/"
          className="absolute left-4 top-4 grid size-10 place-items-center rounded-full bg-black/45 text-white"
        >
          ←
        </Link>
      </div>

      <div className="space-y-5 px-4 pt-5 md:px-0">
        <div>
          <h1 className="font-display text-3xl font-bold">{workout.title}</h1>
          <p className="mt-1 text-sm text-muted">
            {workout.level} · {workout.category}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 text-center">
            <p className="text-xs text-muted">{t("workout.burn")}</p>
            <p className="mt-1 font-display text-xl font-bold text-brand">
              {t("workout.kcal", { count: workout.kcal })}
            </p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-xs text-muted">{t("workout.duration")}</p>
            <p className="mt-1 font-display text-xl font-bold text-brand">
              {t("workout.mins", { count: workout.durationMin })}
            </p>
          </Card>
        </div>

        {trainer ? (
          <Card className="flex items-center gap-3 p-3">
            <Link to="/trainers/$trainerId" params={{ trainerId: trainer.id }}>
              <img src={trainer.image} alt="" className="size-12 rounded-full object-cover" />
            </Link>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold">{trainer.name}</h3>
              <p className="text-xs text-muted">{trainer.role}</p>
            </div>
            <Button variant="soft" type="button">
              {t("workout.follow")}
            </Button>
          </Card>
        ) : null}

        <div>
          <h2 className="mb-2 font-display text-lg font-bold">{t("workout.about")}</h2>
          <p className="text-sm leading-relaxed text-ink-soft">{workout.description}</p>
        </div>

        <div className="sticky bottom-20 z-10 md:static md:bottom-auto">
          <Button className="w-full" type="button">
            {t("workout.browse")}
          </Button>
        </div>
      </div>
    </div>
  );
}
