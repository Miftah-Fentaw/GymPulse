import { Outlet, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { RightRail } from "@/components/RightRail";
import { api, getSession } from "@/lib/auth";
import { asRecord, str } from "@/lib/utils";

async function domainGet(path: string) {
  const token = getSession().accessToken;
  const res = await fetch(path, {
    credentials: "include",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) return { items: [] as unknown[] };
  return (await res.json()) as { items?: unknown[] };
}

export function AppShell() {
  const [search, setSearch] = useState("");
  const path = useRouterState({ select: (s) => s.location.pathname });

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
  const checkins = useQuery({
    queryKey: ["checkins-today"],
    queryFn: () => domainGet("/v1/checkins"),
  });
  const overdue = useQuery({
    queryKey: ["overdue"],
    queryFn: () => domainGet("/v1/billing/overdue"),
  });

  const showRight = path === "/" || path === "";

  return (
    <div className="min-h-screen bg-surface p-4 md:p-6">
      <div className="mx-auto flex max-w-[1500px] gap-5">
        <div className="sticky top-6 hidden h-[calc(100vh-3rem)] lg:block">
          <Sidebar />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-4 lg:hidden">
            <Sidebar />
          </div>
          <TopBar search={search} onSearch={setSearch} />
          <Outlet />
        </div>
        {showRight ? (
          <div className="sticky top-6 hidden h-[calc(100vh-3rem)] overflow-auto xl:block">
            <RightRail
              gymName={str(asRecord(gym.data).name, "") || undefined}
              overdueCount={(overdue.data?.items ?? []).length}
              checkinCount={(checkins.data?.items ?? []).length}
              branchCount={(branches.data ?? []).length}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
