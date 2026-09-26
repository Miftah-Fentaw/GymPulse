import { Link, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Users,
  BadgePercent,
  ScanLine,
  Receipt,
  UserPlus,
  CalendarDays,
  Dumbbell,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/auth";

const items = [
  { to: "/", icon: LayoutDashboard, key: "dashboard" },
  { to: "/members", icon: Users, key: "members" },
  { to: "/plans", icon: BadgePercent, key: "plans" },
  { to: "/checkin", icon: ScanLine, key: "checkin" },
  { to: "/billing", icon: Receipt, key: "billing" },
  { to: "/leads", icon: UserPlus, key: "leads" },
  { to: "/classes", icon: CalendarDays, key: "classes" },
  { to: "/trainers", icon: Dumbbell, key: "trainers" },
  { to: "/reports", icon: BarChart3, key: "reports" },
  { to: "/settings", icon: Settings, key: "settings" },
] as const;

export function Sidebar() {
  const { t } = useTranslation();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="flex h-full w-[248px] shrink-0 flex-col rounded-[28px] bg-white p-5 shadow-(--shadow-card)">
      <div className="mb-8 flex items-center gap-3 px-1">
        <img src="/logo.png" alt="" className="h-12 w-auto rounded-xl object-contain" />
        <div>
          <div className="text-lg font-bold tracking-tight text-ink">{t("app.name")}</div>
          <div className="text-xs font-medium text-muted">Admin</div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1.5">
        {items.map((item) => {
          const isActive = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                isActive
                  ? "bg-ink text-white shadow-md shadow-ink/20"
                  : "text-ink-soft hover:bg-surface",
              )}
            >
              <item.icon className="size-4.5 opacity-90" />
              {t(`nav.${item.key}`)}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => void logout()}
        className="mt-4 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-muted transition hover:bg-surface hover:text-ink"
      >
        <LogOut className="size-4.5" />
        {t("nav.logout")}
      </button>
    </aside>
  );
}
