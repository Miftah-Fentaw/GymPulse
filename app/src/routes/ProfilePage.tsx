import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card } from "@/components/ui";
import { clearSession, displayName, getSession, subscribeSession } from "@/lib/auth";
import { fetchMeasurements, fetchMyMemberId, fetchMyWorkouts, fetchWorkouts } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function ProfilePage() {
  const { t } = useTranslation();
  const session = useSyncExternalStore(subscribeSession, getSession, getSession);
  const [tab, setTab] = useState<"activities" | "statistics">("activities");

  const memberId = useQuery({ queryKey: ["my-member-id"], queryFn: fetchMyMemberId });
  const myWorkouts = useQuery({
    queryKey: ["my-workouts", memberId.data],
    enabled: Boolean(memberId.data),
    queryFn: () => fetchMyWorkouts(memberId.data!),
  });
  const catalog = useQuery({ queryKey: ["catalog-workouts"], queryFn: fetchWorkouts });
  const measurements = useQuery({
    queryKey: ["my-measurements", memberId.data],
    enabled: Boolean(memberId.data),
    queryFn: () => fetchMeasurements(memberId.data!),
  });

  const activities = (myWorkouts.data?.length ? myWorkouts.data : catalog.data ?? []).slice(0, 4);
  const weight = (measurements.data ?? []).find((m) => m.kind === "weight");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <h1 className="font-display text-2xl font-bold">{t("profile.title")}</h1>
        <Button
          variant="ghost"
          className="rounded-xl px-3 py-2 text-brand transition hover:bg-brand-soft hover:text-brand-dark"
          type="button"
          onClick={() => void clearSession()}
        >
          {t("profile.logout")}
        </Button>
      </div>

      <Card className="overflow-hidden p-5">
        <div className="flex items-center gap-4">
          <img
            src="/media/avatar-1.jpg"
            alt=""
            className="size-16 rounded-full object-cover ring-2 ring-brand/30"
          />
          <div>
            <h2 className="font-display text-xl font-bold">{displayName(session.user)}</h2>
            <p className="text-sm text-muted">{session.user?.email ?? "member@gympulse.local"}</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          {[
            [t("profile.weight"), weight ? `${weight.value} ${weight.unit}` : "—"],
            [t("profile.height"), "—"],
            [t("profile.gender"), "—"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-surface px-2 py-3">
              <p className="text-xs text-muted">{label}</p>
              <p className="mt-1 text-sm font-bold">{value}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 rounded-2xl bg-card p-1 shadow-[var(--shadow-card)]">
        {(["activities", "statistics"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              "rounded-xl py-2.5 text-sm font-semibold",
              tab === key ? "bg-brand text-white" : "text-muted",
            )}
          >
            {t(`profile.${key}`)}
          </button>
        ))}
      </div>

      {tab === "activities" ? (
        <div className="space-y-3 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
          {activities.length === 0 ? (
            <p className="text-sm text-muted">{t("explore.empty")}</p>
          ) : (
            activities.map((w) => (
              <Link key={w.id} to="/workouts/$workoutId" params={{ workoutId: w.id }}>
                <Card className="flex gap-3 p-2.5">
                  <img src={w.image} alt="" className="size-16 rounded-xl object-cover" />
                  <div className="py-1">
                    <h3 className="font-semibold">{w.title}</h3>
                    <p className="text-xs text-muted">
                      {w.durationMin} mins · {w.kcal} kcal
                    </p>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="mb-4 font-display text-lg font-bold">{t("profile.weekly")}</h3>
            <div className="flex h-36 items-end gap-2">
              {(measurements.data ?? []).length === 0 ? (
                <p className="self-center text-sm text-muted">{t("explore.empty")}</p>
              ) : (
                (measurements.data ?? []).slice(0, 7).map((m, i) => {
                  const h = Math.min(100, Math.max(8, m.value));
                  return (
                    <div key={i} className="flex flex-1 flex-col items-center gap-2">
                      <div className="w-full rounded-t-lg bg-brand" style={{ height: `${h}%` }} />
                      <span className="text-[0.65rem] text-muted">{"MTWTFSS"[i] ?? "·"}</span>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
          <div className="grid grid-cols-3 gap-3">
            {[
              [t("profile.calories"), String(activities.reduce((n, w) => n + w.kcal, 0) || "—")],
              [t("profile.heart"), "—"],
              [t("profile.steps"), "—"],
            ].map(([label, value]) => (
              <Card key={label} className="p-3 text-center">
                <p className="text-xs text-muted">{label}</p>
                <p className="mt-1 font-display text-xl font-bold text-brand">{value}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Link to="/faq" className="block text-center text-sm font-semibold text-brand">
        {t("profile.faq")}
      </Link>
    </div>
  );
}
