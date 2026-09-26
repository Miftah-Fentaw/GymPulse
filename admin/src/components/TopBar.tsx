import { Search, Settings2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { firstName, getSession } from "@/lib/auth";

export function TopBar({
  search,
  onSearch,
}: {
  search: string;
  onSearch: (value: string) => void;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = getSession();

  return (
    <header className="mb-6 flex flex-wrap items-center gap-4">
      <div className="min-w-[180px]">
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          {t("header.hi", { name: firstName(user) })}
        </h1>
        <p className="text-sm text-muted">{t("app.tagline")}</p>
      </div>

      <form
        className="relative mx-auto flex min-w-[240px] max-w-xl flex-1 items-center"
        onSubmit={(e) => {
          e.preventDefault();
          const q = search.trim();
          void navigate({
            to: "/members",
            search: q ? ({ q } as Record<string, string>) : {},
          });
        }}
      >
        <Search className="pointer-events-none absolute left-4 size-4 text-muted" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={t("header.search")}
          className="w-full rounded-full border border-line bg-white py-3 pr-4 pl-11 text-sm shadow-(--shadow-card) outline-none ring-teal/30 placeholder:text-muted focus:ring-2"
        />
      </form>

      <button
        type="button"
        aria-label={t("nav.settings")}
        onClick={() => void navigate({ to: "/settings" })}
        className="grid size-11 place-items-center rounded-full bg-white text-ink shadow-(--shadow-card) transition hover:bg-lavender/40"
      >
        <Settings2 className="size-4.5" />
      </button>
    </header>
  );
}
