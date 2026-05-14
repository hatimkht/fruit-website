"use client";

import { motion } from "framer-motion";
import type { PartyDefinition } from "@/lib/parties";
import { cn } from "@/lib/utils";

const rankLabels: Record<1 | 2 | 3, string> = {
  1: "Erste Präferenz",
  2: "Zweite Präferenz",
  3: "Dritte Präferenz",
};

const rankHint: Record<1 | 2 | 3, string> = {
  1: "zählt zuerst",
  2: "greift, falls erste Partei unter 5 %",
  3: "greift, falls zweite Partei unter 5 %",
};

type Row = { rank: 1 | 2 | 3; party: PartyDefinition };

export function Ballot({
  rows,
  stamped = false,
  className,
}: {
  rows: Row[];
  stamped?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      layout
      className={cn(
        "paper-surface relative mx-auto w-full max-w-xl overflow-hidden rounded-xl border border-rule shadow-ballot",
        className,
      )}
    >
      <div className="px-8 pt-10 pb-2">
        <p className="text-[10px] uppercase tracking-[0.28em] text-ink-subtle">
          Stimmzettel · Demonstrationsmodell
        </p>
        <h2 className="mt-2 font-serif text-2xl text-ink">
          Präferenzwahl mit drei Stimmen
        </h2>
        <div className="mt-4 h-px bg-rule" />
      </div>

      <ol className="divide-y divide-rule px-8">
        {rows.map(({ rank, party }) => (
          <li key={rank} className="flex items-center gap-5 py-5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/20 font-serif text-sm text-ink">
              {rank}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] uppercase tracking-[0.16em] text-ink-subtle">
                {rankLabels[rank]}
              </p>
              <p className="mt-0.5 font-serif text-lg text-ink">
                {party.shortName}
              </p>
              <p className="mt-0.5 truncate text-xs text-ink-muted">
                {party.fullName}
              </p>
            </div>
            <span
              aria-hidden
              className="ml-auto hidden h-10 w-1.5 rounded-full sm:block"
              style={{ backgroundColor: party.color }}
            />
          </li>
        ))}
      </ol>

      <div className="px-8 pb-10 pt-6">
        <div className="h-px bg-rule" />
        <div className="mt-6 grid grid-cols-3 gap-4 text-[11px] text-ink-muted">
          {([1, 2, 3] as const).map((r) => (
            <div key={r}>
              <p className="uppercase tracking-[0.14em] text-ink-subtle">
                Pref. {r}
              </p>
              <p className="mt-1 leading-snug">{rankHint[r]}</p>
            </div>
          ))}
        </div>
      </div>

      {stamped && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 1.8, rotate: -14 }}
          animate={{ opacity: 0.88, scale: 1, rotate: -6 }}
          transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
          className="pointer-events-none absolute right-6 top-6 flex h-28 w-28 items-center justify-center"
        >
          <svg viewBox="0 0 120 120" className="h-full w-full">
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="#9E2029"
              strokeWidth="3"
            />
            <circle
              cx="60"
              cy="60"
              r="44"
              fill="none"
              stroke="#9E2029"
              strokeWidth="1"
              strokeDasharray="2 4"
            />
            <text
              x="60"
              y="52"
              textAnchor="middle"
              fontFamily="var(--font-serif)"
              fontSize="13"
              fill="#9E2029"
              letterSpacing="2"
              fontWeight="600"
            >
              ABGEGEBEN
            </text>
            <text
              x="60"
              y="72"
              textAnchor="middle"
              fontFamily="var(--font-serif)"
              fontSize="9"
              fill="#9E2029"
              letterSpacing="1.5"
            >
              SIMULATION
            </text>
            <line x1="24" y1="80" x2="96" y2="80" stroke="#9E2029" strokeWidth="0.8" />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
}
