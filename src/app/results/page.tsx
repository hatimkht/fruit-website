import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { PARTIES, ELECTION_THRESHOLD, PARLIAMENT_SEATS } from "@/lib/parties";
import { simulate, distributeSeats, type Ballot } from "@/lib/simulation";
import type { ResultsPayload } from "@/types/results";
import { ResultsView } from "@/components/results/results-view";
import { DEMO_RESULTS } from "@/lib/demoResults";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Auswertung",
  description:
    "Live aggregierte Ergebnisse der Präferenzwahl-Simulation — Rohverteilung, Stimmübertragung und Endergebnis.",
};

async function loadResults(): Promise<ResultsPayload> {
  // Defensive: if the DB isn't reachable (e.g. on a cold start without env),
  // render an empty state instead of crashing the route.
  try {
    const sessions = await prisma.voteSession.findMany({
      where: { submittedAt: { not: null } },
      select: {
        preferences: {
          select: { partyId: true, rank: true },
          orderBy: { rank: "asc" },
        },
      },
    });

    const ballots: Ballot[] = sessions
      .map((s) => {
        const byRank = new Map(s.preferences.map((p) => [p.rank, p.partyId]));
        const p1 = byRank.get(1);
        const p2 = byRank.get(2);
        const p3 = byRank.get(3);
        if (!p1 || !p2 || !p3) return null;
        return { preferences: [p1, p2, p3] as [string, string, string] };
      })
      .filter((b): b is Ballot => b !== null);

    const result = simulate(ballots, { threshold: ELECTION_THRESHOLD });
    const seats = distributeSeats(result.finalResult, PARLIAMENT_SEATS);

    const payload: ResultsPayload = {
      parties: PARTIES.filter((p) => p.active),
      threshold: ELECTION_THRESHOLD,
      parliamentSeats: PARLIAMENT_SEATS,
      totalBallots: result.totalBallots,
      firstPreferences: result.firstPreferences,
      eligibleParties: result.eligibleParties,
      eliminatedParties: result.eliminatedParties,
      transfers: result.transfers,
      finalResult: result.finalResult,
      exhaustedVotes: result.exhaustedVotes,
      seats,
    };

    // Keine echten Stimmen vorhanden → Demo-Daten anzeigen
    if (payload.totalBallots === 0) {
      return DEMO_RESULTS;
    }

    return payload;
  } catch (err) {
    console.error("Loading results failed, falling back to demo data:", err);
    return DEMO_RESULTS;
  }
}

export default async function ResultsPage() {
  const data = await loadResults();
  return <ResultsView data={data} />;
}
