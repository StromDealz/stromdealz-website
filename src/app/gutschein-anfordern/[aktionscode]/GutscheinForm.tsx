"use client";

import { FormEvent, useState } from "react";

type GutscheinFormProps = {
  aktionscode: string;
  gutscheinwert: number;
  gutscheinTitel: string;
};

type SubmitStatus = "idle" | "sending" | "success" | "error";

export default function GutscheinForm({
  aktionscode,
  gutscheinwert,
  gutscheinTitel,
}: GutscheinFormProps) {
  const formatGutscheinwert = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(gutscheinwert);
  const [anrede, setAnrede] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [auftragsnummer, setAuftragsnummer] = useState("");
  const [abrechnungsnachweis, setAbrechnungsnachweis] =
    useState<File | null>(null);

  const [agbAccepted, setAgbAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [billingConfirmed, setBillingConfirmed] = useState(false);

  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [feedback, setFeedback] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setFeedback("");

    if (
      !anrede ||
      !name.trim() ||
      !email.trim() ||
      !auftragsnummer.trim() ||
      !abrechnungsnachweis ||
      !agbAccepted ||
      !privacyAccepted ||
      !billingConfirmed
    ) {
      setStatus("error");
      setFeedback("Bitte füllen Sie alle Pflichtfelder vollständig aus.");
      return;
    }

    const formData = new FormData();
    formData.append("aktionscode", aktionscode);
    formData.append("anrede", anrede);
    formData.append("name", name.trim());
    formData.append("email", email.trim());
    formData.append("auftragsnummer", auftragsnummer.trim());
    formData.append("agbAccepted", String(agbAccepted));
    formData.append("privacyAccepted", String(privacyAccepted));
    formData.append("billingConfirmed", String(billingConfirmed));
    formData.append("abrechnungsnachweis", abrechnungsnachweis);

    try {
      const response = await fetch("/api/gutschein-anfordern", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        setStatus("error");
        setFeedback(
          result?.message ||
            "Beim Absenden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut."
        );
        return;
      }

      setStatus("success");
      setFeedback(
        "Ihre Gutscheinanforderung wurde erfolgreich übermittelt. Nach erfolgreicher Prüfung erhalten Sie Ihren Gutscheincode per E-Mail."
      );

      setAnrede("");
      setName("");
      setEmail("");
      setAuftragsnummer("");
      setAbrechnungsnachweis(null);
      setAgbAccepted(false);
      setPrivacyAccepted(false);
      setBillingConfirmed(false);
      setFileInputKey((previous) => previous + 1);
    } catch (error) {
      console.error("Fehler beim Senden der Gutscheinanforderung:", error);

      setStatus("error");
      setFeedback(
        "Beim Absenden ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es erneut."
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <input type="hidden" name="aktionscode" value={aktionscode} />

      {/* AKTIONSWERT */}
      <section className="rounded-[28px] border border-orange-200 bg-orange-50/70 p-4 shadow-sm sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
          Ihre Gutscheinaktion
        </p>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
              {gutscheinTitel}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-700">
              Dieser Wert ist für Ihren Aktionscode hinterlegt und wird nach erfolgreicher Prüfung berücksichtigt.
            </p>
          </div>

          <div className="shrink-0 rounded-2xl bg-white px-5 py-3 text-3xl font-black tracking-tight text-orange-700 shadow-sm ring-1 ring-orange-100">
            {formatGutscheinwert}
          </div>
        </div>
      </section>

      {/* PERSÖNLICHE ANGABEN */}
      <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
            Ihre Angaben
          </p>

          <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
            Gutscheinanforderung einreichen
          </h3>
        </div>

        <div className="space-y-6">
          
          {/* Name + Auftragsnummer */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-slate-900"
              >
                Vollständiger Name <span className="text-orange-600">*</span>
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Vorname Nachname"
                required
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-base text-slate-950 outline-none transition-all placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div>
              <label
                htmlFor="auftragsnummer"
                className="mb-2 block text-sm font-semibold text-slate-900"
              >
                Auftragsnummer <span className="text-orange-600">*</span>
              </label>

              <input
                id="auftragsnummer"
                name="auftragsnummer"
                type="text"
                value={auftragsnummer}
                onChange={(event) => setAuftragsnummer(event.target.value)}
                placeholder="Ihre Auftragsnummer"
                required
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-base text-slate-950 outline-none transition-all placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
              />
            </div>
          </div>

          {/* E-Mail */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-900"
            >
              E-Mail-Adresse <span className="text-orange-600">*</span>
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@beispiel.de"
              required
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-base text-slate-950 outline-none transition-all placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
            />

            <div className="mt-3 flex gap-3 rounded-2xl border border-blue-100 bg-blue-50/80 px-4 py-3.5 text-sm leading-6 text-slate-700">
              <span className="mt-[2px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                i
              </span>

              <p>
                Diese E-Mail-Adresse benötigen wir, um Ihnen Ihren
                Gutscheincode nach erfolgreicher Prüfung zusenden zu können.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NACHWEIS */}
      <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
            Nachweis hochladen
          </p>

          <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
            Abrechnung des neuen Versorgers
          </h3>
        </div>

        <div>
          <label
            htmlFor="abrechnungsnachweis"
            className="group flex cursor-pointer flex-col items-center justify-center rounded-[26px] border-2 border-dashed border-slate-300 bg-slate-50/70 px-5 py-8 text-center transition-all duration-200 hover:border-orange-400 hover:bg-orange-50/40 sm:py-10"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 transition group-hover:bg-orange-200">
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v12" />
                <path d="m7 10 5 5 5-5" />
                <path d="M5 21h14" />
              </svg>
            </div>

            <p className="mt-4 text-base font-semibold text-slate-950">
              Datei auswählen oder hier ablegen
            </p>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
              Bitte laden Sie einen Nachweis hoch, aus dem hervorgeht, dass Ihr
              neuer Versorger mindestens einmal abgerechnet hat.
            </p>

            <span className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm ring-1 ring-orange-100">
              PDF, JPG, JPEG, PNG oder WEBP
            </span>
          </label>

          <input
            key={fileInputKey}
            id="abrechnungsnachweis"
            name="abrechnungsnachweis"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
            required
            onChange={(event) =>
              setAbrechnungsnachweis(event.target.files?.[0] ?? null)
            }
            className="sr-only"
          />

          <div className="mt-3 flex flex-col gap-2 text-sm leading-6 text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <p>Maximale Dateigröße: 10 MB.</p>

            {abrechnungsnachweis && (
              <p className="font-semibold text-emerald-700">
                Datei ausgewählt: {abrechnungsnachweis.name}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ZUSTIMMUNGEN */}
      <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="space-y-4">
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-orange-200 hover:bg-orange-50/30">
            <input
              type="checkbox"
              checked={billingConfirmed}
              onChange={(event) => setBillingConfirmed(event.target.checked)}
              required
              className="mt-1 h-5 w-5 shrink-0 rounded border-slate-300 text-orange-600 focus:ring-orange-400"
            />

            <span className="text-sm leading-7 text-slate-700">
              Ich bestätige, dass mein neuer Versorger bereits mindestens
              einmal abgerechnet hat und dass der hochgeladene Nachweis diese
              Voraussetzung belegt. <span className="text-orange-600">*</span>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-orange-200 hover:bg-orange-50/30">
            <input
              type="checkbox"
              checked={agbAccepted}
              onChange={(event) => setAgbAccepted(event.target.checked)}
              required
              className="mt-1 h-5 w-5 shrink-0 rounded border-slate-300 text-orange-600 focus:ring-orange-400"
            />

            <span className="text-sm leading-7 text-slate-700">
              Ich habe die{" "}
              <a
                href="/agb#paragraf-15-teilnahmebedingungen-zu-gutschein-und-prämienaktionen"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-orange-700 underline decoration-orange-300 underline-offset-4 transition hover:text-orange-800"
              >
                Teilnahmebedingungen zu Gutschein und Prämienaktionen in den
                AGB
              </a>{" "}
              gelesen und akzeptiere diese.{" "}
              <span className="text-orange-600">*</span>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-orange-200 hover:bg-orange-50/30">
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={(event) => setPrivacyAccepted(event.target.checked)}
              required
              className="mt-1 h-5 w-5 shrink-0 rounded border-slate-300 text-orange-600 focus:ring-orange-400"
            />

            <span className="text-sm leading-7 text-slate-700">
              Ich habe die{" "}
              <a
                href="/datenschutz"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-orange-700 underline decoration-orange-300 underline-offset-4 transition hover:text-orange-800"
              >
                Datenschutzerklärung
              </a>{" "}
              zur Kenntnis genommen.{" "}
              <span className="text-orange-600">*</span>
            </span>
          </label>
        </div>
      </section>

      {/* STATUS */}
      {feedback && (
        <div
          className={`rounded-[24px] border px-5 py-4 text-sm leading-7 shadow-sm ${
            status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-950"
              : "border-red-200 bg-red-50 text-red-950"
          }`}
        >
          {feedback}
        </div>
      )}

      {/* ABSENDEN */}
      <div className="pt-1">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-orange-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-700 hover:shadow-xl hover:shadow-orange-200 focus:outline-none focus:ring-4 focus:ring-orange-200 disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-slate-400 disabled:shadow-none"
        >
          {status === "sending"
            ? "Wird übermittelt..."
            : "Gutscheinanforderung absenden"}
        </button>
      </div>
    </form>
  );
}