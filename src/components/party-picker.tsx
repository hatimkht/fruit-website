"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Search } from "lucide-react";
import type { PartyDefinition } from "@/lib/parties";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type Props = {
  parties: PartyDefinition[];
  /** Party IDs that may not be chosen (e.g. already picked in an earlier step). */
  disabledIds?: string[];
  value?: string;
  onChange: (id: string) => void;
};

export function PartyPicker({ parties, disabledIds = [], value, onChange }: Props) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...parties].sort((a, b) => a.order - b.order);
    if (!q) return sorted;
    return sorted.filter(
      (p) =>
        p.shortName.toLowerCase().includes(q) ||
        p.fullName.toLowerCase().includes(q),
    );
  }, [parties, query]);

  return (
    <div className="space-y-6">
      <div className="relative mx-auto max-w-md">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle"
        />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Partei suchen…"
          className="pl-11"
          aria-label="Parteien durchsuchen"
        />
      </div>

      <div
        role="radiogroup"
        aria-label="Parteien zur Auswahl"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visible.map((p, i) => {
          const disabled = disabledIds.includes(p.id);
          const selected = value === p.id;
          return (
            <motion.button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-disabled={disabled}
              disabled={disabled}
              onClick={() => onChange(p.id)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(i * 0.015, 0.25) }}
              className={cn(
                "group relative flex items-center gap-4 rounded-xl border bg-paper-50 px-4 py-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
                selected
                  ? "border-ink shadow-paper"
                  : "border-rule hover:border-ink/30 hover:bg-paper",
                disabled && "opacity-40 cursor-not-allowed hover:border-rule hover:bg-paper-50",
              )}
            >
              <span
                aria-hidden
                className="h-8 w-1.5 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-serif text-base text-ink">
                  {p.shortName}
                </span>
                <span className="truncate text-xs text-ink-muted">
                  {p.fullName}
                </span>
              </span>
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border transition-all",
                  selected
                    ? "border-ink bg-ink text-paper"
                    : "border-rule text-transparent group-hover:border-ink/40",
                )}
              >
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>
            </motion.button>
          );
        })}
      </div>

      {visible.length === 0 && (
        <p className="text-center text-sm text-ink-muted">
          Keine Partei entspricht „{query}".
        </p>
      )}
    </div>
  );
}
