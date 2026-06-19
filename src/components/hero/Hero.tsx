"use client";

import { useEffect, useState } from "react";

export default function Hero() {
const [imageVisible, setImageVisible] = useState(false);

const tickerGroups = [
  [
    "bis zu 800 € jährlich sparen",
    "Sicherheit durch Preisgarantie",
    "Neukundenvorteile sichern",
    "persönliche Beratung",
    "kostenfrei und unverbindlich",
    "Tarifcheck in wenigen Minuten",
  ],
  [
    "Stromtarife vergleichen",
    "Gastarife optimieren",
    "Wechselvorteile sichern",
    "starke Anbieter Auswahl",
    "faire Beratung vor Ort",
    "Tagesdeal für Strom und Gas",
  ],
];

const mobileTickerItems = [
  "bis zu 800 € jährlich sparen",
  "Sicherheit durch Preisgarantie",
  "Neukundenvorteile sichern",
  "persönliche Beratung",
  "kostenfrei und unverbindlich",
  "Tarifcheck in wenigen Minuten",
];

const tabletTickerGroups = [
  [
    "bis zu 800 € jährlich sparen",
    "Preisgarantie sichern",
    "Neukundenvorteile nutzen",
    "persönliche Beratung",
  ],
  [
    "Stromtarife vergleichen",
    "Gastarife optimieren",
    "Wechselvorteile sichern",
    "kostenfrei prüfen lassen",
  ],
];

  const trustItems = [
    "100% zufriedene Kunden",
    "100% kostenlos",
    "100% unverbindliche Beratung",
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setImageVisible(true);
    }, 220);
    return () => clearTimeout(timer);
  }, []);


  return (
    <section className="relative z-10 overflow-hidden bg-[#f8fafc]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#163a63_0%,#245a94_42%,#d9e6f2_78%,#f5f7f4_100%)]" />

      {/* Ticker Bar */}
<div className="absolute inset-x-0 top-0 z-20">
  <div className="relative border-y border-white/10 bg-[#14385d]/80 backdrop-blur-md">
    <div className="relative h-[42px] overflow-hidden px-4 sm:h-[44px]">
      
      {/* Mobil: einzelne Aussagen, damit nichts abgeschnitten wird */}
      <div className="relative h-full sm:hidden">
        {mobileTickerItems.map((item, index) => (
          <div
            key={index}
            className="hero-mobile-statement"
            style={{ animationDelay: `${index * 6}s` }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Kleinere Desktops und Tablets: 4 Aussagen als Gruppe */}
<div className="hidden h-full sm:block lg:hidden">
  {tabletTickerGroups.map((group, groupIndex) => (
    <div
      key={groupIndex}
      className={`hero-statement-group hero-statement-group-tablet ${
        groupIndex === 0 ? "hero-statement-group-one" : "hero-statement-group-two"
      }`}
    >
      {group.map((item, index) => (
        <div key={index} className="flex shrink-0 items-center gap-3">
          <span>{item}</span>
          {index < group.length - 1 && <span className="text-white/30">•</span>}
        </div>
      ))}
    </div>
  ))}
</div>

{/* Große Desktops: 6 Aussagen als Gruppe */}
<div className="hidden h-full lg:block">
  {tickerGroups.map((group, groupIndex) => (
    <div
      key={groupIndex}
      className={`hero-statement-group ${
        groupIndex === 0 ? "hero-statement-group-one" : "hero-statement-group-two"
      }`}
    >
      {group.map((item, index) => (
        <div key={index} className="flex shrink-0 items-center gap-3">
          <span>{item}</span>
          {index < group.length - 1 && <span className="text-white/30">•</span>}
        </div>
      ))}
    </div>
  ))}
</div>

    </div>
  </div>
</div>

      <div className="containerPad relative z-10 pb-0 pt-8 sm:pt-10 lg:pt-14">
        {/* Mobil min-h deutlich reduziert für Kompaktheit */}
        <div className="grid items-end min-h-[300px] sm:min-h-[450px] lg:min-h-[560px] lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          
          <div className="max-w-2xl self-center lg:self-start lg:pt-8">
            <div className="inline-flex items-center rounded-full border border-white/30 bg-white/12 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/95 backdrop-blur md:text-xs">
              StromDealz Tagesdeal
            </div>

            <h1 className="mt-4 lg:mt-6 leading-[1.02] text-white">
              <span className="block text-[26px] font-bold sm:text-[46px] lg:text-[52px] xl:text-[58px]">
                Jetzt den besten Tagesdeal für
              </span>
              <span className="block text-3xl font-extrabold text-[#00C853] sm:text-5xl lg:text-5xl xl:text-[62px]">
                Strom und Gas
              </span>
              <span className="block text-[26px] font-bold sm:text-[46px] lg:text-[52px] xl:text-[58px]">
                sichern
              </span>
            </h1>

            {/* Desktop Trust Items (Links) */}
            <div className={`mt-16 hidden lg:flex flex-col gap-4 transition-all duration-1000 delay-500 ${imageVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
              {trustItems.map((text, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00C853] text-white shadow-[0_0_15px_rgba(0,200,83,0.4)]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" /></svg>
                  </div>
                  <span className="text-sm font-bold tracking-wide text-white drop-shadow-sm sm:text-base">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MOBIL: Badges und Frau */}
          <div className="relative flex items-end justify-center lg:justify-end mt-0 lg:mt-0">
            {/* mt-[-30px] schiebt den unteren Bereich mobil nach oben */}
            <div className="flex flex-row items-end gap-3 lg:block relative w-full max-w-lg lg:max-w-[460px] mt-[-30px] lg:mt-0 lg:translate-x-12">
              
              {/* Trust Badges Mobil: Links neben der Frau */}
              <div className={`flex flex-col gap-2 mb-3.5 lg:hidden transition-all duration-1000 delay-500 ${imageVisible ? "opacity-100" : "opacity-0"}`}>
                {trustItems.map((text, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-2 py-1.5 rounded-lg border border-white/20">
                    <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#00C853] text-white">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" /></svg>
                    </div>
                    <span className="text-[9px] font-semibold text-white leading-tight">{text}</span>
                  </div>
                ))}
              </div>

              {/* Frau Bild */}
              <div className={`relative transition-all duration-[1300ms] ease-out w-[45%] lg:w-full ${imageVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
                <img
                  src="/images/hero/hero-woman.png"
                  alt="Strom Beratung"
                  className="relative z-10 block h-auto w-full object-contain object-bottom"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 z-10 w-full leading-none">
        <svg viewBox="0 0 1440 120" className="h-[20px] sm:h-[40px] w-full lg:h-[60px]" preserveAspectRatio="none">
          <path d="M0,64L80,74.7C160,85,320,107,480,106.7C640,107,800,85,960,74.7C1120,64,1280,64,1360,64L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="#EDF0F7" />
        </svg>
      </div>

<style jsx>{`
  .hero-mobile-statement {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.75rem;
    color: white;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.15em;
    line-height: 1.25;
    text-transform: uppercase;
    text-align: center;
    opacity: 0;
    transform: scale(0.94);
    filter: blur(2px);
    animation: heroMobileStatementZoom 36s ease-in-out infinite;
    will-change: opacity, transform, filter;
  }

  .hero-statement-group {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.15rem;
    padding: 0 1rem;
    color: white;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.15em;
    line-height: 1.2;
    text-transform: uppercase;
    text-align: center;
    white-space: nowrap;
    opacity: 0;
    transform: scale(0.94);
    filter: blur(2px);
    animation: heroStatementZoom 20s ease-in-out infinite;
    will-change: opacity, transform, filter;
  }

  .hero-statement-group-two {
    animation-delay: 10s;
  }

@media (min-width: 640px) {
  .hero-statement-group-tablet {
    gap: 1.15rem;
    padding: 0 1rem;
    font-size: 10px;
    letter-spacing: 0.14em;
  }
}

@media (min-width: 1024px) {
  .hero-statement-group {
    gap: 1.5rem;
    padding: 0 1.5rem;
    font-size: 11px;
    letter-spacing: 0.18em;
  }
}

  @keyframes heroMobileStatementZoom {
    0% {
      opacity: 0;
      transform: scale(0.94);
      filter: blur(3px);
    }

    4% {
      opacity: 1;
      transform: scale(1);
      filter: blur(0);
    }

    13% {
      opacity: 1;
      transform: scale(1.035);
      filter: blur(0);
    }

    16.66% {
      opacity: 0;
      transform: scale(1.07);
      filter: blur(3px);
    }

    100% {
      opacity: 0;
      transform: scale(1.07);
      filter: blur(3px);
    }
  }

  @keyframes heroStatementZoom {
    0% {
      opacity: 0;
      transform: scale(0.94);
      filter: blur(3px);
    }

    10% {
      opacity: 1;
      transform: scale(1);
      filter: blur(0);
    }

    42% {
      opacity: 1;
      transform: scale(1.025);
      filter: blur(0);
    }

    50% {
      opacity: 0;
      transform: scale(1.055);
      filter: blur(3px);
    }

    100% {
      opacity: 0;
      transform: scale(1.055);
      filter: blur(3px);
    }
  }
`}</style>
    </section>
  );
}