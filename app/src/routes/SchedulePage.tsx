import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Button, Card } from "@/components/ui";
import { fetchSessions, fetchTrainers } from "@/lib/catalog";
import { cn } from "@/lib/utils";

function buildDays(count = 7) {
  const start = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function sameDay(a: Date, iso: string) {
  const b = new Date(iso);
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function timeLabel(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function durationMin(start: string, end: string) {
  const a = new Date(start).getTime();
  const b = new Date(end).getTime();
  if (!a || !b) return 55;
  return Math.max(15, Math.round((b - a) / 60000));
}

export function SchedulePage() {
  const { t } = useTranslation();
  const days = useMemo(() => buildDays(), []);
  const [active, setActive] = useState(0);
  const sessions = useQuery({ queryKey: ["catalog-sessions"], queryFn: fetchSessions });
  const trainers = useQuery({ queryKey: ["catalog-trainers"], queryFn: fetchTrainers });

  const day = days[active]!;
  const slots = (sessions.data ?? []).filter((s) => sameDay(day, s.startsAt));

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink">{t("schedule.title")}</h1>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {days.map((d, i) => {
          const selected = i === active;
          return (
            <button
              key={d.toISOString()}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "flex min-w-14 flex-col items-center rounded-2xl px-3 py-2.5 text-xs font-semibold",
                selected ? "bg-brand text-white" : "bg-card text-ink-soft shadow-[var(--shadow-card)]",
              )}
            >
              <span className="opacity-80">
                {d.toLocaleDateString(undefined, { weekday: "short" })}
              </span>
              <span className="mt-1 text-base font-bold">{d.getDate()}</span>
            </button>
          );
        })}
      </div>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold">{t("schedule.upcoming")}</h2>
        {slots.length === 0 ? (
          <p className="text-sm text-muted">{t("explore.empty")}</p>
        ) : (
          <div className="space-y-3">
            {slots.map((slot) => {
              const trainer =
                (trainers.data ?? []).find((tr) => tr.id === slot.trainerId) ??
                (trainers.data ?? [])[0];
              return (
                <Card key={slot.id} className="flex items-center gap-3 p-3">
                  <div className="w-14 shrink-0 text-center">
                    <p className="text-sm font-bold text-ink">{timeLabel(slot.startsAt)}</p>
                    <p className="text-[0.65rem] text-muted">{durationMin(slot.startsAt, slot.endsAt)}m</p>
                  </div>
                  <div className="h-12 w-px bg-line" />
                  <img src={slot.image} alt="" className="size-14 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold">{slot.name}</h3>
                    <p className="text-xs text-muted">
                      {slot.trainerName} · {slot.booked}/{slot.capacity}
                    </p>
                  </div>
                  {trainer ? (
                    <Link to="/trainers/$trainerId" params={{ trainerId: trainer.id }}>
                      <img
                        src={trainer.image}
                        alt=""
                        className="size-9 rounded-full object-cover ring-2 ring-brand/20"
                      />
                    </Link>
                  ) : null}
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <Button className="w-full">{t("schedule.reserve")}</Button>
    </div>
  );
}
