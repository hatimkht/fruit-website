"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import type { ResultsPayload } from "@/types/results";
import { formatInt } from "@/lib/utils";

/**
 * Half-circle parliament. Seats are arranged on concentric arcs (rings),
 * the outermost ring packed first. This matches the established
 * "parliament diagram" convention and keeps the layout readable at small sizes.
 */
export function Parliament({ data }: { data: ResultsPayload }) {
  const byId = new Map(data.parties.map((p) => [p.id, p]));
  const totalSeats = data.seats.reduce((a, b) => a + b.seats, 0);

  const seatDots = useMemo(() => {
    if (totalSeats === 0) return [];
    // Distribute seats across rings
    const rings = computeRingLayout(totalSeats);
    // Flatten per-ring seat positions, ordered from left to right
    const positions: { x: number; y: number; ring: number; angle: number }[] = [];
    rings.forEach((count, ringIndex) => {
      const radius = 40 + ringIndex * 14;
      for (let i = 0; i < count; i++) {
        const angle = Math.PI - (Math.PI * i) / (count - 1 || 1);
        positions.push({
          x: 100 + radius * Math.cos(angle),
          y: 100 - radius * Math.sin(angle),
          ring: ringIndex,
          angle,
        });
      }
    });

    // Sort all positions by angle descending (leftmost first, rightmost last)
    // so parties occupy contiguous arcs — classic parliament look.
    positions.sort((a, b) => b.angle - a.angle);

    // Order parties by final share descending for stable assignment.
    const ordered = [...data.seats]
      .filter((s) => s.seats > 0)
      .sort((a, b) => {
        const ai = data.finalResult.findIndex((r) => r.partyId === a.partyId);
        const bi = data.finalResult.findIndex((r) => r.partyId === b.partyId);
        return ai - bi;
      });

    const dots: { partyId: string; x: number; y: number }[] = [];
    let cursor = 0;
    for (const s of ordered) {
      for (let i = 0; i < s.seats; i++) {
        const pos = positions[cursor++];
        if (!pos) break;
        dots.push({ partyId: s.partyId, x: pos.x, y: pos.y });
      }
    }
    return dots;
  }, [data.seats, data.finalResult, totalSeats]);

  if (totalSeats === 0) {
    return (
      <div className="rounded-2xl border border-rule bg-paper-50 p-8 text-center text-sm text-ink-muted">
        Ohne qualifizierte Parteien können keine Sitze verteilt werden.
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto w-full max-w-[520px]">
        <svg viewBox="0 0 200 115" className="h-auto w-full" role="img" aria-label="Stilisiertes Halbrund einer Sitzverteilung">
          {seatDots.map((d, i) => (
            <motion.circle
              key={i}
              cx={d.x}
              cy={d.y}
              r={2.1}
              fill={byId.get(d.partyId)?.color ?? "#1A1A1C"}
              initial={{ opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.004 }}
            />
          ))}
          <line x1="20" y1="101" x2="180" y2="101" stroke="#E4E4DA" strokeWidth="0.6" />
          <text x="100" y="112" textAnchor="middle" fontSize="6" fill="#86868E" letterSpacing="1.2">
            HYPOTHETISCHE SITZVERTEILUNG · {formatInt(totalSeats)} SITZE
          </text>
        </svg>
      </div>

      <ul className="mx-auto mt-6 flex max-w-lg flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-ink-muted">
        {data.seats
          .filter((s) => s.seats > 0)
          .map((s) => {
            const p = byId.get(s.partyId);
            return (
              <li key={s.partyId} className="flex items-center gap-2">
                <span aria-hidden className="h-2 w-2 rounded-full" style={{ backgroundColor: p?.color }} />
                <span className="font-serif text-ink">{p?.shortName}</span>
                <span className="tabular-nums">{formatInt(s.seats)}</span>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

/**
 * Given N seats, return how many seats belong to each concentric ring.
 * Outer rings have more capacity (the circumference is longer).
 */
function computeRingLayout(totalSeats: number): number[] {
  // Target ring capacities — tuned for a pleasant visual density up to ~200 seats.
  const ringCount = totalSeats <= 30 ? 2 : totalSeats <= 80 ? 3 : totalSeats <= 160 ? 4 : 5;
  const weights: number[] = [];
  for (let i = 0; i < ringCount; i++) {
    weights.push(1 + i * 0.5); // outer rings larger
  }
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map((w) => (w / totalWeight) * totalSeats);
  const floored = raw.map((v) => Math.floor(v));
  let remainder = totalSeats - floored.reduce((a, b) => a + b, 0);
  // Distribute any leftover seats starting from the outermost ring.
  for (let i = floored.length - 1; i >= 0 && remainder > 0; i--) {
    floored[i] += 1;
    remainder -= 1;
  }
  return floored;
}
