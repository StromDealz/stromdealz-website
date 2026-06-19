"use client";

import { useEffect, useRef, useState } from "react";

export default function StandortePage() {
  const [visible, setVisible] = useState(false);
  const [noticeVisible, setNoticeVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const noticeRef = useRef<HTMLDivElement | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    time: "",
  });

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );

    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNoticeVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    if (noticeRef.current) io.observe(noticeRef.current);
    return () => io.disconnect();
  }, []);

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Rückrufanfrage gespeichert – Backend folgt");
  }

  return (
    <main className="overflow-hidden">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden pt-20 sm:pt-24 pb-32 sm:pb-40">
        {/* Großer Brand Background */}
        <div className="absolute inset-0 -z-10">
          <svg
            viewBox="0 0 1440 900"
            preserveAspectRatio="none"
            className="absolute top-0 left-0 w-full h-full"
          >
            <defs>
              <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E3A5F" />
                <stop offset="50%" stopColor="#2F6BB2" />
                <stop offset="100%" stopColor="#FF7A1F" />
              </linearGradient>
            </defs>

            <path
              d="
                M0,0
                L1440,0
                L1440,500
                C1000,600 600,700 0,820
                Z
              "
              fill="url(#heroGradient)"
            />
          </svg>
        </div>

        <div className="containerPad max-w-3xl relative z-10 text-white">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
            Persönliche Beratung.
            <br />
            Individuell vereinbart.
          </h1>

          <p className="mt-5 sm:mt-6 max-w-2xl text-base sm:text-lg text-white/90 leading-relaxed">
            Hinterlassen Sie uns Ihre Kontaktdaten –
            wir melden uns persönlich und stimmen alles Weitere direkt mit Ihnen ab.
          </p>
        </div>
      </section>

      {/* ================= FORM ================= */}
      <section
        ref={ref}
        className={`relative -mt-24 sm:-mt-32 lg:-mt-40 pb-16 sm:pb-24 pt-8 sm:pt-12 transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        <div className="containerPad max-w-xl relative z-10">
          {/* Soft Glow Background hinter Formular */}
          <div className="absolute inset-0 -z-10 flex justify-center">
            <div className="w-[320px] h-[320px] sm:w-[600px] sm:h-[600px] bg-blue-400 opacity-10 blur-[90px] sm:blur-[140px]" />
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white/95 backdrop-blur-md shadow-2xl p-5 sm:p-8 lg:p-10 space-y-6 sm:space-y-8 border border-white/40"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Rückruf anfragen
            </h2>

            <input
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Ihr Name"
              required
              className="w-full rounded-xl border border-slate-300 px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg focus:ring-2 focus:ring-blue-300 outline-none"
            />

            <input
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="Telefonnummer"
              required
              className="w-full rounded-xl border border-slate-300 px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg focus:ring-2 focus:ring-blue-300 outline-none"
            />

            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">
                Beste Rückrufzeit
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {["Morgens", "Mittags", "Nachmittags", "Abends (bis 19 Uhr)"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => updateField("time", t)}
                    className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                      form.time === t
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 py-3.5 sm:py-4 text-white text-sm sm:text-base font-semibold hover:scale-[1.02] transition-all"
            >
              Rückruf anfragen
            </button>

            <p className="text-sm text-slate-500 text-center leading-relaxed">
              Wir melden uns persönlich und vereinbaren einen passenden Beratungsort.
            </p>
          </form>
        </div>
      </section>

      {/* ================= STANDORT HINWEIS ================= */}
      <section className="relative bg-white overflow-hidden py-14 sm:py-18 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F2F7FD] via-white to-white -z-10" />

        <div className="absolute top-0 left-0 w-full h-[90px] sm:h-[140px] -translate-y-full pointer-events-none">
          <svg
            viewBox="0 0 1440 140"
            preserveAspectRatio="none"
            className="absolute bottom-0 left-0 w-full h-full"
          >
            <polygon points="0,140 1440,0 1440,140" fill="#ffffff" />
          </svg>
        </div>

        <div className="containerPad relative z-10">
          <div
            ref={noticeRef}
            className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white/90 shadow-xl px-5 sm:px-8 lg:px-12 py-10 sm:py-14 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 rounded-full bg-blue-200/40 blur-2xl scale-150" />
                <div
                  className={`relative mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-500 shadow-lg transition-all duration-1000 ${
                    noticeVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
                  }`}
                >
                  <div className="flex gap-1">
                    <span
                      className="h-2.5 w-2.5 rounded-full bg-white animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="h-2.5 w-2.5 rounded-full bg-white animate-bounce"
                      style={{ animationDelay: "180ms" }}
                    />
                    <span
                      className="h-2.5 w-2.5 rounded-full bg-white animate-bounce"
                      style={{ animationDelay: "360ms" }}
                    />
                  </div>
                </div>
              </div>

              <p
                className={`text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-slate-400 transition-all duration-700 ${
                  noticeVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
              >
                Standorte
              </p>

              <h3
                className={`mt-4 max-w-3xl text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-slate-900 transition-all duration-1000 ${
                  noticeVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: "120ms" }}
              >
                Aktuelle Standorte sind bald für Sie verfügbar
              </h3>

              <p
                className={`mt-4 max-w-2xl text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed transition-all duration-1000 ${
                  noticeVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: "260ms" }}
              >
                Bis dahin erfolgt die Terminvereinbarung weiterhin individuell nach persönlicher Abstimmung.
                Hinterlassen Sie einfach Ihre Kontaktdaten im Formular und wir melden uns bei Ihnen.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                {[
                  "Persönliche Abstimmung",
                  "Flexible Terminvergabe",
                  "Beratung nach Vereinbarung",
                ].map((item, index) => (
                  <span
                    key={item}
                    className={`rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 transition-all duration-700 ${
                      noticeVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                    }`}
                    style={{ transitionDelay: `${420 + index * 180}ms` }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-[-1px] left-0 w-full h-[90px] sm:h-[120px] pointer-events-none z-0">
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="absolute bottom-0 left-0 w-full h-full"
          >
            <polygon points="0,0 1440,120 0,120" fill="#F2F7FD" />
          </svg>
        </div>
      </section>
    </main>
  );
}