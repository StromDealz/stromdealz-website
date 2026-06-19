"use client";

import { useRef, useState } from "react";

export default function EmpfehlungPage() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const [contactPermission, setContactPermission] = useState("");
  const [loading, setLoading] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [error, setError] = useState("");

  function resetRecommendedPersonFields() {
    const form = formRef.current;

    if (!form) {
      return;
    }

    const referredName = form.elements.namedItem("referredName") as HTMLInputElement | null;
    const referredEmail = form.elements.namedItem("referredEmail") as HTMLInputElement | null;
    const referredPhone = form.elements.namedItem("referredPhone") as HTMLInputElement | null;
    const message = form.elements.namedItem("message") as HTMLTextAreaElement | null;
    const consent = form.elements.namedItem("consent") as HTMLInputElement | null;
    const contactRadios = form.elements.namedItem("contactPermission") as RadioNodeList | null;

    if (referredName) referredName.value = "";
    if (referredEmail) referredEmail.value = "";
    if (referredPhone) referredPhone.value = "";
    if (message) message.value = "";
    if (consent) consent.checked = false;

    if (contactRadios && typeof contactRadios.forEach === "function") {
      contactRadios.forEach((radio) => {
        if (radio instanceof HTMLInputElement) {
          radio.checked = false;
        }
      });
    }

    setContactPermission("");
  }

  function handleRecommendAnotherPerson() {
    resetRecommendedPersonFields();
    setSuccessModalOpen(false);
    setError("");

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    const payload = {
      referrerName: formData.get("referrerName"),
      referrerEmail: formData.get("referrerEmail"),
      referrerPhone: formData.get("referrerPhone"),
      referredName: formData.get("referredName"),
      referredEmail: formData.get("referredEmail"),
      contactPermission: formData.get("contactPermission"),
      referredPhone: formData.get("referredPhone"),
      consent: formData.get("consent") === "on",
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/empfehlung", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || "Die Empfehlung konnte nicht gesendet werden.");
      }

      setSuccessModalOpen(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Leider ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f9fc] px-4 py-12">
      {successModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl md:p-8">
            <button
              type="button"
              onClick={() => setSuccessModalOpen(false)}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-600 transition hover:bg-slate-200"
              aria-label="Fenster schließen"
            >
              ×
            </button>

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-2xl text-green-700">
              ✓
            </div>

            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-green-700">
              Empfehlung eingegangen
            </p>

            <h2 className="mb-4 text-2xl font-bold text-slate-900">
              Vielen Dank für Ihre Empfehlung.
            </h2>

            <p className="mb-4 text-base leading-relaxed text-slate-600">
              Ihre Empfehlung wurde erfolgreich an StromDealz übermittelt. Wir prüfen die Anfrage und kümmern uns um die weitere Bearbeitung.
            </p>

            <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
              Der Gutscheinanspruch entsteht erst, wenn durch Ihre Empfehlung ein erfolgreicher Strom oder Gasvertrag zustande kommt und der Vertrag aktiv in Belieferung ist. Erst danach kann der Gutschein freigegeben werden.
            </div>

            <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-relaxed text-blue-900">
              Sie können gerne mehrere Personen empfehlen. Für jede erfolgreiche Empfehlung kann ein eigener Gutscheinanspruch entstehen.
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleRecommendAnotherPerson}
                className="rounded-2xl bg-[#0f75bc] px-5 py-3 font-bold text-white transition hover:bg-[#0b609b]"
              >
                Weitere Person empfehlen
              </button>

              <button
                type="button"
                onClick={() => setSuccessModalOpen(false)}
                className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Fertig
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-lg md:p-10">
        <div className="mb-8 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#0f75bc]">
            StromDealz Treueaktion
          </p>

          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Weiterempfehlung einreichen und 50 € Gutschein sichern
          </h1>

          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Empfehlen Sie StromDealz weiter. Wenn durch Ihre Empfehlung ein erfolgreicher
            Strom oder Gasvertrag abgeschlossen wird und der Vertrag aktiv läuft, erhalten
            Sie als Dankeschön einen 50 € Gutschein.
          </p>

          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            Sie können beliebig viele Personen empfehlen. Für jede erfolgreiche Empfehlung
            kann ein eigener Gutscheinanspruch entstehen.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">
            {error}
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              Ihre Daten
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Ihr Name *
                </span>
                <input
                  name="referrerName"
                  type="text"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#0f75bc]"
                  placeholder="Max Mustermann"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Ihre E-Mail-Adresse *
                </span>
                <input
                  name="referrerEmail"
                  type="email"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#0f75bc]"
                  placeholder="max@example.de"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Ihre Telefonnummer optional
                </span>
                <input
                  name="referrerPhone"
                  type="tel"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#0f75bc]"
                  placeholder="0176 00000000"
                />
              </label>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              Wen möchten Sie empfehlen?
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Name der empfohlenen Person *
                </span>
                <input
                  name="referredName"
                  type="text"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#0f75bc]"
                  placeholder="Name der Person"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  E-Mail-Adresse der empfohlenen Person optional
                </span>
                <input
                  name="referredEmail"
                  type="email"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#0f75bc]"
                  placeholder="person@example.de"
                />
              </label>
            </div>

            <div className="mt-6">
              <p className="mb-3 font-medium text-slate-800">
                Wünschen Sie, dass wir die empfohlene Person direkt kontaktieren?
              </p>

              <div className="space-y-3">
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-[#0f75bc]/40 hover:bg-blue-50/30">
                  <input
                    type="radio"
                    name="contactPermission"
                    value="Ja"
                    required
                    onChange={(event) => setContactPermission(event.target.value)}
                    className="mt-1"
                  />
                  <span>
                    <span className="block font-medium text-slate-900">
                      Ja, bitte direkt kontaktieren
                    </span>
                    <span className="block text-sm text-slate-600">
                      Wir dürfen die empfohlene Person telefonisch kontaktieren.
                    </span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-[#0f75bc]/40 hover:bg-blue-50/30">
                  <input
                    type="radio"
                    name="contactPermission"
                    value="Nein"
                    required
                    onChange={(event) => setContactPermission(event.target.value)}
                    className="mt-1"
                  />
                  <span>
                    <span className="block font-medium text-slate-900">
                      Nein, die Person meldet sich eigenständig
                    </span>
                    <span className="block text-sm text-slate-600">
                      Die empfohlene Person nimmt selbst Kontakt mit StromDealz auf.
                    </span>
                  </span>
                </label>
              </div>
            </div>

            {contactPermission === "Ja" && (
              <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">
                    Telefonnummer der empfohlenen Person *
                  </span>
                  <input
                    name="referredPhone"
                    type="tel"
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#0f75bc]"
                    placeholder="0176 11111111"
                  />
                </label>

                <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-slate-700">
                  <input
                    name="consent"
                    type="checkbox"
                    required
                    className="mt-1"
                  />
                  <span>
                    Ich bestätige, dass die empfohlene Person mit der Weitergabe ihrer
                    Telefonnummer und einer Kontaktaufnahme durch StromDealz einverstanden ist.
                  </span>
                </label>
              </div>
            )}

            <label className="mt-6 block">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Zusätzliche Nachricht optional
              </span>
              <textarea
                name="message"
                rows={4}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#0f75bc]"
                placeholder="Zum Beispiel gewünschte Rückrufzeit oder kurze Info zur empfohlenen Person."
              />
            </label>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
            Der Gutscheinanspruch entsteht erst, wenn durch die Empfehlung ein erfolgreicher
            Strom oder Gasvertrag zustande kommt und der Vertrag aktiv in Belieferung ist.
            Eigenempfehlungen und Mehrfachmeldungen können ausgeschlossen werden.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#0f75bc] px-6 py-4 text-lg font-bold text-white transition hover:bg-[#0b609b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Wird gesendet..." : "Jetzt empfehlen!"}
          </button>
        </form>
      </section>
    </main>
  );
} 