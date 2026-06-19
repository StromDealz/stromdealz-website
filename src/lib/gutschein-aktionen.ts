export const GUTSCHEIN_AKTIONEN = {
  k7p4v2x9: {
    code: "k7p4v2x9",
    gutscheinwert: 50,
    titel: "50 € Wunschgutschein",
    beschreibung:
      "Diese Gutscheinanforderung gilt für eine von StromDealz bestätigte 50 € Gutschein Aktion.",
  },
 m8q6r3t1: {
  code: "m8q6r3t1",
  gutscheinwert: 25,
  titel: "25 € Wunschgutschein",
  beschreibung:
    "Diese Gutscheinanforderung gilt für eine von StromDealz bestätigte 25 € Gutschein Aktion.",
},
} as const;

export type GutscheinAktionscode = keyof typeof GUTSCHEIN_AKTIONEN;

export function getGutscheinAktion(aktionscode: string) {
  return GUTSCHEIN_AKTIONEN[
    aktionscode as GutscheinAktionscode
  ] ?? null;
}