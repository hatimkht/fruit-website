import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "neutral" | "accent" | "threshold" | "outline";

const variants: Record<Variant, string> = {
  neutral: "bg-paper-200 text-ink-soft",
  accent: "bg-accent-tint text-accent",
  threshold: "bg-threshold-tint text-threshold",
  outline: "border border-rule text-ink-muted",
};

export function Badge({
  variant = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium tracking-tight",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
