"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { ResultsPayload } from "@/types/results";
import { formatPercent } from "@/lib/utils";

export function ThresholdSummary({ data }: { data: ResultsPayload }) {
  const byId = new Map(data.parties.map((p) => [p.id, p]));

  const eligible = data.firstPreferences.filter((r) => r.share >= data.threshold);
  const eliminated = data.firstPreferences.filter((r) => r.share < data.threshold);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Column
        label="Erreichen die Hürde"
        tone="ok"
        rows={eligible}
        byId={byId}
        empty="Noch keine Partei über der 5%-Hürde."
      />
      <Column
        label="Unter 5 %"
        tone="warn"
        rows={eliminated}
        byId={byId}
        empty="Keine Partei unter der Hürde."
      />
    </div>
  );
}

function Column({
  label,
  tone,
  rows,
  byId,
  empty,
}: {
  label: string;
  tone: "ok" | "warn";
  rows: { partyId: string; votes: number; share: number }[];
  byId: Map<string, { shortName: string; color: string }>;
  empty: string;
}) {
  const Icon = tone === "ok" ? CheckCircle2 : AlertCircle;
  const iconClass =
    tone === "ok" ? "text-accent" : "text-threshold";

  return (
    <div className="rounded-2xl border border-rule bg-paper-50 p-5">
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${iconClass}`} strokeWidth={1.8} />
        <p className="text-[11px] uppercase tracking-[0.14em] text-ink-subtle">
          {label}
        </p>
      </div>
      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-ink-muted">{empty}</p>
      ) : (
        <ul className="mt-3 divide-y divide-rule">
          {rows.map((r, i) => {
            const p = byId.get(r.partyId);
            return (
              <motion.li
                key={r.partyId}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="flex items-center justify-between gap-3 py-2.5"
              >
                <span className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="h-6 w-1 rounded-full"
                    style={{ backgroundColor: p?.color ?? "#1A1A1C", opacity: tone === "warn" ? 0.5 : 1 }}
                  />
                  <span className="font-serif text-sm text-ink">{p?.shortName}</span>
                </span>
                <span className="font-mono text-[12px] text-ink-muted tabular-nums">
                  {formatPercent(r.share)}
                </span>
              </motion.li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
