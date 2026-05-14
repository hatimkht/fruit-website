/**
 * Vorgefertigte Demo-Ergebnisse – werden verwendet, wenn keine echten
 * Datenbankdaten vorhanden sind. Simuliert eine realistische Wahl mit
 * ~1.200 abgegebenen Stimmzetteln.
 */

import type { ResultsPayload } from "@/types/results";
import { PARTIES, ELECTION_THRESHOLD, PARLIAMENT_SEATS } from "@/lib/parties";

const activeParties = PARTIES.filter((p) => p.active);

export const DEMO_RESULTS: ResultsPayload = {
  parties: activeParties,
  threshold: ELECTION_THRESHOLD,
  parliamentSeats: PARLIAMENT_SEATS,
  totalBallots: 1247,

  // Rohverteilung der Erststimmen (vor Sperrklausel)
  firstPreferences: [
    { partyId: "cdu-csu",      votes: 336, share: 0.2695 },
    { partyId: "spd",          votes: 261, share: 0.2093 },
    { partyId: "afd",          votes: 211, share: 0.1692 },
    { partyId: "gruene",       votes: 162, share: 0.1299 },
    { partyId: "fdp",          votes:  87, share: 0.0698 },
    { partyId: "bsw",          votes:  74, share: 0.0594 },
    { partyId: "linke",        votes:  49, share: 0.0393 },
    { partyId: "freie-waehler",votes:  28, share: 0.0225 },
    { partyId: "volt",         votes:  21, share: 0.0168 },
    { partyId: "partei",       votes:  12, share: 0.0096 },
    { partyId: "oedp",         votes:   9, share: 0.0072 },
    { partyId: "tierschutz",   votes:   7, share: 0.0056 },
  ],

  // Parteien, die die 5%-Hürde übersprungen haben
  eligibleParties: ["cdu-csu", "spd", "afd", "gruene", "fdp", "bsw"],

  // Parteien, die an der 5%-Hürde gescheitert sind
  eliminatedParties: [
    "linke",
    "freie-waehler",
    "volt",
    "partei",
    "oedp",
    "tierschutz",
  ],

  // Stimmübertragungen von eliminierten Parteien
  transfers: [
    // Linke → SPD (Rang 2)
    { fromPartyId: "linke",         toPartyId: "spd",     rank: 2, votes: 31 },
    { fromPartyId: "linke",         toPartyId: "gruene",  rank: 2, votes: 11 },
    { fromPartyId: "linke",         toPartyId: null,      rank: null, votes: 7 },
    // Freie Wähler → CDU/CSU (Rang 2)
    { fromPartyId: "freie-waehler", toPartyId: "cdu-csu", rank: 2, votes: 19 },
    { fromPartyId: "freie-waehler", toPartyId: "fdp",     rank: 2, votes:  6 },
    { fromPartyId: "freie-waehler", toPartyId: null,      rank: null, votes: 3 },
    // Volt → Grüne (Rang 2)
    { fromPartyId: "volt",          toPartyId: "gruene",  rank: 2, votes: 14 },
    { fromPartyId: "volt",          toPartyId: "spd",     rank: 2, votes:  5 },
    { fromPartyId: "volt",          toPartyId: null,      rank: null, votes: 2 },
    // Die PARTEI → Grüne (Rang 2)
    { fromPartyId: "partei",        toPartyId: "gruene",  rank: 2, votes:  7 },
    { fromPartyId: "partei",        toPartyId: "spd",     rank: 2, votes:  3 },
    { fromPartyId: "partei",        toPartyId: null,      rank: null, votes: 2 },
    // ÖDP → Grüne (Rang 2)
    { fromPartyId: "oedp",          toPartyId: "gruene",  rank: 2, votes:  7 },
    { fromPartyId: "oedp",          toPartyId: null,      rank: null, votes: 2 },
    // Tierschutzpartei → Grüne (Rang 2)
    { fromPartyId: "tierschutz",    toPartyId: "gruene",  rank: 2, votes:  5 },
    { fromPartyId: "tierschutz",    toPartyId: null,      rank: null, votes: 2 },
  ],

  // Endergebnis nach Übertragung (normalisiert auf Gesamtstimmen)
  finalResult: [
    { partyId: "cdu-csu", votes: 355, share: 0.2847 },
    { partyId: "spd",     votes: 300, share: 0.2406 },
    { partyId: "afd",     votes: 211, share: 0.1692 },
    { partyId: "gruene",  votes: 206, share: 0.1652 },
    { partyId: "fdp",     votes:  93, share: 0.0746 },
    { partyId: "bsw",     votes:  74, share: 0.0594 },
  ],

  exhaustedVotes: 18,

  // Sitzverteilung (120 Sitze, D'Hondt-ähnlich)
  seats: [
    { partyId: "cdu-csu", seats: 34 },
    { partyId: "spd",     seats: 29 },
    { partyId: "afd",     seats: 20 },
    { partyId: "gruene",  seats: 20 },
    { partyId: "fdp",     seats:  9 },
    { partyId: "bsw",     seats:  8 },
  ],
};
