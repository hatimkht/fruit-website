import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { PARTIES, ELECTION_THRESHOLD, PARLIAMENT_SEATS } from "@/lib/parties";
import { simulate, distributeSeats, type Ballot } from "@/lib/simulation";
import { DEMO_RESULTS } from "@/lib/demoResults";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  // Load all submitted sessions with their three preferences.
  // For a demo volume (thousands) this is cheap. If it ever grows, move to a
  // materialized aggregation refreshed on vote submit.
  try {
    const sessions = await prisma.voteSession.findMany({
      where: { submittedAt: { not: null } },
      select: {
        id: true,
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

    const payload = {
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

    // Keine echten Stimmen → Demo-Daten zurückgeben
    if (payload.totalBallots === 0) {
      return NextResponse.json(DEMO_RESULTS);
    }

    return NextResponse.json(payload);
  } catch (err) {
    console.error("GET /api/results failed:", err);
    return NextResponse.json(DEMO_RESULTS);
  }
}
