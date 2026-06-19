/* =========================
   TYPES
========================= */

export type BookingCase =
  | "default"
  | "unzufrieden"
  | "nachzahlung"
  | "umzug";

export type QuestionType = "choice" | "text";

export interface BookingQuestion {
  id: string;
  question: string;
  type: QuestionType;

  options?: string[];

  placeholder?: string;

  allowOther?: boolean;
  otherLabel?: string;
  otherPlaceholder?: string;
}

export interface BookingIntro {
  title: string;
  description: string;
  buttonText: string;
  image?: string;
}

/* =========================
   SHARED OPTIONS
========================= */

export const bookingIntros: Record<BookingCase, BookingIntro> = {
  default: {
    title: "Herzlich Willkommen bei StromDealz",
    description: "Schön, dass Sie da sind! Gemeinsam finden wir in wenigen Schritten den optimalen Tarif für Ihre Bedürfnisse. Lassen Sie uns direkt starten.",
    buttonText: "Jetzt starten",
    image: "/images/placeholder-default.png",
  },
  unzufrieden: {
    title: "Schluss mit zu hohen Kosten!",
    description: "Sie sind unzufrieden mit Ihrem aktuellen Anbieter? Wir helfen Ihnen, eine günstigere und bessere Alternative zu finden. Beantworten Sie uns dazu ein paar kurze Fragen.",
    buttonText: "Sparpotenzial prüfen",
    image: "/images/placeholder-unzufrieden.png",
  },
  nachzahlung: {
    title: "Nachzahlung erhalten? Keine Sorge!",
    description: "Hohe Nachzahlungen sind ärgerlich, aber oft vermeidbar. Wir analysieren Ihre Situation und zeigen Ihnen, wie Sie künftig deutlich weniger zahlen.",
    buttonText: "Analyse starten",
    image: "/images/placeholder-nachzahlung.png",
  },
  umzug: {
    title: "Umzugsservice: Stressfrei anmelden",
    description: "Ein Umzug ist schon stressig genug. Wir kümmern uns darum, dass Sie in Ihrem neuen Zuhause sofort vom besten Tarif profitieren. Schnell und unkompliziert.",
    buttonText: "Umzug anmelden",
    image: "/images/placeholder-umzug.png",
  },
};

export const PROVIDERS = [
  "E.on",
  "Vattenfall",
  "NEW",
  "eprimo",
  "Verivox",
  "Anbieter nicht gelistet",
];

export const CONSUMPTION = [
  "unter 2.000 kWh",
  "unter 5.000 kWh",
  "unter 15.000 kWh",
  "über 15.000 kWh",
];

/* =========================
   BOOKING STEPS (MAIN EXPORT)
========================= */

export const bookingSteps: Record<
  BookingCase,
  BookingQuestion[]
> = {
  /* ---------- DEFAULT ---------- */
  default: [
    {
      id: "name",
      question: "Wie heißen Sie?",
      type: "text",
      placeholder: "Vorname Nachname",
    },
    {
      id: "customerType",
      question: "Sind Sie Privatkunde oder Geschäftlicher Kunde?",
      type: "choice",
      options: ["Privat", "Geschäftlich"],
    },
    {
      id: "contractType",
      question: "Um welchen Vertrag geht es?",
      type: "choice",
      options: ["Strom", "Gas", "Beides"],
    },
    {
      id: "alreadyAdvised",
      question: "Wurden Sie bereits von StromDealz beraten?",
      type: "choice",
      options: ["Ja", "Nein"],
    },
    {
      id: "hasRunningContract",
      question: "Haben Sie noch einen laufenden Vertrag?",
      type: "choice",
      options: ["Ja", "Nein"],
    },
    {
      id: "provider",
      question: "Wer ist Ihr aktueller Anbieter?",
      type: "choice",
      options: PROVIDERS,
      allowOther: true,
      otherLabel: "Sonstige",
      otherPlaceholder: "Bitte Anbieter eingeben",
    },
  ],

  /* ---------- UNZUFRIEDEN ---------- */
  unzufrieden: [
    {
      id: "name",
      question: "Wie heißen Sie?",
      type: "text",
      placeholder: "Vorname Nachname",
    },
    {
      id: "customerType",
      question: "Sind Sie Privatkunde oder Geschäftlicher Kunde?",
      type: "choice",
      options: ["Privat", "Geschäftlich"],
    },
    {
      id: "contractType",
      question: "Um welchen Vertrag geht es?",
      type: "choice",
      options: ["Strom", "Gas", "Beides zu teuer"],
    },
    {
      id: "consumption",
      question: "Wie hoch ist Ihr jährlicher Verbrauch geschätzt?",
      type: "choice",
      options: CONSUMPTION,
    },
    {
      id: "provider",
      question: "Wer ist Ihr aktueller Anbieter?",
      type: "choice",
      options: PROVIDERS,
      allowOther: true,
      otherLabel: "Sonstige",
      otherPlaceholder: "Bitte Anbieter eingeben",
    },
    {
      id: "alreadyAdvised",
      question: "Wurden Sie bereits von StromDealz beraten?",
      type: "choice",
      options: ["Ja", "Nein"],
    },
  ],

  /* ---------- NACHZAHLUNG ---------- */
  nachzahlung: [
    {
      id: "name",
      question: "Wie heißen Sie?",
      type: "text",
      placeholder: "Vorname Nachname",
    },
    {
      id: "customerType",
      question: "Sind Sie Privatkunde oder Geschäftlicher Kunde?",
      type: "choice",
      options: ["Privat", "Geschäftlich"],
    },
    {
      id: "contractType",
      question: "Um welchen Vertrag geht es?",
      type: "choice",
      options: ["Strom", "Gas", "Beides"],
    },
    {
      id: "payback",
      question: "Wie hoch sind Ihre Nachzahlungen?",
      type: "choice",
      options: [
        "weniger als 100 €",
        "zwischen 100 € und 300 €",
        "über 300 €",
      ],
    },
    {
      id: "provider",
      question: "Wer ist Ihr aktueller Anbieter?",
      type: "choice",
      options: PROVIDERS,
      allowOther: true,
      otherLabel: "Sonstige",
      otherPlaceholder: "Bitte Anbieter eingeben",
    },
    {
      id: "hasRunningContract",
      question: "Haben Sie noch einen laufenden Vertrag?",
      type: "choice",
      options: ["Ja", "Nein"],
    },
    {
      id: "alreadyAdvised",
      question: "Wurden Sie bereits von StromDealz beraten?",
      type: "choice",
      options: ["Ja", "Nein"],
    },
  ],

  /* ---------- UMZUG ---------- */
  umzug: [
    {
      id: "name",
      question: "Wie heißen Sie?",
      type: "text",
      placeholder: "Vorname Nachname",
    },
    {
      id: "customerType",
      question: "Sind Sie Privatkunde oder Geschäftlicher Kunde?",
      type: "choice",
      options: ["Privat", "Geschäftlich"],
    },
    {
      id: "zip",
      question: "Geben Sie Ihre neue Postleitzahl an.",
      type: "text",
      placeholder: "z. B. 41065",
    },
    {
      id: "contractType",
      question: "Um welchen Vertrag geht es?",
      type: "choice",
      options: ["Strom", "Gas", "Beides"],
    },
    {
      id: "consumption",
      question: "Wie hoch war Ihr bisheriger jährlicher Verbrauch geschätzt?",
      type: "choice",
      options: CONSUMPTION,
    },
    {
      id: "hasRunningContract",
      question: "Haben Sie noch einen laufenden Vertrag?",
      type: "choice",
      options: ["Ja", "Nein"],
    },
    {
      id: "alreadyAdvised",
      question: "Wurden Sie bereits von StromDealz beraten?",
      type: "choice",
      options: ["Ja", "Nein"],
    },
  ],
};
