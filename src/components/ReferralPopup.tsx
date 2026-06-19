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
        @keyframes popup-slide-in-mobile {
          from { opacity: 0; transform: translateY(100%); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popup-slide-out-mobile {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(100%); }
        }
        @keyframes popup-slide-in-desktop {
          from { opacity: 0; transform: translateY(32px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes popup-slide-out-desktop {
          from { opacity: 1; transform: translateY(0) scale(1); }
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
          animation: popup-slide-in-mobile 0.38s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .referral-popup.hiding {
          animation: popup-slide-out-mobile 0.3s ease-in forwards;
        }

        @media (min-width: 640px) {
          .referral-popup {
            animation: popup-slide-in-desktop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
          .referral-popup.hiding {
            animation: popup-slide-out-desktop 0.35s ease-in forwards;
          }
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
        .popup-top-bar {
          background: linear-gradient(90deg, #0f75bc 0%, #38bdf8 50%, #0b609b 100%);
          background-size: 200% auto;
          animation: shimmer 2.5s linear infinite;
        }
      `}</style>

      <div
        className={`referral-popup fixed z-50 ${
          animating ? "" : "hiding"
        }
          bottom-0 left-0 right-0
          sm:bottom-6 sm:right-6 sm:left-auto sm:w-[340px]
        `}
        role="dialog"
        aria-label="Empfehlungsprogramm"
      >
        <div className="relative bg-white shadow-2xl overflow-hidden border-t border-slate-200 rounded-t-3xl sm:rounded-3xl sm:border sm:border-slate-100">
          <div className="popup-top-bar h-1 w-full" />

          <button
            onClick={dismiss}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-500 leading-none transition hover:bg-slate-200 hover:text-slate-800"
            aria-label="Schließen"
          >
            ×
          </button>

          <div className="px-5 pt-5 pb-6 sm:px-5 sm:pt-6 sm:pb-5">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="badge-pulse flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-black text-white shadow-lg"
                style={{ background: "linear-gradient(135deg, #0f75bc 0%, #0b609b 100%)" }}
              >
                50€
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#0f75bc] mb-0.5">
                  Treueaktion
                </p>
                <h3 className="text-base font-bold text-slate-900 leading-snug sm:text-[17px]">
                  Freunde empfehlen &amp; Gutschein sichern!
                </h3>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-600 mb-5">
              Empfehlen Sie StromDealz weiter. Bei einem erfolgreichen Vertragsabschluss
              erhalten Sie{" "}
              <strong className="text-slate-800">50 € Gutschein</strong> als Dankeschön.
            </p>

            <div className="flex flex-col gap-2 sm:flex-col">
              <Link
                href="/empfehlung"
                onClick={dismiss}
                className="shimmer-btn block w-full rounded-2xl px-5 py-3.5 text-center text-sm font-bold text-white transition hover:opacity-90 active:scale-95"
              >
                Jetzt empfehlen →
              </Link>
              <button
                onClick={dismiss}
                className="block w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-center text-sm text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
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
