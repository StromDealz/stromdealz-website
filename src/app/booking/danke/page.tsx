"use client";

import Link from "next/link";

export default function BookingDankePage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4">
      {/* Hintergrund Glow */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-sky-200/30 blur-3xl" />

      {/* Card */}
      <div className="relative w-full max-w-2xl animate-[fadeUp_.6s_ease-out] rounded-[32px] bg-white p-10 shadow-xl sm:p-14">
        {/* Success Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg animate-[pop_.5s_ease-out]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Text */}
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Ihr Termin ist bestätigt
          </h1>

          <p className="mx-auto mb-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Vielen Dank für Ihr Vertrauen.  
            Ihr Beratungstermin wurde erfolgreich gebucht.
          </p>

          <div className="mx-auto mb-10 max-w-lg rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
            <strong className="text-slate-800">
              Wie geht es jetzt weiter?
            </strong>
            <p className="mt-2">
              Sie erhalten in Kürze eine Terminbestätigung per E-Mail mit allen
              Details zu Datum, Uhrzeit und Ablauf.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg"
            >
              Zur Startseite
            </Link>

            <span className="text-sm text-slate-400">
              Wir freuen uns auf das Gespräch
            </span>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pop {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          60% {
            transform: scale(1.05);
            opacity: 1;
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </main>
  );
}
