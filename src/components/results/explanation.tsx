"use client";

import { BookOpen } from "lucide-react";
import Link from "next/link";
import type { ResultsPayload } from "@/types/results";
import { formatInt, formatPercent } from "@/lib/utils";

export function Explanation({ data }: { data: ResultsPayload }) {
  const transferredVotes = data.transfers
    .filter((t) => t.toPartyId !== null)
    .reduce((a, b) => a + b.votes, 0);

  return (
    <aside className="rounded-2xl border border-accent/15 bg-accent-tint/40 p-7">
      <div className="flex items-center gap-2 text-accent">
        <BookOpen className="h-4 w-4" strokeWidth={1.8} />
        <p className="text-[11px] uppercase tracking-[0.16em]">
          Lesehilfe
        </p>
      </div>
      <h3 className="mt-3 font-serif text-xl text-ink">
        Wie kam dieses Ergebnis zustande?
      </h3>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-soft">
        <p>
          Insgesamt {formatInt(data.totalBallots)} Stimmzettel wurden in dieser
          Simulation ausgewertet. Zunächst wurde die Erststimme jedes Zettels
          gezählt. Parteien, deren Anteil unter {formatPercent(data.threshold)} lag,
          konnten nicht ins Endergebnis einziehen.
        </p>
        {data.eliminatedParties.length > 0 ? (
          <p>
            {data.eliminatedParties.length === 1 ? "Eine Partei" : `${data.eliminatedParties.length} Parteien`}{" "}
            unterschritt{data.eliminatedParties.length === 1 ? "" : "en"} die Hürde.
            Deren Stimmen wurden auf die jeweilige Zweitstimme übertragen; war auch
            diese für eine ausgeschiedene Partei, griff die Drittstimme. Insgesamt
            wurden so {formatInt(transferredVotes)} Stimmen umverteilt.
          </p>
        ) : (
          <p>
            In dieser Simulation haben alle antretenden Parteien die Hürde
            erreicht — es waren keine Stimmübertragungen nötig.
          </p>
        )}
        {data.exhaustedVotes > 0 && (
          <p>
            {formatInt(data.exhaustedVotes)}{" "}
            {data.exhaustedVotes === 1 ? "Stimme" : "Stimmen"} konnten keine der
            drei Präferenzen zugeordnet werden, weil auch die Drittstimme für
            eine ausgeschiedene Partei abgegeben wurde. Diese Stimmen sind
            verfallen.
          </p>
        )}
        <p>
          Das finale Ergebnis zeigt ausschließlich die verbliebenen Parteien,
          inklusive der übertragenen Stimmen. Prozente beziehen sich weiterhin
          auf die gesamte Stimmmenge — verfallene Stimmen blähen die anderen
          Anteile nicht künstlich auf.
        </p>
      </div>
      <Link
        href="/methodology"
        className="mt-5 inline-flex text-sm text-accent underline underline-offset-4 hover:text-accent-soft"
      >
        Vollständige Methodik lesen →
      </Link>
    </aside>
  );
}
