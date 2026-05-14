/**
 * Central party catalog.
 *
 * Parties are intentionally declared here (not hardcoded in components) so the
 * demo can be re-used with a different set: edit this file, run the seed, and
 * every view follows. `active: false` hides a party everywhere without losing
 * historical votes.
 *
 * Colors are chosen to sit quietly against the paper-tone surface — slightly
 * desaturated from the canonical brand hues so the charts read institutional
 * rather than partisan.
 */

export type PartyDefinition = {
  id: string;
  shortName: string;
  fullName: string;
  color: string;
  order: number;
  active: boolean;
};

export const PARTIES: PartyDefinition[] = [
  {
    id: "cdu-csu",
    shortName: "CDU/CSU",
    fullName: "Christlich Demokratische Union / Christlich-Soziale Union",
    color: "#1C1C1C",
    order: 1,
    active: true,
  },
  {
    id: "spd",
    shortName: "SPD",
    fullName: "Sozialdemokratische Partei Deutschlands",
    color: "#C8102E",
    order: 2,
    active: true,
  },
  {
    id: "gruene",
    shortName: "Grüne",
    fullName: "Bündnis 90/Die Grünen",
    color: "#3C8F2B",
    order: 3,
    active: true,
  },
  {
    id: "fdp",
    shortName: "FDP",
    fullName: "Freie Demokratische Partei",
    color: "#C9A227",
    order: 4,
    active: true,
  },
  {
    id: "afd",
    shortName: "AfD",
    fullName: "Alternative für Deutschland",
    color: "#1D8BC7",
    order: 5,
    active: true,
  },
  {
    id: "linke",
    shortName: "Linke",
    fullName: "Die Linke",
    color: "#A93275",
    order: 6,
    active: true,
  },
  {
    id: "bsw",
    shortName: "BSW",
    fullName: "Bündnis Sahra Wagenknecht",
    color: "#6E4B8E",
    order: 7,
    active: true,
  },
  {
    id: "freie-waehler",
    shortName: "Freie Wähler",
    fullName: "Freie Wähler",
    color: "#D98824",
    order: 8,
    active: true,
  },
  {
    id: "volt",
    shortName: "Volt",
    fullName: "Volt Deutschland",
    color: "#4B2173",
    order: 9,
    active: true,
  },
  {
    id: "partei",
    shortName: "Die PARTEI",
    fullName: "Partei für Arbeit, Rechtsstaat, Tierschutz, Elitenförderung und basisdemokratische Initiative",
    color: "#9E2029",
    order: 10,
    active: true,
  },
  {
    id: "oedp",
    shortName: "ÖDP",
    fullName: "Ökologisch-Demokratische Partei",
    color: "#D36A1E",
    order: 11,
    active: true,
  },
  {
    id: "tierschutz",
    shortName: "Tierschutzpartei",
    fullName: "Partei Mensch Umwelt Tierschutz",
    color: "#2C5F8D",
    order: 12,
    active: true,
  },
];

/** The legal threshold applied in the simulation. Single source of truth. */
export const ELECTION_THRESHOLD = 0.05;

/** Parliament size for the seat-distribution visualization (Bundestag-like). */
export const PARLIAMENT_SEATS = 120;
