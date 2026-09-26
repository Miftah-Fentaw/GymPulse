import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import { AuthShell } from "@/components/AuthShell";
import { Button, Input } from "@/components/ui";
import { login } from "@/lib/auth";

export function SignInPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(false);
    try {
      await login(email, password);
      await navigate({ to: "/" });
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      title={t("auth.signInTitle")}
      subtitle={t("auth.emailOnly")}
      footer={
        <>
          {t("auth.noAccount")}{" "}
          <Link to="/sign-up" className="font-semibold text-brand transition hover:text-brand-dark">
            {t("auth.create")}
          </Link>
        </>
      }
    >
      <form className="flex flex-col gap-3 md:gap-4" onSubmit={onSubmit}>
        <Input
          type="email"
          autoComplete="email"
          placeholder={t("auth.email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder={t("auth.password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pr-12"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-muted transition hover:bg-surface hover:text-ink"
            aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </div>
        {error ? <p className="text-sm text-brand">{t("auth.failed")}</p> : null}
        <Button className="mt-2 w-full md:mt-3 md:py-4" type="submit" disabled={busy}>
          {t("auth.continue")}
        </Button>
      </form>
    </AuthShell>
  );
}
