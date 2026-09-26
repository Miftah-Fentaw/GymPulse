import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getSession } from "@/lib/auth";
import { asRecord, str } from "@/lib/utils";
import { PageCard, SoftTable } from "@/components/ui";

async function domainGet(path: string) {
  const token = getSession().accessToken;
  const res = await fetch(path, {
    credentials: "include",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) return { items: [] as unknown[] };
  return (await res.json()) as { items?: unknown[] };
}

export function ClassesPage() {
  const { t } = useTranslation();
  const sessions = useQuery({
    queryKey: ["sessions"],
    queryFn: () => domainGet("/v1/sessions"),
  });
  const items = sessions.data?.items ?? [];

  return (
    <PageCard title={t("classes.title")}>
      {items.length === 0 ? (
        <p className="text-sm text-muted">{t("classes.empty")}</p>
      ) : (
        <SoftTable
          headers={[t("plans.name"), "Starts", "Capacity", "Branch"]}
          rows={items.map((s) => {
            const row = asRecord(s);
            return [str(row.name), str(row.starts_at), str(row.capacity), str(row.branch_id)];
          })}
        />
      )}
    </PageCard>
  );
}

export function TrainersPage() {
  const { t } = useTranslation();
  const trainers = useQuery({
    queryKey: ["trainers"],
    queryFn: () => domainGet("/v1/trainers"),
  });
  const items = trainers.data?.items ?? [];

  return (
    <PageCard title={t("trainers.title")}>
      {items.length === 0 ? (
        <p className="text-sm text-muted">{t("trainers.empty")}</p>
      ) : (
        <SoftTable
          headers={[t("members.name"), "Bio", t("trainers.clients")]}
          rows={items.map((tr) => {
            const row = asRecord(tr);
            return [str(row.name ?? row.id), str(row.bio, "—"), str(row.client_count ?? "—")];
          })}
        />
      )}
    </PageCard>
  );
}

export function ReportsPage() {
  const { t } = useTranslation();
  const roles = getSession().user?.staff_roles ?? [];
  const allowed = roles.includes("owner") || roles.includes("manager");

  const active = useQuery({
    queryKey: ["report-active"],
    enabled: allowed,
    queryFn: () => domainGet("/v1/reports/active-members"),
  });
  const revenue = useQuery({
    queryKey: ["report-revenue"],
    enabled: allowed,
    queryFn: () => domainGet("/v1/reports/revenue"),
  });
  const churn = useQuery({
    queryKey: ["report-churn"],
    enabled: allowed,
    queryFn: () => domainGet("/v1/reports/churn"),
  });
  const attendance = useQuery({
    queryKey: ["report-attendance"],
    enabled: allowed,
    queryFn: () => domainGet("/v1/reports/attendance"),
  });

  if (!allowed) {
    return (
      <PageCard title={t("reports.title")}>
        <p className="text-sm text-muted">{t("reports.forbidden")}</p>
      </PageCard>
    );
  }

  const cards = [
    { title: t("reports.active"), value: str(asRecord(active.data).count ?? asRecord(active.data).total, "—") },
    { title: t("reports.revenue"), value: str(asRecord(revenue.data).total_minor ?? asRecord(revenue.data).paid_minor, "—") },
    { title: t("reports.churn"), value: str(asRecord(churn.data).count ?? asRecord(churn.data).total, "—") },
    { title: t("reports.attendance"), value: str(asRecord(attendance.data).count ?? asRecord(attendance.data).total, "—") },
  ];

  return (
    <div className="space-y-4">
      <PageCard title={t("reports.title")}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((c) => (
            <div key={c.title} className="rounded-[24px] bg-lavender/60 p-5">
              <div className="text-xs font-semibold tracking-wide text-muted uppercase">{c.title}</div>
              <div className="mt-3 text-3xl font-bold text-ink">{c.value}</div>
            </div>
          ))}
        </div>
      </PageCard>
    </div>
  );
}
