import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative mt-28 overflow-hidden bg-[#1c2f4a] text-white">

      {/* dezenter orange glow */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[400px] w-[400px] rounded-full bg-orange-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-blue-400/10 blur-3xl" />

      <div className="relative containerPad py-24">

        <div className="grid gap-16 md:grid-cols-3">

          {/* BRAND */}
          <div>
            <h3 className="text-2xl font-semibold tracking-tight">
              <span className="text-white">Strom</span>
              <span className="text-orange-500">Dealz</span>
            </h3>

            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/80">
              Persönliche Energieberatung für Strom und Gas.
              Transparent, unabhängig und kostenfrei.
              Regional stark und direkt erreichbar.
            </p>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md text-orange-400 text-xl">
                ⚡
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  20.000+ Beratungen
                </p>
                <p className="text-xs text-white/60">
                  Vertrauen aus der Region
                </p>
              </div>
            </div>
          </div>

          {/* NAVIGATION */}
          <div>
            <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-white/50">
              Navigation
            </p>

            <ul className="space-y-4 text-sm">
              {[
                { href: "/", label: "Startseite" },
                { href: "/faq", label: "FAQs" },
		{ href: "/booking", label: "Termin buchen" },
                { href: "/kontakt", label: "Kontakt" },
		{ href: "/jobs", label: "Jobs und Karriere" },
                { href: "/impressum", label: "Impressum" },
                { href: "/datenschutz", label: "Datenschutz" },
		{ href: "/agb", label: "AGB" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-3 text-white/80 transition"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500 opacity-70 transition group-hover:scale-125" />
                    <span className="group-hover:text-orange-400 transition">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10">

            <p className="text-sm font-semibold text-white">
              Kostenfreie Erstberatung
            </p>

            <a
              href="tel:021616202538"
              className="mt-5 block text-3xl font-bold text-orange-400 transition hover:text-orange-300"
            >
              02161 6202538
            </a>

            <p className="mt-3 text-xs text-white/60">
              Montag bis Freitag · 9 bis 18 Uhr
            </p>

            <div className="mt-8">
              <Link
                href="/booking"
                className="inline-flex items-center justify-center rounded-2xl bg-orange-500 px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-orange-600"
              >
                Termin vereinbaren
              </Link>
            </div>

          </div>
        </div>

<div className="mt-6 flex justify-start">
  <div className="rounded-xl bg-white/90 px-3 py-2 shadow-[0_0_24px_rgba(255,255,255,0.18)]">
    <Image
      src="/images/bdeb_banner.png"
      alt="BDEB Verbandsmitglied"
      width={300}
      height={90}
      className="h-auto w-[210px] sm:w-[250px] object-contain"
    />
  </div>
</div>

        {/* Bottom */}
        <div className="mt-20 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <span>
            © 2026 StromDealz Energieberatung
          </span>

          <span className="text-center md:text-right">
            Dein Strom. Dein Deal.
          </span>
        </div>

      </div>
    </footer>
  );
}
