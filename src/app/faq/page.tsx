"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Wie funktioniert der Anbieterwechsel genau?",
    answer: "Der Wechsel ist für Sie völlig stressfrei. Sobald wir den optimalen Tarif gefunden haben, übernehmen wir die Kündigung beim alten Versorger. Ihre Energieversorgung ist dabei gesetzlich lückenlos garantiert."
  },
  {
    question: "Kostet mich die Beratung etwas?",
    answer: "Nein. Unsere Erstberatung und Tarifanalyse ist für Sie kostenfrei und unverbindlich. Wir finanzieren uns durch Servicegebühren der Anbieter, bleiben aber in unserer Empfehlung neutral."
  },
  {
    question: "Was passiert mit meinen Boni beim Wechsel?",
    answer: "Wir prüfen genau, wann Ihre Boni ausgezahlt werden, damit Sie beim Wechsel kein Geld verlieren. Wir timen den Wechsel so, dass Sie die maximale Ersparnis mitnehmen."
  },
  {
    question: "Bin ich bei einem kleinen Anbieter sicher?",
    answer: "Wir empfehlen ausschließlich geprüfte Anbieter mit stabiler Marktlage. In Deutschland ist die Grundversorgung zudem gesetzlich gesichert – Sie sitzen niemals im Dunkeln."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    // Mail-Logik an kontakt@stromdealz.de
    setTimeout(() => setStatus("success"), 1200);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      {/* Header: Knackiger Titel & Hero-Style */}
      <section className="relative overflow-hidden bg-[#163a63] pt-20 pb-32">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#163a63_0%,#245a94_42%,#163a63_100%)]" />
        
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-[-10%] top-[-10%] h-[300px] w-[300px] rounded-full bg-white/10 blur-3xl" />
          <div className="absolute right-[5%] bottom-[10%] h-[250px] w-[250px] rounded-full bg-[#00C853]/10 blur-3xl" />
        </div>

        <div className="containerPad relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur mb-8">
              Beratung mit System
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] text-white tracking-tight">
              Häufige <br />
              <span className="text-[#00C853]">Fragen.</span>
            </h1>
            <p className="mt-8 text-blue-100/70 text-lg md:text-xl max-w-2xl leading-relaxed">
              Alles zu Wechsel, Fristen & Boni. Transparent und direkt erklärt.
            </p>
          </div>
        </div>

        {/* Die Welle vom Hero-Design */}
        <div className="absolute bottom-0 left-0 w-full leading-none">
          <svg viewBox="0 0 1440 100" className="h-[50px] w-full" preserveAspectRatio="none">
            <path d="M0,100 C480,0 960,0 1440,100 L1440,100 L0,100 Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* Content Bereich */}
      <section className="containerPad -mt-16 relative z-20 pb-24">
        <div className="grid lg:grid-cols-[1fr_420px] gap-10 items-start">
          
          {/* FAQ Accordion */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white rounded-[28px] border border-slate-200/60 shadow-sm overflow-hidden transition-all hover:shadow-md"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="text-lg font-bold text-slate-800 pr-4">{faq.question}</span>
                  <div className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center transition-all ${openIndex === index ? "bg-[#00C853] text-[#163a63] rotate-180" : "bg-slate-100 text-slate-400"}`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <div className={`transition-all duration-300 ${openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="p-7 pt-0 text-slate-600 leading-relaxed text-base border-t border-slate-50">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Kontaktformular Card */}
          <aside className="sticky top-10">
            <div className="bg-white rounded-[35px] border border-slate-200 p-8 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.05)]">
              <h3 className="text-2xl font-black text-slate-900 mb-2">Noch Fragen?</h3>
              <p className="text-slate-500 mb-8 text-sm font-medium">Lassen Sie uns einfach persönlich darüber sprechen.</p>

              {status === "success" ? (
                <div className="py-8 text-center animate-in fade-in zoom-in duration-300">
                  <div className="h-16 w-16 bg-green-100 text-[#00C853] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <p className="font-bold text-slate-800">Nachricht gesendet!</p>
                  <p className="text-slate-500 text-xs mt-1">Wir melden uns zeitnah bei Ihnen.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Vollständiger Name</label>
                    <input name="name" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-[#00C853] focus:border-transparent outline-none transition-all" placeholder="z.B. Max Mustermann" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">E-Mail Adresse</label>
                    <input name="email" type="email" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-[#00C853] focus:border-transparent outline-none transition-all" placeholder="name@beispiel.de" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Ihre Nachricht</label>
                    <textarea name="message" required rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-[#00C853] focus:border-transparent outline-none transition-all resize-none" placeholder="Was können wir für Sie tun?"></textarea>
                  </div>
                  <button 
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-[#163a63] hover:bg-[#1d4a7a] text-white font-bold py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest mt-2"
                  >
                    {status === "loading" ? "Wird gesendet..." : "Nachricht senden"}
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                </form>
              )}
            </div>
            <div className="mt-6 flex justify-center items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 opacity-60">
               <span className="h-1.5 w-1.5 rounded-full bg-[#00C853]" /> kontakt@stromdealz.de
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}