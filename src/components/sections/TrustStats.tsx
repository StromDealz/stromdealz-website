"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function ExpertTrustSection() {
  const [count, setCount] = useState(0);
  const targetCount = 20000;
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startTime: number | null = null;
          const duration = 4000; // Längere Dauer für maximalen Impact

          const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            // Ease-out Quart: Schneller Start, sehr sanftes Ende
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeOutQuart * targetCount));

            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative overflow-hidden bg-[#1a365d] py-20 lg:py-32 text-white"
    >
      {/* Hintergrund-Elemente */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <svg className="absolute right-0 top-0 h-full w-1/2" viewBox="0 0 400 800" fill="none">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#00C853', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <circle cx="400" cy="400" r="300" stroke="url(#grad1)" strokeWidth="2" strokeDasharray="20 10" />
          <circle cx="400" cy="400" r="200" stroke="url(#grad1)" strokeWidth="1" />
        </svg>
      </div>

      <div className="containerPad relative z-10">
        <div className="grid lg:grid-cols-[1fr_0.8fr] gap-12 lg:gap-20 items-center">
          
          {/* Linke Seite: Voller Fokus auf die Zahl */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#00C853] text-[11px] font-bold uppercase tracking-widest mb-8">
              Geprüfte Beratungsqualität
            </div>
            
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-12">
              Vertrauen Sie auf <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] to-[#00C853]">
                jahrelange Expertise.
              </span>
            </h2>

            <div className="relative">
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-bold tracking-tight text-white tabular-nums leading-none">
                  {count.toLocaleString('de-DE')}
                  <span className="text-[#00C853] animate-pulse">+</span>
                </span>
                <p className="mt-4 text-sm md:text-base font-bold uppercase tracking-[0.4em] text-blue-200/60">
                  Erfolgreich beratene Haushalte
                </p>
              </div>
            </div>
          </div>

          {/* Rechte Seite: CTAs */}
          <div className="space-y-6">
            <div className="p-0.5 rounded-[32px] bg-gradient-to-br from-blue-400 to-[#00C853] shadow-2xl">
              <div className="bg-[#1a365d] rounded-[31px] p-8 md:p-10 h-full">
                <h3 className="text-2xl font-bold mb-4">Persönliche Beratung</h3>
                <p className="text-blue-100/70 mb-8 text-lg leading-relaxed">
                  Wir finden im Gespräch den Tarif, der wirklich zu Ihnen passt.
                </p>
                <Link 
                  href="/booking" 
                  className="group flex w-full items-center justify-center gap-3 bg-white text-[#1a365d] px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all hover:bg-[#00C853] hover:text-white"
                >
                  Jetzt Termin sichern
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            <Link
  href="/faq"
  className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 md:p-8 rounded-[32px] flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all"
>
  <div>
    <h4 className="font-bold text-lg text-white">Häufige Fragen</h4>
    <p className="text-sm text-blue-200/50">Alles zu Wechsel, Fristen & Boni</p>
  </div>
  <div className="h-12 w-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#00C853] transition-colors">
    <svg
      className="w-6 h-6 text-white/50 group-hover:text-[#00C853]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  </div>
</Link>
          </div>
        </div>

        {/* Footer: Trust Badges */}
        <div className="mt-20 pt-10 border-t border-white/10 flex flex-wrap justify-center md:justify-between gap-6 md:gap-8 items-center opacity-60">
          <div className="flex items-center gap-3 font-bold tracking-widest text-[10px] md:text-xs uppercase text-blue-100">
            <span className="h-2 w-2 rounded-full bg-[#00C853]" /> 100% Unabhängig
          </div>
          <div className="flex items-center gap-3 font-bold tracking-widest text-[10px] md:text-xs uppercase text-blue-100">
            <span className="h-2 w-2 rounded-full bg-[#00C853]" /> Sicherer Datenschutz
          </div>
          <div className="flex items-center gap-3 font-bold tracking-widest text-[10px] md:text-xs uppercase text-blue-100">
            <span className="h-2 w-2 rounded-full bg-[#00C853]" /> Persönlicher Service
          </div>
        </div>
      </div>

      <style jsx>{`
        .tabular-nums {
          font-variant-numeric: tabular-nums;
        }
      `}</style>
    </section>
  );
}