/**
 * Three-preference election simulation.
 *
 * The rules in plain words:
 *  1. Count everyone's first preference.
 *  2. Any party whose share is below the threshold (default 5%) is eliminated
 *     from the final result — they do not receive seats.
 *  3. Ballots whose first preference was eliminated move to their second
 *     preference. If that party is also eliminated, the ballot moves to the
 *     third preference. If all three preferences are eliminated, the ballot
 *     is treated as exhausted (it does not count towards any surviving party).
 *  4. The surviving parties are re-normalized against the full electorate so
 *     percentages still describe "share of the electorate", not "share of
 *     non-exhausted ballots". This matches how the 5%-Hürde behaves in the
 *     real Bundestag logic, where unclaimed votes do not inflate the others.
 *
 * The function returns both the pre-threshold tallies and a trace of every
 * ballot transfer so the UI can animate the redistribution.
 */

export type Ballot = {
  /** Party ids for first, second and third preference, in order. */
  preferences: [string, string, string];
  /** Number of ballots this entry represents. Default 1. */
  count?: number;
};

export type RoundTally = {
  partyId: string;
  votes: number;
  share: number;
};

export type Transfer = {
  fromPartyId: string;
  toPartyId: string | null; // null = exhausted
  rank: 2 | 3 | null; // null = exhausted
  votes: number;
};

export type SimulationResult = {
  totalBallots: number;
  threshold: number;
  /** Raw first-preference tally (pre-threshold, ordered by share desc). */
  firstPreferences: RoundTally[];
  /** Which parties cleared the threshold. */
  eligibleParties: string[];
  /** Which parties were eliminated. */
  eliminatedParties: string[];
  /** Per-transfer log from eliminated → fallback. */
  transfers: Transfer[];
  /** Final tally after transfers, only eligible parties. */
  finalResult: RoundTally[];
  /** Votes that could not be placed anywhere. */
  exhaustedVotes: number;
};

export function simulate(
  ballots: Ballot[],
  opts: { threshold?: number } = {},
): SimulationResult {
  const threshold = opts.threshold ?? 0.05;
  const totalBallots = ballots.reduce((acc, b) => acc + (b.count ?? 1), 0);

  if (totalBallots === 0) {
    return {
      totalBallots: 0,
      threshold,
      firstPreferences: [],
      eligibleParties: [],
      eliminatedParties: [],
      transfers: [],
      finalResult: [],
      exhaustedVotes: 0,
    };
  }

  // Step 1: first-preference tally
  const firstCounts = new Map<string, number>();
  for (const b of ballots) {
    const n = b.count ?? 1;
    firstCounts.set(b.preferences[0], (firstCounts.get(b.preferences[0]) ?? 0) + n);
  }

  const firstPreferences: RoundTally[] = [...firstCounts.entries()]
    .map(([partyId, votes]) => ({
      partyId,
      votes,
      share: votes / totalBallots,
    }))
    .sort((a, b) => b.votes - a.votes);

  // Step 2: apply threshold
  const eligible = new Set(
    firstPreferences.filter((r) => r.share >= threshold).map((r) => r.partyId),
  );
  const eliminated = firstPreferences
    .filter((r) => r.share < threshold)
    .map((r) => r.partyId);

  // Step 3: walk each ballot down its preference list
  const finalCounts = new Map<string, number>();
  for (const id of eligible) finalCounts.set(id, 0);

  const transfers: Transfer[] = [];
  let exhausted = 0;

  const pushTransfer = (t: Transfer) => {
    // Merge adjacent identical transfers for a cleaner trace.
    const existing = transfers.find(
      (x) => x.fromPartyId === t.fromPartyId && x.toPartyId === t.toPartyId && x.rank === t.rank,
    );
    if (existing) existing.votes += t.votes;
    else transfers.push(t);
  };

  for (const b of ballots) {
    const n = b.count ?? 1;
    const [p1, p2, p3] = b.preferences;

    if (eligible.has(p1)) {
      finalCounts.set(p1, (finalCounts.get(p1) ?? 0) + n);
      continue;
    }

    // p1 eliminated — try p2
    if (eligible.has(p2)) {
      finalCounts.set(p2, (finalCounts.get(p2) ?? 0) + n);
      pushTransfer({ fromPartyId: p1, toPartyId: p2, rank: 2, votes: n });
      continue;
    }

    // p2 eliminated — try p3
    if (eligible.has(p3)) {
      finalCounts.set(p3, (finalCounts.get(p3) ?? 0) + n);
      pushTransfer({ fromPartyId: p1, toPartyId: p3, rank: 3, votes: n });
      continue;
    }

    // exhausted
    exhausted += n;
    pushTransfer({ fromPartyId: p1, toPartyId: null, rank: null, votes: n });
  }

  const finalResult: RoundTally[] = [...finalCounts.entries()]
    .map(([partyId, votes]) => ({
      partyId,
      votes,
      share: votes / totalBallots,
    }))
    .sort((a, b) => b.votes - a.votes);

  return {
    totalBallots,
    threshold,
    firstPreferences,
    eligibleParties: [...eligible],
    eliminatedParties: eliminated,
    transfers,
    finalResult,
    exhaustedVotes: exhausted,
  };
}

/**
 * Distribute seats proportionally to the final tally using the
 * Sainte-Laguë / Schepers method (same as the Bundestag).
 */
export function distributeSeats(
  finalResult: RoundTally[],
  totalSeats: number,
): Array<{ partyId: string; seats: number }> {
  if (finalResult.length === 0 || totalSeats === 0) return [];

  type Slot = { partyId: string; votes: number; divisor: number };
  const slots: Slot[] = finalResult.map((r) => ({
    partyId: r.partyId,
    votes: r.votes,
    divisor: 0.5, // Sainte-Laguë odd-divisor series: 0.5, 1.5, 2.5, …
  }));
  const seats = new Map<string, number>(finalResult.map((r) => [r.partyId, 0]));

  for (let i = 0; i < totalSeats; i++) {
    // pick the slot with the highest quotient
    let bestIdx = 0;
    let bestQ = -Infinity;
    for (let j = 0; j < slots.length; j++) {
      const q = slots[j].votes / slots[j].divisor;
      if (q > bestQ) {
        bestQ = q;
        bestIdx = j;
      }
    }
    const s = slots[bestIdx];
    seats.set(s.partyId, (seats.get(s.partyId) ?? 0) + 1);
    s.divisor += 1;
  }

  return finalResult.map((r) => ({
    partyId: r.partyId,
    seats: seats.get(r.partyId) ?? 0,
  }));
}
