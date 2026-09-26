import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/auth";
import { asRecord, money, str } from "@/lib/utils";
import { Field, GhostButton, PageCard, PrimaryButton, SoftTable, TextInput, TextSelect } from "@/components/ui";

export function PlansPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [form, setForm] = useState({
    name: "",
    price_minor: "5000",
    duration_unit: "month" as "day" | "week" | "month" | "year",
    duration_count: "1",
  });
  const [open, setOpen] = useState(false);

  const plans = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const { data } = await api.GET("/v1/plans");
      return (Array.isArray(data) ? data : (data as { items?: unknown[] })?.items ?? []) as unknown[];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await api.POST("/v1/plans", {
        body: {
          name: form.name,
          price_minor: Number(form.price_minor),
          duration_unit: form.duration_unit,
          duration_count: Number(form.duration_count),
          signup_fee_minor: 0,
          freeze_allowed: false,
          max_freeze_days: 0,
          is_active: true,
          sort_order: 0,
        },
      });
      if (error) throw new Error("failed");
    },
    onSuccess: async () => {
      setOpen(false);
      setForm({ name: "", price_minor: "5000", duration_unit: "month", duration_count: "1" });
      await qc.invalidateQueries({ queryKey: ["plans"] });
    },
  });

  return (
    <PageCard
      title={t("plans.title")}
      action={
        <PrimaryButton type="button" onClick={() => setOpen((v) => !v)}>
          {t("plans.add")}
        </PrimaryButton>
      }
    >
      {open ? (
          <form
          className="mb-6 grid gap-3 rounded-[24px] bg-surface p-4 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            create.mutate();
          }}
        >
          <Field label={t("plans.name")}>
            <TextInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label={t("plans.price")}>
            <TextInput
              required
              type="number"
              value={form.price_minor}
              onChange={(e) => setForm({ ...form, price_minor: e.target.value })}
            />
          </Field>
          <Field label={t("plans.period")}>
            <TextSelect
              required
              value={form.duration_unit}
              onChange={(e) =>
                setForm({
                  ...form,
                  duration_unit: e.target.value as "day" | "week" | "month" | "year",
                })
              }
            >
              <option value="day">day</option>
              <option value="week">week</option>
              <option value="month">month</option>
              <option value="year">year</option>
            </TextSelect>
          </Field>
          <Field label={t("plans.durationCount")}>
            <TextInput
              required
              type="number"
              min={1}
              value={form.duration_count}
              onChange={(e) => setForm({ ...form, duration_count: e.target.value })}
            />
          </Field>
          <div className="md:col-span-2 flex gap-2">
            <PrimaryButton type="submit">{t("plans.save")}</PrimaryButton>
            <GhostButton type="button" onClick={() => setOpen(false)}>
              {t("common.cancel")}
            </GhostButton>
          </div>
        </form>
      ) : null}

      {(plans.data ?? []).length === 0 ? (
        <p className="text-sm text-muted">{t("plans.empty")}</p>
      ) : (
        <SoftTable
          headers={[t("plans.name"), t("plans.price"), t("plans.period")]}
          rows={(plans.data ?? []).map((p) => {
            const row = asRecord(p);
            return [
              str(row.name),
              money(Number(row.price_minor ?? 0)),
              `${str(row.duration_count)} ${str(row.duration_unit)}`,
            ];
          })}
        />
      )}
    </PageCard>
  );
}
