import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getSession } from "@/lib/auth";
import { asRecord, str } from "@/lib/utils";
import { Field, PageCard, PrimaryButton, SoftTable, TextSelect } from "@/components/ui";

async function domainFetch(path: string, init?: RequestInit) {
  const token = getSession().accessToken;
  const res = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(json?.error?.message || res.statusText);
  return json;
}

export function ClassesPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [memberId, setMemberId] = useState("");
  const [sessionId, setSessionId] = useState("");

  const sessions = useQuery({
    queryKey: ["sessions"],
    queryFn: () => domainFetch("/v1/sessions"),
  });
  const members = useQuery({
    queryKey: ["members-lite"],
    queryFn: async () => {
      const token = getSession().accessToken;
      const res = await fetch("/v1/members?limit=100", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return res.json();
    },
  });

  const book = useMutation({
    mutationFn: async () => {
      await domainFetch(`/v1/bookings/${sessionId}`, {
        method: "POST",
        body: JSON.stringify({ member_id: memberId }),
      });
    },
    onSuccess: async () => {
      setMemberId("");
      setSessionId("");
      await qc.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  const items = (sessions.data?.items ?? []) as unknown[];
  const memberItems = (members.data?.items ?? []) as unknown[];

  return (
    <div className="space-y-4">
      <PageCard title={t("classes.title")}>
        {items.length === 0 ? (
          <p className="text-sm text-muted">{t("classes.empty")}</p>
        ) : (
          <SoftTable
            headers={[t("plans.name"), "Starts", "Trainer", "Booked / Cap"]}
            rows={items.map((s) => {
              const row = asRecord(s);
              return [
                str(row.name),
                str(row.starts_at),
                str(row.trainer_name, "—"),
                `${str(row.booked, "0")} / ${str(row.capacity)}`,
              ];
            })}
          />
        )}
      </PageCard>

      <PageCard title="Book member into class">
        <form
          className="grid gap-3 md:grid-cols-3"
          onSubmit={(e) => {
            e.preventDefault();
            book.mutate();
          }}
        >
          <Field label="Session">
            <TextSelect required value={sessionId} onChange={(e) => setSessionId(e.target.value)}>
              <option value="">Select</option>
              {items.map((s) => {
                const row = asRecord(s);
                return (
                  <option key={str(row.id)} value={str(row.id, "")}>
                    {str(row.name)} · {str(row.starts_at)}
                  </option>
                );
              })}
            </TextSelect>
          </Field>
          <Field label="Member">
            <TextSelect required value={memberId} onChange={(e) => setMemberId(e.target.value)}>
              <option value="">Select</option>
              {memberItems.map((m) => {
                const row = asRecord(m);
                return (
                  <option key={str(row.id)} value={str(row.id, "")}>
                    {str(row.name)} ({str(row.member_code)})
                  </option>
                );
              })}
            </TextSelect>
          </Field>
          <div className="flex items-end gap-2">
            <PrimaryButton type="submit" disabled={book.isPending}>
              Book
            </PrimaryButton>
            {book.isError ? <span className="text-sm text-red-600">Failed</span> : null}
            {book.isSuccess ? <span className="text-sm text-teal">Booked</span> : null}
          </div>
        </form>
      </PageCard>
    </div>
  );
}

export function TrainersPage() {
  const { t } = useTranslation();
  const trainers = useQuery({
    queryKey: ["trainers"],
    queryFn: () => domainFetch("/v1/trainers"),
  });
  const items = (trainers.data?.items ?? []) as unknown[];

  return (
    <PageCard title={t("trainers.title")}>
      {items.length === 0 ? (
        <p className="text-sm text-muted">{t("trainers.empty")}</p>
      ) : (
        <SoftTable
          headers={[t("members.name"), t("members.email"), t("trainers.clients")]}
          rows={items.map((tr) => {
            const row = asRecord(tr);
            return [str(row.name ?? row.email), str(row.email), str(row.client_count ?? "0")];
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
    queryFn: () => domainFetch("/v1/reports/active-members"),
  });
  const revenue = useQuery({
    queryKey: ["report-revenue"],
    enabled: allowed,
    queryFn: () => domainFetch("/v1/reports/revenue"),
  });
  const churn = useQuery({
    queryKey: ["report-churn"],
    enabled: allowed,
    queryFn: () => domainFetch("/v1/reports/churn"),
  });
  const attendance = useQuery({
    queryKey: ["report-attendance"],
    enabled: allowed,
    queryFn: () => domainFetch("/v1/reports/attendance"),
  });

  if (!allowed) {
    return (
      <PageCard title={t("reports.title")}>
        <p className="text-sm text-muted">{t("reports.forbidden")}</p>
      </PageCard>
    );
  }

  const cards = [
    {
      title: t("reports.active"),
      value: str(asRecord(active.data).active_members ?? asRecord(active.data).count, "—"),
    },
    {
      title: t("reports.revenue"),
      value: str(asRecord(revenue.data).revenue_minor ?? asRecord(revenue.data).total_minor, "—"),
    },
    {
      title: t("reports.churn"),
      value: str(asRecord(churn.data).churn ?? asRecord(churn.data).count, "—"),
    },
    {
      title: t("reports.attendance"),
      value: str(asRecord(attendance.data).attendance ?? asRecord(attendance.data).count, "—"),
    },
  ];

  return (
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
  );
}
