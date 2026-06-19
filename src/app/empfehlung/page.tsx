"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function EmpfehlungPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [contactPermission, setContactPermission] = useState("");
  const [loading, setLoading] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [error, setError] = useState("");

  function scrollPageToTop() {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }

  function resetRecommendedPersonFields() {
    const form = formRef.current;
    if (!form) return;

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
        if (radio instanceof HTMLInputElement) radio.checked = false;
      });
    }

    setContactPermission("");
  }

  function handleRecommendAnotherPerson() {
    setSuccessModalOpen(false);
    setError("");
    resetRecommendedPersonFields();
    setTimeout(() => scrollPageToTop(), 100);
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || "Die Empfehlung konnte nicht gesendet werden.");
      }

      scrollPageToTop();
      setTimeout(() => setSuccessModalOpen(true), 200);
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
    <main className="min-h-screen bg-[#f7f9fc] px-3 py-8 sm:px-4 sm:py-12">
      <style>{`
        @keyframes modal-in {
          0%   { opacity: 0; transform: scale(0.88) translateY(24px); }
          60%  { opacity: 1; transform: scale(1.02) translateY(-4px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes overlay-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes check-pop {
          0%   { transform: scale(0) rotate(-12deg); opacity: 0; }
          60%  { transform: scale(1.2) rotate(4deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes confetti-fall {
          0%   { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(60px) rotate(360deg); opacity: 0; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer-bar {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .modal-enter {
          animation: modal-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .overlay-enter {
          animation: overlay-in 0.3s ease forwards;
        }
        .check-pop {
          animation: check-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both;
        }
        .slide-up-1 { animation: slide-up 0.4s ease 0.3s both; }
        .slide-up-2 { animation: slide-up 0.4s ease 0.4s both; }
        .slide-up-3 { animation: slide-up 0.4s ease 0.5s both; }
        .slide-up-4 { animation: slide-up 0.4s ease 0.6s both; }
        .confetti-dot {
          position: absolute;
          width: 8px; height: 8px;
          border-radius: 2px;
          animation: confetti-fall 0.9s ease-out both;
        }
        .shimmer-badge {
          background: linear-gradient(90deg, #0f75bc 0%, #38bdf8 40%, #0f75bc 60%, #0b609b 100%);
          background-size: 200% auto;
          animation: shimmer-bar 2.5s linear infinite;
        }
      `}</style>

      {successModalOpen && (
        <div className="overlay-enter fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-slate-950/60 backdrop-blur-sm sm:items-center sm:px-4 sm:py-8">
          <div className="modal-enter relative w-full max-w-lg rounded-t-3xl bg-white shadow-2xl overflow-hidden sm:rounded-3xl sm:mt-0">

            <div className="shimmer-badge h-1.5 w-full" />

            <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none overflow-hidden">
              {[
                { left: "15%", color: "#0f75bc", delay: "0.2s", rotate: "12deg" },
                { left: "30%", color: "#38bdf8", delay: "0.35s", rotate: "-8deg" },
                { left: "50%", color: "#fbbf24", delay: "0.1s", rotate: "20deg" },
                { left: "65%", color: "#34d399", delay: "0.4s", rotate: "-15deg" },
                { left: "80%", color: "#f472b6", delay: "0.25s", rotate: "5deg" },
                { left: "22%", color: "#a78bfa", delay: "0.45s", rotate: "-20deg" },
                { left: "72%", color: "#fb923c", delay: "0.15s", rotate: "30deg" },
              ].map((dot, i) => (
                <span
                  key={i}
                  className="confetti-dot"
                  style={{
                    left: dot.left,
                    top: "10px",
                    background: dot.color,
                    animationDelay: dot.delay,
                    transform: `rotate(${dot.rotate})`,
                  }}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => { setSuccessModalOpen(false); router.push("/"); }}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
              aria-label="Fenster schließen"
            >
              ×
            </button>

            <div className="px-5 pb-8 pt-7 sm:px-8 sm:pb-10 sm:pt-8">
              <div
                className="check-pop mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg sm:h-20 sm:w-20 sm:rounded-3xl"
                style={{ background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)" }}
              >
                <svg width="32" height="32" viewBox="0 0 40 40" fill="none" className="sm:w-10 sm:h-10">
                  <path
                    d="M8 20l9 9 15-17"
                    stroke="white"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="slide-up-1 text-center mb-5">
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-green-600">
                  Erfolgreich übermittelt
                </p>
                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl md:text-3xl">
                  Vielen Dank für Ihre Empfehlung!
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 sm:text-base">
                  Ihre Empfehlung wurde erfolgreich an StromDealz übermittelt. Wir prüfen die Anfrage und kümmern uns um die weitere Bearbeitung.
                </p>
              </div>

              <div className="slide-up-2 mb-3 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 sm:p-4">
                <span className="mt-0.5 text-lg sm:text-xl">🎁</span>
                <p className="text-sm leading-relaxed text-amber-900">
                  <strong>Ihr 50 € Gutschein:</strong> Der Anspruch entsteht, sobald durch Ihre Empfehlung ein Strom- oder Gasvertrag aktiv in Belieferung ist.
                </p>
              </div>

              <div className="slide-up-3 mb-5 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-3 sm:p-4">
                <span className="mt-0.5 text-lg sm:text-xl">💡</span>
                <p className="text-sm leading-relaxed text-blue-900">
                  Sie können beliebig viele Personen empfehlen — für jede erfolgreiche Empfehlung entsteht ein eigener Gutscheinanspruch.
                </p>
              </div>

              <div className="slide-up-4 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleRecommendAnotherPerson}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0f75bc] px-5 py-4 font-bold text-white transition hover:bg-[#0b609b] active:scale-95"
                >
                  <span>➕</span>
                  Weitere Person empfehlen
                </button>
                <button
                  type="button"
                  onClick={() => { setSuccessModalOpen(false); router.push("/"); }}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-bold text-slate-700 transition hover:bg-slate-50 active:scale-95"
                >
                  Fertig
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="mx-auto max-w-3xl rounded-2xl bg-white p-5 shadow-lg sm:rounded-3xl sm:p-8 md:p-10">
        <div className="mb-7 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#0f75bc] sm:text-sm sm:mb-3">
            StromDealz Treueaktion
          </p>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
            Weiterempfehlung einreichen und 50 € Gutschein sichern
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base sm:mt-4">
            Empfehlen Sie StromDealz weiter. Wenn durch Ihre Empfehlung ein erfolgreicher
            Strom oder Gasvertrag abgeschlossen wird und der Vertrag aktiv läuft, erhalten
            Sie als Dankeschön einen 50 € Gutschein.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-slate-500 sm:text-sm sm:mt-3">
            Sie können beliebig viele Personen empfehlen. Für jede erfolgreiche Empfehlung
            kann ein eigener Gutscheinanspruch entstehen.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-7">
          <div>
            <h2 className="mb-3 text-lg font-semibold text-slate-900 sm:mb-4 sm:text-xl">Ihre Daten</h2>
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Ihr Name *</span>
                <input
                  name="referrerName"
                  type="text"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-[#0f75bc]"
                  placeholder="Max Mustermann"
                  autoComplete="name"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Ihre E-Mail-Adresse *</span>
                <input
                  name="referrerEmail"
                  type="email"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-[#0f75bc]"
                  placeholder="max@example.de"
                  autoComplete="email"
                  inputMode="email"
                />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-1 block text-sm font-medium text-slate-700">Ihre Telefonnummer <span className="font-normal text-slate-400">optional</span></span>
                <input
                  name="referrerPhone"
                  type="tel"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-[#0f75bc]"
                  placeholder="0176 00000000"
                  autoComplete="tel"
                  inputMode="tel"
                />
              </label>
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-slate-900 sm:mb-4 sm:text-xl">Wen möchten Sie empfehlen?</h2>
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Name der empfohlenen Person *</span>
                <input
                  name="referredName"
                  type="text"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-[#0f75bc]"
                  placeholder="Name der Person"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">E-Mail der empfohlenen Person <span className="font-normal text-slate-400">optional</span></span>
                <input
                  name="referredEmail"
                  type="email"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-[#0f75bc]"
                  placeholder="person@example.de"
                  inputMode="email"
                />
              </label>
            </div>

            <div className="mt-5">
              <p className="mb-3 text-sm font-medium text-slate-800 sm:text-base">
                Wünschen Sie, dass wir die empfohlene Person direkt kontaktieren?
              </p>
              <div className="space-y-2 sm:space-y-3">
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-[#0f75bc]/40 hover:bg-blue-50/30 sm:p-4">
                  <input
                    type="radio"
                    name="contactPermission"
                    value="Ja"
                    required
                    onChange={(e) => setContactPermission(e.target.value)}
                    className="mt-0.5 h-5 w-5 flex-shrink-0 accent-[#0f75bc]"
                  />
                  <span>
                    <span className="block text-sm font-medium text-slate-900 sm:text-base">Ja, bitte direkt kontaktieren</span>
                    <span className="block text-xs text-slate-500 sm:text-sm">Wir dürfen die empfohlene Person telefonisch kontaktieren.</span>
                  </span>
                </label>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-[#0f75bc]/40 hover:bg-blue-50/30 sm:p-4">
                  <input
                    type="radio"
                    name="contactPermission"
                    value="Nein"
                    required
                    onChange={(e) => setContactPermission(e.target.value)}
                    className="mt-0.5 h-5 w-5 flex-shrink-0 accent-[#0f75bc]"
                  />
                  <span>
                    <span className="block text-sm font-medium text-slate-900 sm:text-base">Nein, die Person meldet sich eigenständig</span>
                    <span className="block text-xs text-slate-500 sm:text-sm">Die empfohlene Person nimmt selbst Kontakt mit StromDealz auf.</span>
                  </span>
                </label>
              </div>
            </div>

            {contactPermission === "Ja" && (
              <div className="mt-4 rounded-2xl bg-slate-50 p-4 sm:mt-6 sm:p-5">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">Telefonnummer der empfohlenen Person *</span>
                  <input
                    name="referredPhone"
                    type="tel"
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-[#0f75bc]"
                    placeholder="0176 11111111"
                    inputMode="tel"
                  />
                </label>
                <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-slate-700">
                  <input name="consent" type="checkbox" required className="mt-1 h-5 w-5 flex-shrink-0 accent-[#0f75bc]" />
                  <span className="text-xs leading-relaxed sm:text-sm">
                    Ich bestätige, dass die empfohlene Person mit der Weitergabe ihrer
                    Telefonnummer und einer Kontaktaufnahme durch StromDealz einverstanden ist.
                  </span>
                </label>
              </div>
            )}

            <label className="mt-5 block sm:mt-6">
              <span className="mb-1 block text-sm font-medium text-slate-700">Zusätzliche Nachricht <span className="font-normal text-slate-400">optional</span></span>
              <textarea
                name="message"
                rows={4}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-[#0f75bc]"
                placeholder="Zum Beispiel gewünschte Rückrufzeit oder kurze Info zur empfohlenen Person."
              />
            </label>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-600 sm:p-4 sm:text-sm">
            Der Gutscheinanspruch entsteht erst, wenn durch die Empfehlung ein erfolgreicher
            Strom oder Gasvertrag zustande kommt und der Vertrag aktiv in Belieferung ist.
            Eigenempfehlungen und Mehrfachmeldungen können ausgeschlossen werden.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#0f75bc] px-6 py-4 text-base font-bold text-white transition hover:bg-[#0b609b] disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99] sm:text-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Wird gesendet…
              </span>
            ) : "Jetzt empfehlen!"}
          </button>
        </form>
      </section>
    </main>
  );
}
