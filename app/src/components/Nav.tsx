import { Link, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { CalendarDays, CreditCard, Home, QrCode, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", key: "home", icon: Home },
  { to: "/check-in", key: "checkin", icon: QrCode },
  { to: "/schedule", key: "schedule", icon: CalendarDays },
  { to: "/billing", key: "billing", icon: CreditCard },
  { to: "/profile", key: "profile", icon: UserRound },
] as const;

function usePath() {
  return useRouterState({ select: (s) => s.location.pathname });
}

function isActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function BottomNav() {
  const { t } = useTranslation();
  const pathname = usePath();

  return (
    <nav className="safe-b fixed inset-x-0 bottom-0 z-40 border-t border-line bg-card/95 px-1 pt-2 backdrop-blur md:hidden">
      <ul className="mx-auto grid max-w-lg grid-cols-5 gap-0.5">
        {items.map(({ to, key, icon: Icon }) => {
          const active = isActive(pathname, to);
          return (
            <li key={to}>
              <Link
                to={to}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[0.62rem] font-semibold",
                  active ? "text-brand" : "text-muted",
                )}
              >
                <Icon className="size-5" strokeWidth={active ? 2.4 : 1.8} />
                <span>{t(`nav.${key}`)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function SideNav() {
  const { t } = useTranslation();
  const pathname = usePath();

  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-line bg-card px-4 py-6 md:flex">
      <div className="mb-8 flex items-center gap-2.5 px-2">
        <img src="/logo.png" alt="" className="h-9 w-auto" />
        <span className="font-display text-xl font-bold text-ink">{t("brand")}</span>
      </div>
      <ul className="flex flex-col gap-1">
        {items.map(({ to, key, icon: Icon }) => {
          const active = isActive(pathname, to);
          return (
            <li key={to}>
              <Link
                to={to}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition",
                  active ? "bg-brand-soft text-brand" : "text-ink-soft hover:bg-surface",
                )}
              >
                <Icon className="size-5" strokeWidth={active ? 2.4 : 1.8} />
                {t(`nav.${key}`)}
              </Link>
            </li>
          );
        })}
        <li>
          <Link
            to="/explore"
            className={cn(
              "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition",
              isActive(pathname, "/explore") ? "bg-brand-soft text-brand" : "text-ink-soft hover:bg-surface",
            )}
          >
            {t("nav.explore")}
          </Link>
        </li>
      </ul>
    </aside>
  );
}
