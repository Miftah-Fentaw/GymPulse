import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getSession } from "@/lib/auth";
import { asRecord, money, str } from "@/lib/utils";
import { Field, GhostButton, PageCard, PrimaryButton, SoftTable, TextInput, TextSelect } from "@/components/ui";

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

export function BillingPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [invoiceId, setInvoiceId] = useState("");
  const [amount, setAmount] = useState("5000");
  const [method, setMethod] = useState("cash");
  const [rejectReason, setRejectReason] = useState("");

  const invoices = useQuery({
    queryKey: ["invoices"],
    queryFn: () => domainFetch("/v1/invoices"),
  });
  const overdue = useQuery({
    queryKey: ["overdue"],
    queryFn: () => domainFetch("/v1/billing/overdue"),
  });
  const cashUp = useQuery({
    queryKey: ["cash-up"],
    queryFn: () => domainFetch("/v1/billing/cash-up"),
  });
  const pending = useQuery({
    queryKey: ["pending-payments"],
    queryFn: () => domainFetch("/v1/payments?status=pending"),
  });

  const pay = useMutation({
    mutationFn: async () => {
      await domainFetch(`/v1/invoices/${invoiceId}/payments`, {
        method: "POST",
        body: JSON.stringify({ amount_minor: Number(amount), method }),
        headers: { "Idempotency-Key": crypto.randomUUID() },
      });
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["invoices"] });
      await qc.invalidateQueries({ queryKey: ["overdue"] });
      await qc.invalidateQueries({ queryKey: ["cash-up"] });
    },
  });

  const review = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "approved" | "rejected" }) => {
      await domainFetch(`/v1/payments/${id}/review`, {
        method: "POST",
        body: JSON.stringify({ status, reason: status === "rejected" ? rejectReason || "Rejected" : "" }),
      });
    },
    onSuccess: async () => {
      setRejectReason("");
      await qc.invalidateQueries({ queryKey: ["pending-payments"] });
      await qc.invalidateQueries({ queryKey: ["invoices"] });
      await qc.invalidateQueries({ queryKey: ["cash-up"] });
      await qc.invalidateQueries({ queryKey: ["overdue"] });
    },
  });

  const invoiceItems = (invoices.data?.items ?? invoices.data ?? []) as unknown[];
  const overdueItems = (overdue.data?.items ?? overdue.data ?? []) as unknown[];
  const pendingItems = (pending.data?.items ?? []) as unknown[];
  const cash = asRecord(cashUp.data);

  return (
    <div className="space-y-4">
      <PageCard title={t("billing.pendingReview")}>
        {pendingItems.length === 0 ? (
          <p className="text-sm text-muted">{t("billing.noPending")}</p>
        ) : (
          <div className="space-y-3">
            {pendingItems.map((item) => {
              const row = asRecord(item);
              const id = str(row.id, "");
              const evidence = str(row.evidence_file_id, "");
              return (
                <div key={id} className="rounded-2xl bg-peach/40 px-4 py-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-ink">
                        {str(row.member_name)} · {str(row.provider || row.method)}
                      </div>
                      <div className="mt-1 text-sm text-muted">
                        {money(Number(row.amount_minor ?? 0))} · {str(row.reference)}
                      </div>
                      {evidence ? (
                        <a
                          className="mt-1 inline-block text-sm font-semibold text-teal"
                          href={`/v1/files/${evidence}/content`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {t("billing.viewEvidence")}
                        </a>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <PrimaryButton
                        type="button"
                        disabled={review.isPending}
                        onClick={() => review.mutate({ id, status: "approved" })}
                      >
                        {t("billing.approve")}
                      </PrimaryButton>
                      <GhostButton
                        type="button"
                        disabled={review.isPending}
                        onClick={() => review.mutate({ id, status: "rejected" })}
                      >
                        {t("billing.reject")}
                      </GhostButton>
                    </div>
                  </div>
                </div>
              );
            })}
            <Field label={t("billing.rejectReason")}>
              <TextInput value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
            </Field>
          </div>
        )}
      </PageCard>

      <div className="grid gap-4 md:grid-cols-2">
        <PageCard title={t("billing.overdue")}>
          {overdueItems.length === 0 ? (
            <p className="text-sm text-muted">{t("common.none")}</p>
          ) : (
            <ul className="space-y-2">
              {overdueItems.slice(0, 8).map((item, i) => {
                const row = asRecord(item);
                return (
                  <li key={i} className="flex justify-between rounded-2xl bg-peach/50 px-4 py-3 text-sm">
                    <button type="button" className="font-semibold" onClick={() => setInvoiceId(str(row.id, ""))}>
                      {str(row.invoice_number ?? row.member_name ?? row.id).slice(0, 24)}
                    </button>
                    <span>{money(Number(row.balance_minor ?? row.total_minor ?? 0))}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </PageCard>
        <PageCard title={t("billing.cashUp")}>
          <div className="grid grid-cols-3 gap-3">
            {["cash", "bank", "mobile_money"].map((m) => (
              <div key={m} className="rounded-2xl bg-mint/50 p-4 text-center">
                <div className="text-xs font-semibold text-muted uppercase">{m}</div>
                <div className="mt-2 text-lg font-bold">{money(Number(cash[m] ?? cash[`${m}_minor`] ?? 0))}</div>
              </div>
            ))}
          </div>
        </PageCard>
      </div>

      <PageCard title={t("billing.pay")}>
        <form
          className="grid gap-3 md:grid-cols-4"
          onSubmit={(e) => {
            e.preventDefault();
            pay.mutate();
          }}
        >
          <Field label={t("billing.invoiceId")}>
            <TextInput required value={invoiceId} onChange={(e) => setInvoiceId(e.target.value)} />
          </Field>
          <Field label={t("billing.amount")}>
            <TextInput required type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </Field>
          <Field label={t("billing.method")}>
            <TextSelect value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="cash">cash</option>
              <option value="bank">bank</option>
              <option value="mobile_money">mobile_money</option>
            </TextSelect>
          </Field>
          <div className="flex items-end">
            <PrimaryButton type="submit" disabled={pay.isPending}>
              {t("billing.pay")}
            </PrimaryButton>
          </div>
        </form>
        {pay.isError ? <p className="mt-2 text-sm text-red-600">{String(pay.error)}</p> : null}
      </PageCard>

      <PageCard title={t("billing.invoices")}>
        {invoiceItems.length === 0 ? (
          <p className="text-sm text-muted">{t("billing.empty")}</p>
        ) : (
          <SoftTable
            headers={["Invoice", "Member", "Status", "Total"]}
            rows={invoiceItems.slice(0, 30).map((item) => {
              const row = asRecord(item);
              return [
                <button
                  key="id"
                  type="button"
                  className="font-semibold text-teal"
                  onClick={() => setInvoiceId(str(row.id, ""))}
                >
                  {str(row.invoice_number, str(row.id).slice(0, 8))}
                </button>,
                str(row.member_name ?? row.member_id),
                str(row.status),
                money(Number(row.total_minor ?? 0)),
              ];
            })}
          />
        )}
      </PageCard>
    </div>
  );
}
