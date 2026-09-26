import { useTranslation } from "react-i18next";
import { getSession, firstName } from "@/lib/auth";

export function RightRail({
  gymName,
  overdueCount = 0,
  checkinCount = 0,
  branchCount = 0,
}: {
  gymName?: string;
  overdueCount?: number;
  checkinCount?: number;
  branchCount?: number;
}) {
  const { t } = useTranslation();
  const { user } = getSession();

  return (
    <aside className="flex w-[300px] shrink-0 flex-col gap-4">
      <section className="rounded-[28px] bg-white p-5 shadow-(--shadow-card)">
        <div className="mb-4 text-sm font-bold text-ink">{t("dashboard.profile")}</div>
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 grid size-20 place-items-center overflow-hidden rounded-full bg-linear-to-br from-lavender to-peach text-2xl font-bold text-ink ring-4 ring-white shadow-md">
            {firstName(user).slice(0, 1).toUpperCase()}
          </div>
          <div className="text-base font-bold text-ink">{user?.name || user?.email}</div>
          <div className="mt-1 text-xs text-muted">
            {(user?.staff_roles ?? []).join(" · ") || "staff"}
          </div>
          <div className="mt-3 grid w-full grid-cols-2 gap-2 text-left text-xs">
            <div className="rounded-2xl bg-surface px-3 py-2">
              <div className="text-muted">Email</div>
              <div className="truncate font-semibold text-ink">{user?.email}</div>
            </div>
            <div className="rounded-2xl bg-surface px-3 py-2">
              <div className="text-muted">Roles</div>
              <div className="font-semibold text-ink">{(user?.staff_roles ?? []).join(", ") || "—"}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] bg-white p-5 shadow-(--shadow-card)">
        <div className="mb-3 text-sm font-bold text-ink">{t("dashboard.todayGoal")}</div>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center justify-between rounded-2xl bg-surface px-3 py-3">
            <span className="font-semibold text-ink">{t("checkin.title")}</span>
            <span className="font-bold text-ink">{checkinCount}</span>
          </li>
          <li className="flex items-center justify-between rounded-2xl bg-peach/50 px-3 py-3">
            <span className="font-semibold text-ink">{t("dashboard.overdue")}</span>
            <span className="font-bold text-ink">{overdueCount}</span>
          </li>
        </ul>
      </section>

      <section className="rounded-[28px] bg-white p-5 shadow-(--shadow-card)">
        <div className="mb-2 text-sm font-bold text-ink">{t("dashboard.gymNear")}</div>
        <p className="text-base font-semibold text-ink">{gymName || t("app.name")}</p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
          <div className="rounded-2xl bg-surface px-3 py-3">
            <div className="font-bold text-ink">{branchCount || "—"}</div>
            <div className="text-muted">{t("settings.branches")}</div>
          </div>
          <div className="rounded-2xl bg-mint/50 px-3 py-3">
            <div className="font-bold text-ink">{checkinCount}</div>
            <div className="text-muted">{t("dashboard.checkinsToday")}</div>
          </div>
        </div>
      </section>
    </aside>
  );
}
