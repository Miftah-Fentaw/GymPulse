import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import QRCode from "qrcode";
import { Card } from "@/components/ui";
import { getSession } from "@/lib/auth";

async function fetchToken() {
  const token = getSession().accessToken;
  const res = await fetch("/v1/me/checkin-token", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("token_failed");
  return (await res.json()) as { token: string; member_code?: string; expires_at?: string };
}

export function CheckInPage() {
  const { t } = useTranslation();
  const [qrUrl, setQrUrl] = useState("");
  const checkin = useQuery({
    queryKey: ["checkin-token"],
    queryFn: fetchToken,
    refetchInterval: 45_000,
    retry: 1,
  });

  useEffect(() => {
    const value = checkin.data?.token;
    if (!value) {
      setQrUrl("");
      return;
    }
    let cancelled = false;
    void QRCode.toDataURL(value, { width: 280, margin: 2, color: { dark: "#111111", light: "#ffffff" } }).then(
      (url) => {
        if (!cancelled) setQrUrl(url);
      },
    );
    try {
      localStorage.setItem("gp_last_checkin_qr", value);
      if (checkin.data?.member_code) localStorage.setItem("gp_last_member_code", checkin.data.member_code);
    } catch {
      /* ignore */
    }
    return () => {
      cancelled = true;
    };
  }, [checkin.data?.token, checkin.data?.member_code]);

  const code = checkin.data?.member_code || localStorage.getItem("gp_last_member_code") || "—";

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink">{t("checkin.title")}</h1>
      <p className="text-sm text-muted">{t("checkin.hint")}</p>
      <Card className="flex flex-col items-center gap-4 p-6">
        {qrUrl ? (
          <img src={qrUrl} alt="" className="size-64 rounded-2xl bg-white p-2" />
        ) : (
          <div className="grid size-64 place-items-center rounded-2xl bg-surface text-sm text-muted">
            {checkin.isError ? t("checkin.error") : t("common.loading")}
          </div>
        )}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">{t("checkin.memberCode")}</p>
          <p className="mt-1 font-display text-2xl font-bold text-ink">{code}</p>
        </div>
        {checkin.data?.expires_at ? (
          <p className="text-xs text-muted">
            {t("checkin.expires", { at: new Date(checkin.data.expires_at).toLocaleTimeString() })}
          </p>
        ) : null}
      </Card>
    </div>
  );
}
