import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearch } from "@tanstack/react-router";
import { api } from "@/lib/auth";
import { asRecord, str } from "@/lib/utils";
import { Field, GhostButton, PageCard, PrimaryButton, SoftTable, TextInput, TextSelect } from "@/components/ui";

export function MembersPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const search = useSearch({ strict: false }) as { q?: string };
  const [q, setQ] = useState(search.q ?? "");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", home_branch_id: "" });

  useEffect(() => {
    setQ(search.q ?? "");
  }, [search.q]);

  const branches = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      const { data } = await api.GET("/v1/branches");
      return (Array.isArray(data) ? data : (data as { items?: unknown[] })?.items ?? []) as unknown[];
    },
  });

  const members = useQuery({
    queryKey: ["members", q],
    queryFn: async () => {
      const { data } = await api.GET("/v1/members", {
        params: { query: { limit: 50, q: q || undefined } },
      });
      return (data?.items ?? []) as unknown[];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error, response } = await api.POST("/v1/members", {
        body: {
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          home_branch_id: form.home_branch_id,
        },
      });
      if (error) throw new Error(String(response.status));
    },
    onSuccess: async () => {
      setShowForm(false);
      setForm({ name: "", email: "", phone: "", home_branch_id: "" });
      await qc.invalidateQueries({ queryKey: ["members"] });
    },
  });

  const archive = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await api.POST("/v1/members/{memberId}/archive", {
        params: { path: { memberId: id } },
      });
      if (error) throw new Error("archive failed");
    },
    onSuccess: async () => qc.invalidateQueries({ queryKey: ["members"] }),
  });

  const branchOptions = (branches.data ?? []).map((b) => {
    const row = asRecord(b);
    return { id: str(row.id, ""), name: str(row.name) };
  });

  return (
    <div className="space-y-4">
      <PageCard
        title={t("members.title")}
        action={
          <PrimaryButton type="button" onClick={() => setShowForm((v) => !v)}>
            {t("members.add")}
          </PrimaryButton>
        }
      >
        <TextInput
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("members.search")}
          className="mb-4 max-w-md"
        />

        {showForm ? (
          <form
            className="mb-6 grid gap-3 rounded-[24px] bg-surface p-4 md:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              create.mutate();
            }}
          >
            <Field label={t("members.name")}>
              <TextInput
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Field>
            <Field label={t("members.email")}>
              <TextInput
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Field>
            <Field label={t("members.phone")}>
              <TextInput value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </Field>
            <Field label={t("members.branch")}>
              <TextSelect
                required
                value={form.home_branch_id}
                onChange={(e) => setForm({ ...form, home_branch_id: e.target.value })}
              >
                <option value="">Select</option>
                {branchOptions.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </TextSelect>
            </Field>
            <div className="md:col-span-2 flex gap-2">
              <PrimaryButton type="submit" disabled={create.isPending}>
                {t("members.save")}
              </PrimaryButton>
              <GhostButton type="button" onClick={() => setShowForm(false)}>
                {t("common.cancel")}
              </GhostButton>
            </div>
          </form>
        ) : null}

        {(members.data ?? []).length === 0 ? (
          <p className="text-sm text-muted">{t("members.empty")}</p>
        ) : (
          <SoftTable
            headers={[t("members.name"), t("members.email"), t("members.status"), t("common.actions")]}
            rows={(members.data ?? []).map((m) => {
              const row = asRecord(m);
              const id = str(row.id, "");
              return [
                str(row.name),
                str(row.email),
                <span key="s" className="rounded-full bg-mint px-2.5 py-1 text-xs font-semibold">
                  {str(row.status, "active")}
                </span>,
                <GhostButton key="a" type="button" onClick={() => archive.mutate(id)}>
                  {t("members.archive")}
                </GhostButton>,
              ];
            })}
          />
        )}
      </PageCard>
    </div>
  );
}
