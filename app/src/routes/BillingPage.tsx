import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, Input } from "@/components/ui";
import { getSession } from "@/lib/auth";

async function domainFetch(path: string, init?: RequestInit) {
  const token = getSession().accessToken;
  const res = await fetch(path, {
    ...init,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(json?.error?.message || res.statusText);
  return json;
}

function money(minor: number) {
  return `$${(minor / 100).toFixed(2)}`;
}

export function BillingPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [invoiceId, setInvoiceId] = useState("");
  const [amount, setAmount] = useState("");
  const [provider, setProvider] = useState("telebirr");
  const [reference, setReference] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const invoices = useQuery({
    queryKey: ["my-invoices"],
    queryFn: () => domainFetch("/v1/me/invoices"),
  });
  const payments = useQuery({
    queryKey: ["my-payments"],
    queryFn: () => domainFetch("/v1/me/payments"),
  });

  const invoiceItems = (invoices.data?.items ?? []) as Array<Record<string, unknown>>;
  const paymentItems = (payments.data?.items ?? []) as Array<Record<string, unknown>>;
  const memberId = String(invoices.data?.member_id ?? payments.data?.member_id ?? "");

  const submit = useMutation({
    mutationFn: async () => {
      if (!file || !invoiceId) throw new Error("missing");
      const token = getSession().accessToken;
      const form = new FormData();
      form.append("file", file);
      const up = await fetch("/v1/files", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });
      const upJson = await up.json();
      if (!up.ok) throw new Error(upJson?.error?.message || "upload failed");
      const evidenceId = upJson.id as string;
      const amt = Number(amount) || Number(invoiceItems.find((i) => String(i.id) === invoiceId)?.total_minor ?? 0);
      await domainFetch(`/v1/invoices/${invoiceId}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": crypto.randomUUID(),
        },
        body: JSON.stringify({
          amount_minor: amt,
          method: "mobile_money",
          provider,
          reference,
          evidence_file_id: evidenceId,
          member_id: memberId || undefined,
        }),
      });
    },
    onSuccess: async () => {
      setFile(null);
      setReference("");
      await qc.invalidateQueries({ queryKey: ["my-payments"] });
      await qc.invalidateQueries({ queryKey: ["my-invoices"] });
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink">{t("billing.title")}</h1>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-bold">{t("billing.invoices")}</h2>
        {invoiceItems.length === 0 ? (
          <p className="text-sm text-muted">{t("billing.emptyInvoices")}</p>
        ) : (
          invoiceItems.map((inv) => (
            <button
              key={String(inv.id)}
              type="button"
              onClick={() => {
                setInvoiceId(String(inv.id));
                setAmount(String(Number(inv.total_minor ?? 0) - Number(inv.paid_minor ?? 0)));
              }}
              className="block w-full text-left"
            >
              <Card className="flex items-center justify-between p-4">
                <div>
                  <p className="font-semibold">{String(inv.invoice_number ?? inv.id)}</p>
                  <p className="text-xs text-muted">{String(inv.status)}</p>
                </div>
                <p className="font-bold text-brand">{money(Number(inv.total_minor ?? 0))}</p>
              </Card>
            </button>
          ))
        )}
      </section>

      <Card className="space-y-3 p-4">
        <h2 className="font-display text-lg font-bold">{t("billing.payTitle")}</h2>
        <p className="text-sm text-muted">{t("billing.payHint")}</p>
        <label className="block text-xs font-semibold text-muted">{t("billing.provider")}</label>
        <select
          className="w-full rounded-2xl border border-line bg-surface px-3 py-3 text-sm"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
        >
          <option value="telebirr">Telebirr</option>
          <option value="cbe">CBE</option>
          <option value="other">{t("billing.other")}</option>
        </select>
        <Input
          type="number"
          placeholder={t("billing.amount")}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Input
          placeholder={t("billing.reference")}
          value={reference}
          onChange={(e) => setReference(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm"
        />
        <Button
          className="w-full"
          type="button"
          disabled={submit.isPending || !invoiceId || !file}
          onClick={() => submit.mutate()}
        >
          {t("billing.submit")}
        </Button>
        {submit.isError ? <p className="text-sm text-brand">{String(submit.error)}</p> : null}
        {submit.isSuccess ? <p className="text-sm text-brand">{t("billing.submitted")}</p> : null}
      </Card>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-bold">{t("billing.payments")}</h2>
        {paymentItems.length === 0 ? (
          <p className="text-sm text-muted">{t("billing.emptyPayments")}</p>
        ) : (
          paymentItems.map((p) => (
            <Card key={String(p.id)} className="flex items-center justify-between p-4">
              <div>
                <p className="font-semibold">
                  {String(p.provider || p.method)} · {String(p.status)}
                </p>
                <p className="text-xs text-muted">{String(p.reference || "")}</p>
              </div>
              <p className="font-bold">{money(Number(p.amount_minor ?? 0))}</p>
            </Card>
          ))
        )}
      </section>
    </div>
  );
}
