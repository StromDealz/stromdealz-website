"use client";

import { useState } from "react";

type SubmitStatus = "idle" | "sending" | "success" | "error";
type ContractCategory = "" | "Stromvertrag" | "Gasvertrag" | "Beides";

function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        aria-label={text}
        className="group ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 bg-slate-50 text-xs font-bold text-slate-600 transition hover:border-[#f28c28] hover:bg-orange-50 hover:text-[#f28c28] focus:border-[#f28c28] focus:bg-orange-50 focus:text-[#f28c28] focus:outline-none focus:ring-4 focus:ring-orange-100"
      >
        ?
        <span className="pointer-events-none absolute left-1/2 top-7 z-20 hidden w-72 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-4 text-left text-xs font-medium leading-5 text-slate-700 shadow-xl group-hover:block group-focus:block">
          {text}
        </span>
      </button>
    </span>
  );
}

function NumberFields({
  type,
  title,
  description,
  meterName,
  maloName,
  color
}: {
  type: "strom" | "gas";
  title: string;
  description: string;
  meterName: string;
  maloName: string;
  color: "blue" | "orange";
}) {
  const isBlue = color === "blue";

  return (
    <div
      className={[
        "rounded-3xl border p-5",
        isBlue
          ? "border-blue-200 bg-blue-50/70"
          : "border-orange-200 bg-orange-50/80"
      ].join(" ")}
    >
      <div className="mb-5">
        <p
          className={[
            "mb-1 text-xs font-bold uppercase tracking-[0.18em]",
            isBlue ? "text-blue-700" : "text-orange-700"
          ].join(" ")}
        >
          {type === "strom" ? "Strom" : "Gas"}
        </p>

        <h2 className="text-xl font-bold text-[#1f2f46]">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          {description}
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label
            htmlFor={meterName}
            className="mb-2 flex items-center text-sm font-semibold text-slate-800"
          >
            Zählernummer
            <InfoTooltip text="Die Zählernummer steht direkt auf dem Strom oder Gaszähler, häufig neben einem Barcode oder der Bezeichnung Zählernummer, Gerätenummer oder Eigentumsnummer; sie kann aus Zahlen und Buchstaben bestehen und ist je nach Netzbetreiber unterschiedlich lang." />
          </label>

          <input
            id={meterName}
            name={meterName}
            type="text"
            placeholder={
              type === "strom"
                ? "Zählernummer Strom eintragen"
                : "Zählernummer Gas eintragen"
            }
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#f28c28] focus:ring-4 focus:ring-orange-100"
          />
        </div>

        <div>
          <label
            htmlFor={maloName}
            className="mb-2 flex items-center text-sm font-semibold text-slate-800"
          >
            MaLo ID
            <InfoTooltip text="Die MaLo ID ist die Marktlokations ID Ihrer Verbrauchsstelle, besteht in der Regel aus 11 Ziffern und steht häufig in der Vertragsbestätigung, auf Abrechnungen oder in Schreiben des Netzbetreibers." />
          </label>

          <input
            id={maloName}
            name={maloName}
            type="text"
            inputMode="numeric"
            placeholder={
              type === "strom"
                ? "MaLo ID Strom eintragen"
                : "MaLo ID Gas eintragen"
            }
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#f28c28] focus:ring-4 focus:ring-orange-100"
          />
        </div>
      </div>
    </div>
  );
}

export default function NachreichenPage() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [category, setCategory] = useState<ContractCategory>("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus("sending");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      fullName: String(formData.get("fullName") || "").trim(),
      orderNumber: String(formData.get("orderNumber") || "").trim(),
      category: String(formData.get("category") || "").trim(),

      electricityMeterNumber: String(formData.get("electricityMeterNumber") || "").trim(),
      electricityMaloId: String(formData.get("electricityMaloId") || "").trim(),

      gasMeterNumber: String(formData.get("gasMeterNumber") || "").trim(),
      gasMaloId: String(formData.get("gasMaloId") || "").trim(),

      notes: String(formData.get("notes") || "").trim(),
      website: String(formData.get("website") || "").trim()
    };

    try {
      const response = await fetch("/api/nachreichen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Die Daten konnten nicht gesendet werden.");
      }

      setStatus("success");
      form.reset();
      setCategory("");

      window.setTimeout(() => {
        window.location.href = "/";
      }, 2800);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb] px-4 py-10">
      <section className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-lg sm:p-8">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#f28c28]">
            StromDealz
          </p>

          <h1 className="text-3xl font-bold text-[#1f2f46] sm:text-4xl">
            Zählernummer oder MaLo ID nachreichen
          </h1>

          <p className="mt-4 text-base leading-7 text-slate-600">
            Bitte tragen Sie Ihre Daten ein, damit wir Ihre Angaben eindeutig zuordnen können.
            Die Auftragsnummer ist hilfreich, falls sie Ihnen bereits vorliegt.
          </p>
        </div>

        {status === "success" ? (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
            <h2 className="text-2xl font-bold text-green-800">
              Daten wurden erfolgreich nachgesendet
            </h2>
            <p className="mt-3 text-green-700">
              Sie werden automatisch zur StromDealz Startseite weitergeleitet.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="hidden">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div>
              <label htmlFor="fullName" className="mb-2 block text-sm font-semibold text-slate-800">
                Vollständiger Name *
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                autoComplete="name"
                placeholder="Vorname und Nachname"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-[#f28c28] focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div>
              <label htmlFor="orderNumber" className="mb-2 block text-sm font-semibold text-slate-800">
                Auftragsnummer, falls bekannt
              </label>
              <input
                id="orderNumber"
                name="orderNumber"
                type="text"
                placeholder="Zum Beispiel SD12345"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-[#f28c28] focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <fieldset>
              <legend className="mb-3 block text-sm font-semibold text-slate-800">
                Worum geht es? *
              </legend>

              <div className="grid gap-3 sm:grid-cols-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-300 p-4 transition hover:border-[#f28c28]">
                  <input
                    type="radio"
                    name="category"
                    value="Stromvertrag"
                    required
                    checked={category === "Stromvertrag"}
                    onChange={() => setCategory("Stromvertrag")}
                    className="h-4 w-4 accent-[#f28c28]"
                  />
                  <span className="text-sm font-medium text-slate-800">Stromvertrag</span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-300 p-4 transition hover:border-[#f28c28]">
                  <input
                    type="radio"
                    name="category"
                    value="Gasvertrag"
                    required
                    checked={category === "Gasvertrag"}
                    onChange={() => setCategory("Gasvertrag")}
                    className="h-4 w-4 accent-[#f28c28]"
                  />
                  <span className="text-sm font-medium text-slate-800">Gasvertrag</span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-300 p-4 transition hover:border-[#f28c28]">
                  <input
                    type="radio"
                    name="category"
                    value="Beides"
                    required
                    checked={category === "Beides"}
                    onChange={() => setCategory("Beides")}
                    className="h-4 w-4 accent-[#f28c28]"
                  />
                  <span className="text-sm font-medium text-slate-800">Beides</span>
                </label>
              </div>
            </fieldset>

            {category === "Stromvertrag" && (
              <NumberFields
                type="strom"
                title="Angaben zum Stromvertrag"
                description="Bitte tragen Sie hier die Zählernummer oder MaLo ID für Ihren Stromvertrag ein."
                meterName="electricityMeterNumber"
                maloName="electricityMaloId"
                color="blue"
              />
            )}

            {category === "Gasvertrag" && (
              <NumberFields
                type="gas"
                title="Angaben zum Gasvertrag"
                description="Bitte tragen Sie hier die Zählernummer oder MaLo ID für Ihren Gasvertrag ein."
                meterName="gasMeterNumber"
                maloName="gasMaloId"
                color="orange"
              />
            )}

            {category === "Beides" && (
              <div className="grid gap-5 lg:grid-cols-2">
                <NumberFields
                  type="strom"
                  title="Angaben zum Stromvertrag"
                  description="Diese Felder sind nur für den Stromvertrag vorgesehen."
                  meterName="electricityMeterNumber"
                  maloName="electricityMaloId"
                  color="blue"
                />

                <NumberFields
                  type="gas"
                  title="Angaben zum Gasvertrag"
                  description="Diese Felder sind nur für den Gasvertrag vorgesehen."
                  meterName="gasMeterNumber"
                  maloName="gasMaloId"
                  color="orange"
                />
              </div>
            )}

            <div>
              <label htmlFor="notes" className="mb-2 block text-sm font-semibold text-slate-800">
                Sonstiges
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={5}
                placeholder="Falls etwas anderes vereinbart wurde, bitte hier eintragen."
                className="w-full resize-none rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-[#f28c28] focus:ring-4 focus:ring-orange-100"
              />
            </div>

            {status === "error" && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-2xl bg-[#f28c28] px-5 py-4 text-base font-bold text-white shadow-md transition hover:bg-[#df7c1d] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "sending" ? "Daten werden gesendet..." : "Daten nachreichen"}
            </button>

            <p className="text-center text-xs leading-6 text-slate-500">
              Mit dem Absenden werden die Angaben zur Bearbeitung Ihrer Anfrage an StromDealz übermittelt.
            </p>
          </form>
        )}
      </section>
    </main>
  );
}