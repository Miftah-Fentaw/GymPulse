import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/auth";
import { asRecord, str } from "@/lib/utils";
import { Field, GhostButton, PageCard, PrimaryButton, SoftTable, TextSelect } from "@/components/ui";

export function LeadsPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [convertId, setConvertId] = useState<string | null>(null);
  const [branchId, setBranchId] = useState("");

  const leads = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data } = await api.GET("/v1/leads", { params: { query: { limit: 100 } } });
      return (data?.items ?? []) as unknown[];
    },
  });
  const branches = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      const { data } = await api.GET("/v1/branches");
      return (Array.isArray(data) ? data : (data as { items?: unknown[] })?.items ?? []) as unknown[];
    },
  });

  const convert = useMutation({
    mutationFn: async () => {
      if (!convertId) return;
      const { error } = await api.POST("/v1/leads/{leadId}/convert", {
        params: { path: { leadId: convertId } },
        body: { home_branch_id: branchId },
      });
      if (error) throw new Error("convert failed");
    },
    onSuccess: async () => {
      setConvertId(null);
      await qc.invalidateQueries({ queryKey: ["leads"] });
      await qc.invalidateQueries({ queryKey: ["members"] });
    },
  });

  const branchOpts = (branches.data ?? []).map((b) => {
    const row = asRecord(b);
    return { id: str(row.id, ""), name: str(row.name) };
  });

  return (
    <PageCard title={t("leads.title")}>
      {(leads.data ?? []).length === 0 ? (
        <p className="text-sm text-muted">{t("leads.empty")}</p>
      ) : (
        <SoftTable
          headers={[t("members.name"), t("leads.contact"), t("leads.status"), t("common.actions")]}
          rows={(leads.data ?? []).map((lead) => {
            const row = asRecord(lead);
            const id = str(row.id, "");
            return [
              str(row.name),
              str(row.contact),
              str(row.status, "open"),
              <GhostButton key="c" type="button" onClick={() => setConvertId(id)}>
                {t("leads.convert")}
              </GhostButton>,
            ];
          })}
        />
      )}

      {convertId ? (
        <form
          className="mt-6 flex flex-wrap items-end gap-3 rounded-[24px] bg-lavender/50 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            convert.mutate();
          }}
        >
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
          <PrimaryButton type="submit">{t("leads.convert")}</PrimaryButton>
          <GhostButton type="button" onClick={() => setConvertId(null)}>
            {t("common.cancel")}
          </GhostButton>
        </form>
      ) : null}
    </PageCard>
  );
}
