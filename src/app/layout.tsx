import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "StromDealz | Energieberatung für Strom und Gas",
    template: "%s | StromDealz",
  },
  description:
    "StromDealz bietet persönliche Energieberatung für Strom und Gas. Transparente Unterstützung bei Tarifen, Preisen, Laufzeiten, Fristen und Anbieterwechsel.",
  keywords: [
    "StromDealz",
    "Energieberatung",
    "Stromberatung",
    "Gasberatung",
    "Stromvergleich",
    "Gasvergleich",
    "Tarifberatung",
    "NEW",
    "Eon",
    "Tarif wechseln",
    "Strom neu",
    "Gas wechseln",
    "Check24",
    "NRW",
    "Strom und Gas",
  ],
  applicationName: "StromDealz",
  authors: [{ name: "StromDealz" }],
  creator: "StromDealz",
  publisher: "StromDealz",
  metadataBase: new URL("https://www.stromdealz.de"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "StromDealz | Energieberatung für Strom und Gas",
    description:
      "Persönliche Beratung zu Strom und Gas. Verständliche Hilfe bei Tarifen, Preisen, Laufzeiten, Fristen und Anbieterwechsel.",
    url: "https://www.stromdealz.de",
    siteName: "StromDealz",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "StromDealz | Energieberatung für Strom und Gas",
    description:
      "Persönliche Beratung zu Strom und Gas. Verständlich, transparent und direkt.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="overflow-x-hidden">
        <Script id="scroll-to-top-on-page-change" strategy="afterInteractive">
          {`
            (function () {
              var lastPath = window.location.pathname + window.location.search;

              function scrollToTopIfPageChanged() {
                var currentPath = window.location.pathname + window.location.search;

                if (currentPath !== lastPath) {
                  lastPath = currentPath;

                  window.requestAnimationFrame(function () {
                    window.scrollTo({
                      top: 0,
                      left: 0,
                      behavior: "auto"
                    });
                  });
                }
              }

              var originalPushState = history.pushState;
              var originalReplaceState = history.replaceState;

              history.pushState = function () {
                originalPushState.apply(this, arguments);
                scrollToTopIfPageChanged();
              };

              history.replaceState = function () {
                originalReplaceState.apply(this, arguments);
                scrollToTopIfPageChanged();
              };

              window.addEventListener("popstate", function () {
                window.requestAnimationFrame(scrollToTopIfPageChanged);
              });

              document.addEventListener("click", function (event) {
                var link = event.target.closest && event.target.closest("a");

                if (!link) return;
                if (!link.href) return;
                if (link.target && link.target !== "_self") return;
                if (link.hasAttribute("download")) return;

                var nextUrl = new URL(link.href);
                var currentUrl = new URL(window.location.href);

                var isSameOrigin = nextUrl.origin === currentUrl.origin;
                var isDifferentPage =
                  nextUrl.pathname + nextUrl.search !==
                  currentUrl.pathname + currentUrl.search;

                if (isSameOrigin && isDifferentPage) {
                  setTimeout(function () {
                    window.scrollTo({
                      top: 0,
                      left: 0,
                      behavior: "auto"
                    });
                  }, 80);
                }
              });
            })();
          `}
        </Script>

        <Header />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}