import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Users, ScanLine, UserPlus, Receipt } from "lucide-react";
import { api, getSession } from "@/lib/auth";
import { asRecord, money, str } from "@/lib/utils";
import { PageCard, StatTile } from "@/components/ui";

async function domainGet(path: string) {
  const token = getSession().accessToken;
  const res = await fetch(path, {
    credentials: "include",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) return { items: [] as unknown[] };
  return (await res.json()) as { items?: unknown[] };
}

export function DashboardPage() {
  const { t } = useTranslation();

  const members = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const { data } = await api.GET("/v1/members", { params: { query: { limit: 100 } } });
      return (data?.items ?? []) as unknown[];
    },
  });
  const leads = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data } = await api.GET("/v1/leads", { params: { query: { limit: 50 } } });
      return (data?.items ?? []) as unknown[];
    },
  });
  const checkins = useQuery({
    queryKey: ["checkins-today"],
    queryFn: () => domainGet("/v1/checkins"),
  });
  const overdue = useQuery({
    queryKey: ["overdue"],
    queryFn: () => domainGet("/v1/billing/overdue"),
  });
  const sessions = useQuery({
    queryKey: ["sessions"],
    queryFn: () => domainGet("/v1/sessions"),
  });

  const checkinItems = checkins.data?.items ?? [];
  const overdueItems = overdue.data?.items ?? [];
  const sessionItems = sessions.data?.items ?? [];

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <Link to="/members" className="block transition hover:opacity-95">
          <StatTile
            title={t("dashboard.activeMembers")}
            value={members.data?.length ?? "—"}
            tone="lavender"
            icon={<Users className="size-5" />}
          />
        </Link>
        <Link to="/checkin" className="block transition hover:opacity-95">
          <StatTile
            title={t("dashboard.checkinsToday")}
            value={checkinItems.length || "—"}
            tone="peach"
            icon={<ScanLine className="size-5" />}
          />
        </Link>
        <Link to="/leads" className="block transition hover:opacity-95">
          <StatTile
            title={t("dashboard.openLeads")}
            value={leads.data?.length ?? "—"}
            tone="mint"
            icon={<UserPlus className="size-5" />}
          />
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <PageCard title={t("dashboard.recommended")}>
          <QuickLink to="/members" label={t("members.add")} icon={<Users className="size-4" />} />
          <QuickLink to="/checkin" label={t("checkin.submit")} icon={<ScanLine className="size-4" />} />
          <QuickLink to="/billing" label={t("billing.pay")} icon={<Receipt className="size-4" />} />
          <QuickLink to="/leads" label={t("leads.convert")} icon={<UserPlus className="size-4" />} />
        </PageCard>

        <PageCard title={t("dashboard.appointments")}>
          {sessionItems.slice(0, 6).map((s, i) => {
            const row = asRecord(s);
            return (
              <div key={i} className="mb-3 flex items-center gap-3 rounded-2xl bg-surface px-3 py-3 last:mb-0">
                <div className="grid size-10 place-items-center rounded-2xl bg-lavender text-sm font-bold">
                  {String(str(row.name)).slice(0, 1)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{str(row.name)}</div>
                  <div className="text-xs text-muted">{str(row.starts_at)}</div>
                </div>
              </div>
            );
          })}
          {sessionItems.length === 0 ? <p className="text-sm text-muted">{t("classes.empty")}</p> : null}
          {sessionItems.length > 0 ? (
            <Link to="/classes" className="mt-3 inline-block text-sm font-semibold text-teal">
              {t("nav.classes")}
            </Link>
          ) : null}
        </PageCard>
      </div>

      {overdueItems.length > 0 ? (
        <PageCard
          title={t("dashboard.overdue")}
          action={
            <Link to="/billing" className="text-sm font-semibold text-teal">
              {t("nav.billing")}
            </Link>
          }
        >
          <div className="space-y-2">
            {overdueItems.slice(0, 5).map((item, i) => {
              const row = asRecord(item);
              return (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-2xl bg-peach/50 px-4 py-3 text-sm"
                >
                  <span className="font-semibold">{str(row.id)}</span>
                  <span>{money(Number(row.total_minor ?? row.remaining_minor ?? 0))}</span>
                </div>
              );
            })}
          </div>
        </PageCard>
      ) : null}
    </div>
  );
}

function QuickLink({ to, label, icon }: { to: string; label: string; icon: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="mb-2 flex items-center gap-3 rounded-2xl bg-surface px-3 py-3 text-sm font-semibold text-ink transition hover:bg-lavender/60 last:mb-0"
    >
      <span className="grid size-9 place-items-center rounded-xl bg-white">{icon}</span>
      {label}
    </Link>
  );
}
