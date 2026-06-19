"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ReferralPopup() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;

    const dismissed = sessionStorage.getItem("referralPopupDismissed");
    if (dismissed) return;

    const timer = setTimeout(() => {
      setVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimating(true));
      });
    }, 6000);

    return () => clearTimeout(timer);
  }, [pathname]);

  function dismiss() {
    setAnimating(false);
    setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("referralPopupDismissed", "1");
    }, 350);
  }

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes popup-slide-in {
          from { opacity: 0; transform: translateY(32px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        @keyframes popup-slide-out {
          from { opacity: 1; transform: translateY(0)    scale(1); }
          to   { opacity: 0; transform: translateY(32px) scale(0.95); }
        }
        @keyframes badge-pulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.08); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .referral-popup {
          animation: popup-slide-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .referral-popup.hiding {
          animation: popup-slide-out 0.35s ease-in forwards;
        }
        .badge-pulse {
          animation: badge-pulse 2s ease-in-out infinite;
        }
        .shimmer-btn {
          background: linear-gradient(
            90deg,
            #0f75bc 0%,
            #1a9fe0 40%,
            #0f75bc 60%,
            #0b609b 100%
          );
          background-size: 200% auto;
          animation: shimmer 2.5s linear infinite;
        }
      `}</style>

      <div
        className={`fixed bottom-6 right-6 z-50 w-[340px] max-w-[calc(100vw-24px)] referral-popup ${!animating ? "hiding" : ""}`}
        role="dialog"
        aria-label="Empfehlungsprogramm"
      >
        <div className="relative rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0f75bc] via-[#38bdf8] to-[#0f75bc] bg-[length:200%] shimmer-btn" />

          <button
            onClick={dismiss}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 text-lg leading-none transition hover:bg-slate-200 hover:text-slate-800"
            aria-label="Schließen"
          >
            ×
          </button>

          <div className="px-5 pt-6 pb-5">
            <div className="flex items-start gap-3 mb-4">
              <div
                className="badge-pulse flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-black text-white shadow-lg"
                style={{ background: "linear-gradient(135deg, #0f75bc 0%, #0b609b 100%)" }}
              >
                50€
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#0f75bc] mb-0.5">
                  Treueaktion
                </p>
                <h3 className="text-[17px] font-bold text-slate-900 leading-snug">
                  Freunde empfehlen & Gutschein sichern!
                </h3>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-600 mb-5">
              Empfehlen Sie StromDealz weiter. Bei einem erfolgreichen Vertragsabschluss
              erhalten Sie <strong className="text-slate-800">50 € Gutschein</strong> als Dankeschön.
            </p>

            <div className="flex flex-col gap-2">
              <Link
                href="/empfehlung"
                onClick={dismiss}
                className="shimmer-btn block w-full rounded-2xl px-5 py-3 text-center text-sm font-bold text-white transition hover:opacity-90 active:scale-95"
              >
                Jetzt empfehlen →
              </Link>
              <button
                onClick={dismiss}
                className="block w-full rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-center text-sm text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
              >
                Später
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
