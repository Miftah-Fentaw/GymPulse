import { useMemo, useState, useSyncExternalStore } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { api, getSession, isOwner, subscribeSession } from "@/lib/auth";
import { asRecord, cn, str } from "@/lib/utils";
import { Field, GhostButton, PageCard, PrimaryButton, SoftTable, TextInput } from "@/components/ui";

const TABS = ["owner", "manager", "receptionist", "trainer", "member"] as const;
type UserTab = (typeof TABS)[number];

type StaffRow = {
  id: string;
  email: string;
  name: string;
  staff_roles: string[];
  has_member_profile: boolean;
};

export function UsersPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const session = useSyncExternalStore(subscribeSession, getSession, getSession);
  const [tab, setTab] = useState<UserTab>("owner");
  const [q, setQ] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invite, setInvite] = useState({ email: "", name: "" });

  const staff = useQuery({
    queryKey: ["staff-all"],
    queryFn: async () => {
      const { data, error } = await api.GET("/v1/staff", { params: { query: { limit: 100 } } });
      if (error) return [] as StaffRow[];
      const items = (data?.items ?? []) as unknown[];
      return items.map((row) => {
        const r = asRecord(row);
        const roles = Array.isArray(r.staff_roles) ? r.staff_roles.map(String) : [];
        return {
          id: str(r.id, ""),
          email: str(r.email, ""),
          name: str(r.name, ""),
          staff_roles: roles,
          has_member_profile: Boolean(r.has_member_profile),
        } satisfies StaffRow;
      });
    },
    enabled: isOwner(session.user),
  });

  const members = useQuery({
    queryKey: ["users-members"],
    queryFn: async () => {
      const { data } = await api.GET("/v1/members", { params: { query: { limit: 100 } } });
      return (data?.items ?? []) as unknown[];
    },
    enabled: isOwner(session.user) && tab === "member",
  });

  const inviteMutation = useMutation({
    mutationFn: async () => {
      if (tab === "member") throw new Error("member");
      const { error, response } = await api.POST("/v1/auth/invite", {
        body: {
          email: invite.email,
          roles: [tab],
        },
      });
      if (error) throw new Error(String(response.status));
    },
    onSuccess: async () => {
      setInviteOpen(false);
      setInvite({ email: "", name: "" });
      await qc.invalidateQueries({ queryKey: ["staff-all"] });
    },
  });

  const deactivate = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await api.POST("/v1/staff/{staffId}/deactivate", {
        params: { path: { staffId: id } },
      });
      if (error) throw new Error("failed");
    },
    onSuccess: async () => qc.invalidateQueries({ queryKey: ["staff-all"] }),
  });

  const filteredStaff = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (staff.data ?? []).filter((row) => {
      if (tab === "member") return row.has_member_profile;
      if (!row.staff_roles.includes(tab)) return false;
      if (!needle) return true;
      return (
        row.email.toLowerCase().includes(needle) ||
        row.name.toLowerCase().includes(needle) ||
        row.staff_roles.join(" ").includes(needle)
      );
    });
  }, [staff.data, tab, q]);

  const filteredMembers = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (members.data ?? []).filter((row) => {
      const r = asRecord(row);
      if (!needle) return true;
      return str(r.member_code).toLowerCase().includes(needle) || str(r.status).toLowerCase().includes(needle);
    });
  }, [members.data, q]);

  if (!isOwner(session.user)) {
    return (
      <PageCard title={t("users.title")}>
        <p className="text-sm text-muted">{t("users.ownerOnly")}</p>
      </PageCard>
    );
  }

  return (
    <div className="space-y-4">
      <PageCard
        title={t("users.title")}
        action={
          tab !== "member" ? (
            <PrimaryButton type="button" onClick={() => setInviteOpen((v) => !v)}>
              {t("users.invite")}
            </PrimaryButton>
          ) : null
        }
      >
        <p className="mb-4 text-sm text-muted">{t("users.subtitle")}</p>

        <div className="mb-4 flex gap-1 overflow-x-auto rounded-2xl bg-surface p-1">
          {TABS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setTab(key);
                setInviteOpen(false);
              }}
              className={cn(
                "shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
                tab === key ? "bg-ink text-white shadow-sm" : "text-ink-soft hover:bg-white",
              )}
            >
              {t(`users.tabs.${key}`)}
            </button>
          ))}
        </div>

        <TextInput
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("users.search")}
          className="mb-4 max-w-md"
        />

        {inviteOpen && tab !== "member" ? (
          <form
            className="mb-6 grid gap-3 rounded-[24px] bg-surface p-4 md:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              inviteMutation.mutate();
            }}
          >
            <Field label={t("users.email")}>
              <TextInput
                required
                type="email"
                value={invite.email}
                onChange={(e) => setInvite((s) => ({ ...s, email: e.target.value }))}
              />
            </Field>
            <Field label={t("users.role")}>
              <TextInput readOnly value={t(`users.tabs.${tab}`)} />
            </Field>
            <div className="md:col-span-2 flex gap-2">
              <PrimaryButton type="submit" disabled={inviteMutation.isPending}>
                {t("users.sendInvite")}
              </PrimaryButton>
              <GhostButton type="button" onClick={() => setInviteOpen(false)}>
                {t("users.cancel")}
              </GhostButton>
            </div>
            {inviteMutation.isError ? (
              <p className="md:col-span-2 text-sm text-red-600">{t("users.inviteFailed")}</p>
            ) : null}
          </form>
        ) : null}

        {tab === "member" ? (
          <SoftTable
            headers={[t("users.code"), t("users.status"), t("users.id")]}
            rows={filteredMembers.map((row) => {
              const r = asRecord(row);
              return [str(r.member_code), str(r.status), str(r.id)];
            })}
          />
        ) : (
          <SoftTable
            headers={[t("users.name"), t("users.email"), t("users.roles"), ""]}
            rows={filteredStaff.map((row) => [
              row.name || "—",
              row.email,
              row.staff_roles.join(", "),
              <GhostButton
                key={row.id}
                type="button"
                disabled={deactivate.isPending || row.id === session.user?.id}
                onClick={() => deactivate.mutate(row.id)}
              >
                {t("users.deactivate")}
              </GhostButton>,
            ])}
          />
        )}

        {tab !== "member" && filteredStaff.length === 0 ? (
          <p className="mt-4 text-sm text-muted">{t("users.empty")}</p>
        ) : null}
        {tab === "member" && filteredMembers.length === 0 ? (
          <p className="mt-4 text-sm text-muted">{t("users.empty")}</p>
        ) : null}
      </PageCard>
    </div>
  );
}
