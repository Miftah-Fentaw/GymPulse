import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui";

export function WelcomePage() {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-dvh overflow-hidden bg-ink text-white">
      <img
        src="/welcome.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/25" />
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-end px-5 pb-10 pt-16 md:max-w-2xl md:justify-center md:px-10 lg:max-w-3xl">
        <div className="mb-auto flex items-center gap-2 md:mb-12">
          <img src="/logo.png" alt="" className="h-10 w-auto md:h-12" />
          <span className="font-display text-2xl font-bold md:text-3xl">{t("brand")}</span>
        </div>
        <h1 className="font-display max-w-sm text-4xl font-bold leading-tight md:max-w-xl md:text-5xl lg:text-6xl">
          {t("welcome.headline")}
        </h1>
        <div className="mt-8 flex max-w-md flex-col gap-3 md:mt-10 md:max-w-sm">
          <Link to="/sign-in">
            <Button className="w-full md:py-4" type="button">
              {t("welcome.emailCta")}
            </Button>
          </Link>
          <Link to="/sign-up">
            <Button className="w-full border-white/30 bg-white/95 text-ink transition hover:bg-white md:py-4" variant="secondary" type="button">
              {t("auth.create")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
