"use client";

import { cn } from "@/lib/utils";

const steps = [
  { id: 1, label: "Erste Präferenz" },
  { id: 2, label: "Zweite Präferenz" },
  { id: 3, label: "Dritte Präferenz" },
  { id: 4, label: "Prüfen & Abgeben" },
];

export function ProgressStepper({ current }: { current: 1 | 2 | 3 | 4 }) {
  return (
    <nav
      aria-label="Fortschritt"
      className="mx-auto w-full max-w-3xl"
    >
      <ol className="flex items-center justify-between gap-2">
        {steps.map((s, i) => {
          const reached = current >= s.id;
          const active = current === s.id;
          return (
            <li key={s.id} className="flex flex-1 items-center gap-2">
              <div className="flex flex-col items-center gap-2 flex-1">
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-medium tracking-tight transition-all",
                    reached
                      ? "border-ink bg-ink text-paper"
                      : "border-rule bg-paper text-ink-subtle",
                    active && "ring-4 ring-ink/5",
                  )}
                  aria-current={active ? "step" : undefined}
                >
                  {s.id}
                </div>
                <span
                  className={cn(
                    "hidden text-center text-xs font-medium sm:block",
                    reached ? "text-ink" : "text-ink-subtle",
                  )}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "h-px flex-1 transition-colors",
                    current > s.id ? "bg-ink" : "bg-rule",
                  )}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
