import type { ButtonHTMLAttributes, InputHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "soft";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold transition active:scale-[0.99] disabled:opacity-50",
        variant === "primary" && "bg-brand text-white hover:bg-brand-dark",
        variant === "secondary" && "border border-line bg-card text-ink hover:bg-surface",
        variant === "soft" && "bg-brand-soft text-brand hover:bg-brand/15",
        variant === "ghost" && "bg-transparent text-ink hover:bg-surface",
        className,
      )}
      {...props}
    />
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-2xl border-0 bg-[#f1f1f3] px-4 py-3.5 text-sm text-ink outline-none ring-0 placeholder:text-muted focus:bg-[#ebebed]",
        className,
      )}
      {...props}
    />
  );
}

export function Card({ className, children }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn("rounded-2xl bg-card shadow-[var(--shadow-card)]", className)}>{children}</div>
  );
}

export function SectionTitle({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <h2 className="font-display text-lg font-700 text-ink">{title}</h2>
      {action}
    </div>
  );
}

export function Avatar({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn("rounded-full object-cover", className)}
    />
  );
}
