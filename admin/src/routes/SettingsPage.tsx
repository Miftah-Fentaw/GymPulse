import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/auth";
import { asRecord, str } from "@/lib/utils";
import { Field, PageCard, PrimaryButton, SoftTable, TextInput } from "@/components/ui";

export function SettingsPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [form, setForm] = useState({
    name: "",
    timezone: "",
    currency: "",
    phone: "",
    email: "",
    address: "",
  });

  const gym = useQuery({
    queryKey: ["gym"],
    queryFn: async () => {
      const { data } = await api.GET("/v1/gym");
      return data as Record<string, unknown>;
    },
  });
  const branches = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      const { data } = await api.GET("/v1/branches");
      return (Array.isArray(data) ? data : (data as { items?: unknown[] })?.items ?? []) as unknown[];
    },
  });

  useEffect(() => {
    if (!gym.data) return;
    setForm({
      name: str(gym.data.name, ""),
      timezone: str(gym.data.timezone, ""),
      currency: str(gym.data.currency, ""),
      phone: str(gym.data.phone, ""),
      email: str(gym.data.email, ""),
      address: str(gym.data.address, ""),
    });
  }, [gym.data]);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await api.PATCH("/v1/gym", {
        body: {
          name: form.name || undefined,
          timezone: form.timezone || undefined,
          currency: form.currency || undefined,
          phone: form.phone || undefined,
          email: form.email || undefined,
          address: form.address || undefined,
        },
      });
      if (error) throw new Error("save failed");
    },
    onSuccess: async () => qc.invalidateQueries({ queryKey: ["gym"] }),
  });

  return (
    <div className="space-y-4">
      <PageCard title={t("settings.gym")}>
        <form
          className="grid gap-3 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
        >
          <Field label={t("settings.name")}>
            <TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label={t("settings.timezone")}>
            <TextInput value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} />
          </Field>
          <Field label={t("settings.currency")}>
            <TextInput value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
          </Field>
          <Field label={t("settings.phone")}>
            <TextInput value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Field>
          <Field label={t("settings.email")}>
            <TextInput value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label={t("settings.address")}>
            <TextInput value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </Field>
          <div className="md:col-span-2">
            <PrimaryButton type="submit" disabled={save.isPending}>
              {t("settings.save")}
            </PrimaryButton>
          </div>
        </form>
      </PageCard>

      <PageCard title={t("settings.branches")}>
        <SoftTable
          headers={[t("settings.name"), t("settings.address"), t("settings.phone")]}
          rows={(branches.data ?? []).map((b) => {
            const row = asRecord(b);
            return [str(row.name), str(row.address), str(row.phone)];
          })}
        />
      </PageCard>
    </div>
  );
}
