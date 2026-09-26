import type { PropsWithChildren } from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

/** Full-viewport auth chrome: mobile stays full-bleed; tablet/desktop centers a panel. */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: PropsWithChildren<{
  title: string;
  subtitle?: string;
  footer?: React.ReactNode;
}>) {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-dvh bg-surface md:flex md:items-center md:justify-center md:px-8 md:py-12 lg:px-12">
      <div
        className="pointer-events-none absolute inset-0 hidden md:block"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 10% 20%, color-mix(in srgb, var(--color-brand) 18%, transparent), transparent 55%), radial-gradient(ellipse 70% 50% at 90% 80%, color-mix(in srgb, var(--color-brand) 12%, transparent), transparent 50%), linear-gradient(160deg, #f7f7f8 0%, #ececec 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col bg-card px-5 py-8 shadow-none md:min-h-0 md:rounded-[28px] md:px-10 md:py-10 md:shadow-[var(--shadow-card)] lg:max-w-lg">
        <div className="mb-6 flex items-center gap-2.5 md:mb-8">
          <img src="/logo.png" alt="" className="h-9 w-auto md:h-10" />
          <span className="font-display text-xl font-bold text-ink md:text-2xl">{t("brand")}</span>
        </div>

        <Link
          to="/welcome"
          className="mb-6 inline-flex w-fit text-sm font-semibold text-muted transition hover:text-brand md:mb-8"
        >
          ← {t("common.back")}
        </Link>

        <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm text-muted md:text-base">{subtitle}</p> : null}

        <div className="mt-8 flex flex-1 flex-col md:mt-10">{children}</div>

        {footer ? <div className="mt-8 text-center text-sm text-muted md:mt-10">{footer}</div> : null}
      </div>
    </div>
  );
}
