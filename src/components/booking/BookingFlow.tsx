"use client";

import { useMemo, useState } from "react";
import { bookingSteps, BookingCase, bookingIntros } from "@/lib/bookingSteps";

type Answers = Record<string, string>;

interface Props {
  bookingCase: BookingCase;
}

// ✅ DEINE CAL.COM URL
const CAL_URL = "https://cal.com/stromdealz/beratungstermin-buchen";

export default function BookingFlow({ bookingCase }: Props) {
  const steps = useMemo(() => bookingSteps[bookingCase], [bookingCase]);
  const intro = useMemo(() => bookingIntros[bookingCase], [bookingCase]);

  const [showIntro, setShowIntro] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [textValue, setTextValue] = useState("");
  const [otherValue, setOtherValue] = useState("");

  const current = steps[stepIndex];
  const total = steps.length;
  const isLast = stepIndex === total - 1;

  function goNext() {
    if (!isLast) {
      setStepIndex((s) => s + 1);
      setTextValue("");
      setOtherValue("");
    }
  }

  function setAnswer(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function onPick(option: string) {
    if (current.allowOther && option === (current.otherLabel || "Sonstige")) {
      setAnswer(current.id, option);
      return;
    }

    setAnswer(current.id, option);
    goNext();
  }

  const needsOther =
    current?.type === "choice" &&
    current?.allowOther &&
    answers[current?.id] === (current?.otherLabel || "Sonstige");

  const canContinueText =
    current?.type === "text" ? textValue.trim().length > 1 : true;

  const canContinueOther =
    !needsOther ? true : otherValue.trim().length > 1;

  function submitTextAndNext() {
    if (!canContinueText) return;
    setAnswer(current.id, textValue.trim());
    goNext();
  }

  function submitOtherAndNext() {
    if (!canContinueOther) return;
    setAnswer(current.id, otherValue.trim());
    goNext();
  }

  /* =========================
     INTRO SCREEN
  ========================= */
  if (showIntro) {
    return (
      <div className="relative mx-auto max-w-6xl px-4">

  {/* Hintergrund Bild – außerhalb Container */}
  {intro.image && (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-visible">
      <img
        src={intro.image}
        alt=""
        className="absolute right-[-31%] top-[96%] w-[60%] max-w-none -translate-y-1/2 object-contain opacity-95"

      />
    </div>
  )}

  {/* Content Container */}
  <div className="relative z-10 mx-auto max-w-3xl overflow-hidden rounded-3xl bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/90 p-8 shadow-xl backdrop-blur-sm sm:p-12 animate-[fadeIn_.4s_ease-out]">

    <h2 className="mb-6 text-3xl font-bold text-slate-900 sm:text-4xl">
      {intro.title}
    </h2>

    <p className="mb-10 text-lg leading-relaxed text-slate-600">
      {intro.description}
    </p>

    <button
      type="button"
      onClick={() => setShowIntro(false)}
      className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-blue-600 py-5 text-lg font-bold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl active:scale-[0.98]"
    >
      <span className="relative z-10">{intro.buttonText}</span>
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
    </button>

  </div>
</div>

    );
  }

  /* =========================
     KALENDER (CAL.COM)
  ========================= */
  if (isLast && stepIndex === total - 1 && !showIntro) {
    const customerName =
      typeof answers.name === "string" ? answers.name : "";

    const redirectUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/booking/danke`
        : "";

    const calParams = new URLSearchParams({
      embed: "true",
      name: customerName,
      redirect: redirectUrl,
    });

    return (
      <div className="mx-auto max-w-4xl px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-slate-50 to-blue-50 p-8 shadow-xl sm:p-12">
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-blue-100" />

          <h2 className="mb-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
            Termin auswählen
          </h2>

          <p className="mb-6 text-slate-600">
            Wählen Sie jetzt einen freien Termin für Ihre persönliche Beratung.
          </p>

          <iframe
            src={`${CAL_URL}?${calParams.toString()}`}
            className="h-[680px] w-full rounded-2xl border border-slate-200 bg-white"
            frameBorder="0"
          />
        </div>
      </div>
    );
  }

  /* =========================
     FRAGEN FLOW
  ========================= */
  return (
    <div className="mx-auto max-w-3xl px-4">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-slate-50 to-blue-50 p-8 shadow-xl sm:p-12 animate-[fadeIn_.4s_ease-out]">
        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-blue-100" />

        {/* Progress */}
        <div className="mb-8 flex items-center justify-between">
          <div className="text-sm font-medium text-slate-400">
            Schritt {stepIndex + 1} von {total}
          </div>

          <div className="h-2 w-48 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
              style={{ width: `${((stepIndex + 1) / total) * 100}%` }}
            />
          </div>
        </div>

        {/* Frage */}
        <h2 className="mb-10 text-2xl font-semibold leading-snug text-slate-900 sm:text-3xl">
          {current.question}
        </h2>

        {current.type === "choice" && (
          <div className="space-y-4">
            {(current.options || []).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onPick(opt)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-5 text-left text-base font-semibold text-slate-900 shadow-sm transition hover:border-blue-400 hover:bg-blue-50 active:scale-[0.99]"
              >
                {opt}
              </button>
            ))}

            {current.allowOther && (
              <button
                type="button"
                onClick={() => onPick(current.otherLabel || "Sonstige")}
                className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-5 text-left text-base font-semibold text-slate-900 shadow-sm transition hover:border-blue-400 hover:bg-blue-50 active:scale-[0.99]"
              >
                {current.otherLabel || "Sonstige"}
              </button>
            )}

            {needsOther && (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <input
                  value={otherValue}
                  onChange={(e) => setOtherValue(e.target.value)}
                  placeholder={current.otherPlaceholder || "Bitte eingeben"}
                  className="w-full rounded-xl border border-slate-200 bg-white px-5 py-4 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={submitOtherAndNext}
                  disabled={!canContinueOther}
                  className="mt-4 w-full rounded-xl bg-blue-600 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-40"
                >
                  Weiter
                </button>
              </div>
            )}
          </div>
        )}

        {current.type === "text" && (
          <div className="space-y-5">
            <input
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder={current.placeholder || "Bitte eingeben"}
              className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-5 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="button"
              onClick={submitTextAndNext}
              disabled={!canContinueText}
              className="w-full rounded-2xl bg-blue-600 py-5 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-40"
            >
              Weiter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
