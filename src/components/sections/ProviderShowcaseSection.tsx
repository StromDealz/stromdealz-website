"use client";

import Image from "next/image";

const providers = [
  { name: "E.ON", logo: "/images/providers/eon.png" },
  { name: "EnBW", logo: "/images/providers/enbw.png" },
  { name: "Vattenfall", logo: "/images/providers/vattenfall.png" },
  { name: "Octopus Energy", logo: "/images/providers/octopus-energy.png" },
  { name: "Mark-E", logo: "/images/providers/mark-e.png" },
  { name: "Städtische Werke Kassel", logo: "/images/providers/staedtischewerkekassel.png" },
  { name: "E WIE EINFACH", logo: "/images/providers/e-wie-einfach.png" },
  { name: "eprimo", logo: "/images/providers/eprimo.png" },
  { name: "lekker", logo: "/images/providers/lekker.png" },
  { name: "Mainova", logo: "/images/providers/mainova.png" },
  { name: "Lichtblick", logo: "/images/providers/lichtblick.png" },
  { name: "rabot.energy", logo: "/images/providers/rabot.png" },
  { name: "RheinEnergie", logo: "/images/providers/rheinenergie.png" },
  { name: "EVD", logo: "/images/providers/evd.png" },
  { name: "NEW", logo: "/images/providers/new.png" },
  { name: "enercity", logo: "/images/providers/enercity.png" },
  { name: "enviaM", logo: "/images/providers/enviam.png" },
  { name: "innogy", logo: "/images/providers/innogy.png" },
  { name: "Prokon", logo: "/images/providers/prokon.png" },
  { name: "DEW21", logo: "/images/providers/dew21.png" },
  { name: "elli", logo: "/images/providers/ellivw.png" },
];

export default function ProviderShowcaseSection() {
  const extendedProviders = [...providers, ...providers];

  return (
    <section className="relative -mt-[34px] z-0 overflow-hidden bg-[#f6f8fb] py-16 md:-mt-[42px] md:py-24 lg:-mt-[56px] lg:py-32">
      {/* Hintergrund-Glanz für Tiefe */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-[0.07] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#245a94_0%,transparent_65%)]" />
      </div>

      <div className="relative z-10 px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center mb-12 md:mb-20">
          <span className="inline-block px-3 py-1 mb-4 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-[#245a94] bg-[#245a94]/10 rounded-full">
            Unsere Partnerschaften
          </span>
          
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl leading-[1.1]">
            Starke Partner. <br className="hidden sm:block" /> 
            <span className="text-[#245a94]">Beste Tarife.</span>
          </h2>
          
          <p className="mt-6 mx-auto max-w-2xl text-base md:text-lg text-slate-600 leading-relaxed">
            Dank unserer breiten Anbindung an führende Energieversorger in Deutschland profitieren Sie von 		starken Tarifen, attraktiven Konditionen und echten Preisvorteilen.
          </p>
        </div>

        {/* Marquee Container */}
        <div className="group relative flex overflow-hidden">
          <div className="animate-marquee flex min-w-full shrink-0 items-center justify-around gap-10 md:gap-24 py-6">
            {extendedProviders.map((provider, index) => (
              <div
                key={`${provider.name}-${index}`}
                className="relative flex h-12 w-28 md:h-16 md:w-40 shrink-0 items-center justify-center transition-transform duration-300 md:hover:scale-110"
              >
                <Image
                  src={provider.logo}
                  alt={provider.name}
                  width={140}
                  height={60}
                  className="object-contain"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </div>
            ))}
          </div>

          {/* Dynamische Masken-Breite für Mobile/Desktop */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-40 bg-gradient-to-r from-[#f6f8fb] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-40 bg-gradient-to-l from-[#f6f8fb] to-transparent z-10" />
        </div>

        {/* Responsive Footer Info */}
        <div className="mt-16 md:mt-24 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
          <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
              <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            Mitglied im Bundesverband Deutscher Energiemakler und Energieberater e.V.
          </div>
          
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
  /* Langsame, ruhige Bewegung auf Mobile */
  animation: marquee 45s linear infinite;
}

@media (min-width: 768px) {
  .animate-marquee {
    animation: marquee 75s linear infinite;
  }

  .group:hover .animate-marquee {
    animation-play-state: paused;
  }
}
      `}</style>
    </section>
  );
}