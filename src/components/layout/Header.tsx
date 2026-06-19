"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const nav = [
  { href: "/", label: "Start" },
  { href: "/standorte", label: "Aktuelle Standorte" },
  { href: "/nachreichen", label: "Zählernummer nachreichen" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[1000] border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="containerPad flex h-20 items-center justify-between md:h-24">
        {/* Logo */}
        <Link href="/" aria-label="Startseite" onClick={() => setMenuOpen(false)}>
          <Image
  src="/images/logo/stromdealz_logo_neu.png"
  alt="StromDealz Logo"
  width={280}
  height={80}
  priority
  className="h-18 w-auto object-contain md:h-22"
/>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 sm:gap-2 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/booking" className="btnPrimary ml-1">
            Termin buchen
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          type="button"
          aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
          className="relative z-50 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 md:hidden"
        >
          <span className="sr-only">Menü</span>
          <div className="flex flex-col items-center justify-center gap-1.5">
            <span className={`block h-0.5 w-5 bg-slate-700 transition ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-slate-700 transition ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-slate-700 transition ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
          <div className="containerPad flex flex-col py-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-slate-700 transition hover:bg-slate-50"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/booking"
              onClick={() => setMenuOpen(false)}
              className="btnPrimary mt-3 inline-flex justify-center"
            >
              Termin buchen
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}