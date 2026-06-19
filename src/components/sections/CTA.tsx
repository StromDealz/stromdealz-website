"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Review = {
  name: string;
  city: string;
  text: string;
};

const reviews: Review[] = [
  { name: "Michael R.", city: "Mönchengladbach", text: "Sehr verständliche Beratung. Kein Druck, keine versteckten Kosten. Ich habe endlich Klarheit." },
  { name: "Samira El Amrani", city: "Viersen", text: "Ehrlich, ruhig und transparent erklärt. Ich habe mich sehr gut aufgehoben gefühlt." },
  { name: "Giuseppe Romano", city: "Rheydt", text: "Professionell und zuverlässig. Alles wurde klar und nachvollziehbar erklärt." },
  { name: "Fatima Benali", city: "Mönchengladbach", text: "Keine Hektik, keine Verkaufsmasche. Einfach ehrliche Beratung." },
  { name: "Thomas K.", city: "Viersen", text: "Sehr strukturierte Analyse. Man merkt sofort die Erfahrung." },
  { name: "Aylin Yilmaz", city: "Rheydt", text: "Ich hatte hohe Nachzahlungen. Jetzt habe ich endlich einen passenden Tarif." },
  { name: "Luca Bianchi", city: "Mönchengladbach", text: "Seriös, freundlich und kompetent. Klare Empfehlung." },
  { name: "Hassan Al Haddad", city: "Viersen", text: "Alles wurde Schritt für Schritt erklärt. Sehr professionell." },
  { name: "Claudia Weber", city: "Rheydt", text: "Ich hatte viele Fragen. Alle wurden verständlich beantwortet." },
  { name: "Mehmet Kaya", city: "Mönchengladbach", text: "Transparente Beratung ohne Druck. Genau so sollte es sein." },
];

export default function CTA() {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length);
      setProgress(0);
    }, 6000);

    const progressInterval = setInterval(() => {
      setProgress((p) => (p < 100 ? p + 1.7 : 100));
    }, 100);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#edf3f9_0%,#f7fafc_55%,#ffffff_100%)]" />
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/2 top-0 h-[220px] w-[220px] -translate-x-1/2 rounded-full bg-[#2f5f95]/12 blur-[100px]" />
        <div className="absolute right-[10%] top-[35%] h-[180px] w-[180px] rounded-full bg-[#1f4f85]/8 blur-[90px]" />
      </div>

      <div className="containerPad">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Stimmen unserer Kunden
          </p>

          <div className="relative mt-6 min-h-[170px] sm:min-h-[150px]">
            {reviews.map((review, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-all duration-700 ease-out ${
                  i === index
                    ? "translate-x-0 opacity-100"
                    : "pointer-events-none translate-x-4 opacity-0"
                }`}
              >
                <div className="mx-auto max-w-2xl">
                  <div className="mb-4 flex justify-center gap-1">
                    {[...Array(5)].map((_, starIndex) => (
                      <svg
                        key={starIndex}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="#FBBF24"
                        className="h-4 w-4 sm:h-5 sm:w-5"
                      >
                        <path d="M12 .587l3.668 7.568L24 9.748l-6 5.84 1.417 8.262L12 18.897l-7.417 4.953L6 15.588 0 9.748l8.332-1.593z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-lg font-medium leading-8 text-slate-800 sm:text-2xl sm:leading-relaxed">
                    “{review.text}”
                  </p>

                  <div className="mt-4 text-sm text-slate-600">
                    <span className="font-medium text-slate-800">{review.name}</span>
                    <span className="mx-2 text-slate-400">•</span>
                    <span>{review.city}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-6 max-w-md">
            <div className="h-[4px] w-full overflow-hidden rounded-full bg-slate-300/70">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#163a63_0%,#2f5f95_100%)] transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-4 flex justify-center gap-2">
              {reviews.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    i === index
                      ? "h-2 w-5 bg-[#163a63]"
                      : "h-2 w-2 bg-slate-400/70"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/booking"
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#163a63] px-7 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(22,58,99,0.18)] transition duration-200 hover:-translate-y-[1px] hover:bg-[#1d4a7a]"
            >
              Jetzt beraten lassen
            </Link>

            <p className="mt-3 text-sm text-slate-600">
              Unverbindlich, persönlich und transparent
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}