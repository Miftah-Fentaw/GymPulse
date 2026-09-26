import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api, getSession } from "@/lib/auth";
import { asRecord, str } from "@/lib/utils";
import { Field, PageCard, PrimaryButton, SoftTable, TextInput, TextSelect } from "@/components/ui";

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

export function CheckinPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [memberId, setMemberId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [token, setToken] = useState("");

  const branches = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      const { data } = await api.GET("/v1/branches");
      return (Array.isArray(data) ? data : (data as { items?: unknown[] })?.items ?? []) as unknown[];
    },
  });
  const members = useQuery({
    queryKey: ["members-lite"],
    queryFn: async () => {
      const { data } = await api.GET("/v1/members", { params: { query: { limit: 100 } } });
      return (data?.items ?? []) as unknown[];
    },
  });
  const today = useQuery({
    queryKey: ["checkins"],
    queryFn: () => domainFetch("/v1/checkins"),
  });
  const present = useQuery({
    queryKey: ["present"],
    queryFn: () => domainFetch("/v1/checkins/present"),
  });

  const checkinStaff = useMutation({
    mutationFn: async () => {
      await domainFetch("/v1/checkins/staff", {
        method: "POST",
        body: JSON.stringify({ member_id: memberId, branch_id: branchId }),
        headers: { "Idempotency-Key": crypto.randomUUID() },
      });
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["checkins"] });
      await qc.invalidateQueries({ queryKey: ["present"] });
    },
  });

  const checkinQr = useMutation({
    mutationFn: async () => {
      await domainFetch("/v1/checkins", {
        method: "POST",
        body: JSON.stringify({ token: token.trim(), branch_id: branchId }),
        headers: { "Idempotency-Key": crypto.randomUUID() },
      });
    },
    onSuccess: async () => {
      setToken("");
      await qc.invalidateQueries({ queryKey: ["checkins"] });
      await qc.invalidateQueries({ queryKey: ["present"] });
    },
  });

  const branchOpts = (branches.data ?? []).map((b) => {
    const row = asRecord(b);
    return { id: str(row.id, ""), name: str(row.name) };
  });
  const memberOpts = (members.data ?? []).map((m) => {
    const row = asRecord(m);
    return { id: str(row.id, ""), name: `${str(row.name)} (${str(row.email)})` };
  });

  const items = (today.data?.items ?? today.data ?? []) as unknown[];
  const presentItems = (present.data?.items ?? present.data ?? []) as unknown[];

  return (
    <div className="space-y-4">
      <PageCard title={t("checkin.qrTitle")}>
        <form
          className="mb-2 grid gap-3 md:grid-cols-[1fr_1fr_auto]"
          onSubmit={(e) => {
            e.preventDefault();
            checkinQr.mutate();
          }}
        >
          <Field label={t("checkin.token")}>
            <TextInput
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder={t("checkin.tokenHint")}
            />
          </Field>
          <Field label={t("members.branch")}>
            <TextSelect required value={branchId} onChange={(e) => setBranchId(e.target.value)}>
              <option value="">Select</option>
              {branchOpts.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </TextSelect>
          </Field>
          <div className="flex items-end">
            <PrimaryButton type="submit" disabled={checkinQr.isPending}>
              {t("checkin.scanSubmit")}
            </PrimaryButton>
          </div>
        </form>
        {checkinQr.isError ? <p className="text-sm text-red-600">{String(checkinQr.error)}</p> : null}
        {checkinQr.isSuccess ? <p className="text-sm text-teal">{t("checkin.success")}</p> : null}
      </PageCard>

      <PageCard title={t("checkin.title")}>
        <form
          className="mb-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]"
          onSubmit={(e) => {
            e.preventDefault();
            checkinStaff.mutate();
          }}
        >
          <Field label={t("members.title")}>
            <TextSelect required value={memberId} onChange={(e) => setMemberId(e.target.value)}>
              <option value="">Select</option>
              {memberOpts.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </TextSelect>
          </Field>
          <Field label={t("members.branch")}>
            <TextSelect required value={branchId} onChange={(e) => setBranchId(e.target.value)}>
              <option value="">Select</option>
              {branchOpts.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </TextSelect>
          </Field>
          <div className="flex items-end">
            <PrimaryButton type="submit" disabled={checkinStaff.isPending}>
              {t("checkin.submit")}
            </PrimaryButton>
          </div>
        </form>
        {checkinStaff.isError ? <p className="mb-3 text-sm text-red-600">{String(checkinStaff.error)}</p> : null}
      </PageCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <PageCard title={t("checkin.today")}>
          {items.length === 0 ? (
            <p className="text-sm text-muted">{t("checkin.empty")}</p>
          ) : (
            <SoftTable
              headers={[t("members.title"), t("members.branch"), t("checkin.when")]}
              rows={items.slice(0, 20).map((c) => {
                const row = asRecord(c);
                return [
                  str(row.member_name ?? row.member_id),
                  str(row.branch_name ?? row.branch_id),
                  str(row.checked_in_at ?? row.occurred_at ?? row.created_at),
                ];
              })}
            />
          )}
        </PageCard>
        <PageCard title={t("checkin.present")}>
          {presentItems.length === 0 ? (
            <p className="text-sm text-muted">{t("common.none")}</p>
          ) : (
            <ul className="space-y-2">
              {presentItems.map((p, i) => {
                const row = asRecord(p);
                return (
                  <li key={i} className="rounded-2xl bg-mint/60 px-4 py-3 text-sm font-semibold">
                    {str(row.member_name ?? row.name ?? row.member_id)}
                  </li>
                );
              })}
            </ul>
          )}
        </PageCard>
      </div>
    </div>
  );
}
