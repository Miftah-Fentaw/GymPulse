import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageCard({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-[28px] bg-white p-5 shadow-(--shadow-card)", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title ? <h2 className="text-base font-bold text-ink">{title}</h2> : <div />}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatTile({
  title,
  value,
  tone,
  icon,
  meta,
}: {
  title: string;
  value: string | number;
  tone: "lavender" | "peach" | "mint";
  icon: ReactNode;
  meta?: Array<{ icon: ReactNode; label: string }>;
}) {
  const bg =
    tone === "lavender" ? "bg-lavender" : tone === "peach" ? "bg-peach" : "bg-mint";
  return (
    <div className={cn("rounded-[28px] p-5 shadow-(--shadow-card)", bg)}>
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="grid size-12 place-items-center rounded-2xl bg-white/80 text-ink shadow-sm">
          {icon}
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold tracking-tight text-ink">{value}</div>
          <div className="mt-1 text-sm font-semibold text-ink/80">{title}</div>
        </div>
      </div>
      {meta && meta.length > 0 ? (
        <div className="flex items-center gap-4 border-t border-white/50 pt-3">
          {meta.map((m, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs font-medium text-ink-soft">
              <span className="grid size-7 place-items-center rounded-full bg-white/70">{m.icon}</span>
              {m.label}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal/25 transition hover:bg-teal-dark disabled:opacity-50",
        props.className,
      )}
    />
  );
}

export function GhostButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-surface disabled:opacity-50",
        props.className,
      )}
    />
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-semibold text-ink-soft">{label}</span>
      {children}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-2xl border border-line bg-surface px-4 py-3 text-sm outline-none ring-teal/30 focus:bg-white focus:ring-2",
        props.className,
      )}
    />
  );
}

export function TextSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "w-full rounded-2xl border border-line bg-surface px-4 py-3 text-sm outline-none ring-teal/30 focus:bg-white focus:ring-2",
        props.className,
      )}
    />
  );
}

export function SoftTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-separate border-spacing-y-2 text-left text-sm">
        <thead>
          <tr className="text-xs font-semibold tracking-wide text-muted uppercase">
            {headers.map((h) => (
              <th key={h} className="px-3 py-1 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="bg-surface/80">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-3 first:rounded-l-2xl last:rounded-r-2xl">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
