"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import type { ResultsPayload } from "@/types/results";
import { formatInt } from "@/lib/utils";

/**
 * Renders the redistribution trace as a two-column flow:
 *   [ eliminated parties ]  →  [ eligible parties + exhausted ]
 *
 * Each transfer is a thin curved ribbon whose width maps to the vote count.
 * It's deliberately not a literal Sankey — fewer visual elements, clearer read.
 */
export function TransferFlow({ data }: { data: ResultsPayload }) {
  const byId = new Map(data.parties.map((p) => [p.id, p]));

  const eliminatedIds = useMemo(
    () => data.transfers.map((t) => t.fromPartyId).filter((v, i, a) => a.indexOf(v) === i),
    [data.transfers],
  );
  const targetIds = useMemo(() => {
    const set = new Set<string | "exhausted">();
    for (const t of data.transfers) set.add(t.toPartyId ?? "exhausted");
    return [...set];
  }, [data.transfers]);

  if (data.transfers.length === 0) {
    return (
      <div className="rounded-2xl border border-rule bg-paper-50 p-8 text-center text-sm text-ink-muted">
        Keine Übertragungen nötig — alle erststimmentragenden Parteien liegen
        bereits über der 5%-Hürde.
      </div>
    );
  }

  const maxVotes = Math.max(...data.transfers.map((t) => t.votes));

  const width = 700;
  const height = Math.max(220, Math.max(eliminatedIds.length, targetIds.length) * 54);
  const leftX = 80;
  const rightX = width - 80;

  const leftSpacing = height / (eliminatedIds.length + 1);
  const rightSpacing = height / (targetIds.length + 1);

  const leftY = (id: string) => (eliminatedIds.indexOf(id) + 1) * leftSpacing;
  const rightY = (id: string | "exhausted") =>
    (targetIds.indexOf(id) + 1) * rightSpacing;

  return (
    <div className="rounded-2xl border border-rule bg-paper-50 p-4 sm:p-6">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height + 40}`}
          className="mx-auto h-auto w-full max-w-[720px]"
          role="img"
          aria-label="Visualisierung der Stimmübertragung"
        >
          {/* Column headers */}
          <text x={leftX} y={18} fontSize="11" fill="#55555C" letterSpacing="1.4">
            AUSGESCHIEDEN
          </text>
          <text
            x={rightX}
            y={18}
            fontSize="11"
            fill="#55555C"
            letterSpacing="1.4"
            textAnchor="end"
          >
            FALLBACK-ZIEL
          </text>

          {/* Ribbons */}
          {data.transfers.map((t, i) => {
            const sx = leftX + 6;
            const sy = leftY(t.fromPartyId) + 30;
            const ty = rightY(t.toPartyId ?? "exhausted") + 30;
            const ex = rightX - 6;
            const stroke =
              t.toPartyId === null
                ? "#55555C"
                : byId.get(t.fromPartyId)?.color ?? "#1A1A1C";
            const widthPx = Math.max(2, (t.votes / maxVotes) * 18);
            const d = `M ${sx} ${sy} C ${(sx + ex) / 2} ${sy}, ${(sx + ex) / 2} ${ty}, ${ex} ${ty}`;
            return (
              <motion.path
                key={i}
                d={d}
                stroke={stroke}
                strokeOpacity={t.toPartyId === null ? 0.35 : 0.55}
                strokeWidth={widthPx}
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ duration: 1.1, delay: i * 0.1, ease: "easeOut" }}
              />
            );
          })}

          {/* Left nodes */}
          {eliminatedIds.map((id) => {
            const y = leftY(id);
            const p = byId.get(id);
            return (
              <g key={id} transform={`translate(${leftX - 70} ${y + 18})`}>
                <rect
                  x="0"
                  y="0"
                  width="80"
                  height="24"
                  rx="12"
                  fill="#F6F6F1"
                  stroke="#E4E4DA"
                />
                <rect x="6" y="6" width="3" height="12" rx="1.5" fill={p?.color} opacity="0.6" />
                <text x="16" y="16" fontSize="11" fill="#1A1A1C">
                  {p?.shortName ?? id}
                </text>
              </g>
            );
          })}

          {/* Right nodes */}
          {targetIds.map((id) => {
            const y = rightY(id);
            if (id === "exhausted") {
              return (
                <g key="exhausted" transform={`translate(${rightX - 10} ${y + 18})`}>
                  <rect
                    x="0"
                    y="0"
                    width="100"
                    height="24"
                    rx="12"
                    fill="#F6F6F1"
                    stroke="#E4E4DA"
                    strokeDasharray="3 3"
                  />
                  <text x="12" y="16" fontSize="11" fill="#55555C">
                    Verfallen
                  </text>
                </g>
              );
            }
            const p = byId.get(id);
            return (
              <g key={id} transform={`translate(${rightX - 10} ${y + 18})`}>
                <rect
                  x="0"
                  y="0"
                  width="90"
                  height="24"
                  rx="12"
                  fill="#F6F6F1"
                  stroke="#E4E4DA"
                />
                <rect x="6" y="6" width="3" height="12" rx="1.5" fill={p?.color} />
                <text x="16" y="16" fontSize="11" fill="#1A1A1C">
                  {p?.shortName ?? id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 text-xs text-ink-muted sm:grid-cols-3">
        <Stat label="Übertragene Stimmen" value={formatInt(data.transfers.filter((t) => t.toPartyId !== null).reduce((a, b) => a + b.votes, 0))} />
        <Stat label="Verfallen" value={formatInt(data.exhaustedVotes)} />
        <Stat label="Ausgeschiedene Parteien" value={formatInt(data.eliminatedParties.length)} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-rule bg-paper px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.14em] text-ink-subtle">{label}</p>
      <p className="mt-0.5 font-serif text-lg text-ink">{value}</p>
    </div>
  );
}
