import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";

const items = [
  { q: "faq.q1", a: "faq.a1" },
  { q: "faq.q2", a: "faq.a2" },
  { q: "faq.q3", a: "faq.a3" },
] as const;

export function FaqPage() {
  const { t } = useTranslation();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link to="/profile" className="text-sm font-semibold text-muted">
          ← {t("common.back")}
        </Link>
      </div>
      <h1 className="font-display text-2xl font-bold">{t("faq.title")}</h1>
      <div className="space-y-2">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <Card key={item.q} className="overflow-hidden">
              <button
                type="button"
                className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-semibold"
                onClick={() => setOpen(isOpen ? null : i)}
              >
                {t(item.q)}
                <span className={cn("text-brand", isOpen && "rotate-45")}>+</span>
              </button>
              {isOpen ? (
                <p className="border-t border-line px-4 py-3 text-sm text-ink-soft">{t(item.a)}</p>
              ) : null}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
