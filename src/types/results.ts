import type { PartyDefinition } from "@/lib/parties";
import type { RoundTally, Transfer } from "@/lib/simulation";

export type ResultsPayload = {
  parties: PartyDefinition[];
  threshold: number;
  parliamentSeats: number;
  totalBallots: number;
  firstPreferences: RoundTally[];
  eligibleParties: string[];
  eliminatedParties: string[];
  transfers: Transfer[];
  finalResult: RoundTally[];
  exhaustedVotes: number;
  seats: Array<{ partyId: string; seats: number }>;
};
