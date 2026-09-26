import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import { login } from "@/lib/auth";

const REMEMBER_KEY = "gp_admin_remember_email";

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_KEY);
    if (saved) {
      setEmail(saved);
      setRemember(true);
    }
  }, []);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    if (remember) localStorage.setItem(REMEMBER_KEY, email);
    else localStorage.removeItem(REMEMBER_KEY);
    try {
      await login(email, password);
      // Replace so Back does not return to the login form.
      await navigate({ to: "/", replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "failed";
      if (message === "forbidden") setError(t("auth.forbidden"));
      else if (message === "rate_limited") setError(t("auth.rateLimited"));
      else setError(t("auth.failed"));
      setPending(false);
    }
  }

  return (
    <div className="auth-screen relative min-h-screen overflow-hidden">
      <div className="auth-screen__bg" aria-hidden />
      <div className="auth-screen__veil" aria-hidden />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1280px] flex-col gap-10 px-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-12 xl:px-16">
        <div className="w-full max-w-md lg:max-w-[420px]">
          <h1 className="mb-10 text-5xl font-bold tracking-tight sm:text-6xl">
            <span className="text-[#0f3d3a]">{t("auth.log")}</span>
            <span className="text-[#2bb3a0]"> {t("auth.in")}</span>
          </h1>

          <form className="space-y-6" onSubmit={onLogin}>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#1a2b5c]">{t("auth.email")}</span>
              <input
                required
                type="email"
                autoComplete="username"
                placeholder={t("auth.emailPlaceholder")}
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                className="auth-input"
              />
            </label>

            <div className="block">
              <span className="mb-2 block text-sm font-semibold text-[#1a2b5c]">{t("auth.password")}</span>
              <div className="auth-password">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                  className="auth-input auth-input--password"
                />
                <button
                  type="button"
                  className="auth-password__toggle"
                  aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[#1a2b5c]">
              <input
                type="checkbox"
                checked={remember}
                onChange={(ev) => setRemember(ev.target.checked)}
                className="size-4 rounded border-[#7ec9bc] accent-[#2bb3a0]"
              />
              {t("auth.remember")}
            </label>

            {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

            <button type="submit" disabled={pending} className="auth-submit">
              {pending ? t("auth.loading") : t("auth.submit")}
            </button>
          </form>
        </div>

        <div className="relative mx-auto flex w-full max-w-[520px] items-center justify-center lg:mx-0 lg:max-w-none lg:flex-1 lg:justify-end">
          <div className="auth-orb">
            <div className="auth-orb__inner">
              <img src="/logo.png" alt="" className="mb-5 h-16 w-auto object-contain drop-shadow-md" />
              <div className="text-4xl font-bold tracking-tight text-white sm:text-5xl">{t("app.name")}</div>
              <p className="mt-4 max-w-[280px] text-center text-sm leading-relaxed text-white/90">
                {t("auth.brandBody")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
