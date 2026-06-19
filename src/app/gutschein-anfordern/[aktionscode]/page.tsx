import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GutscheinForm from "./GutscheinForm";
import { getGutscheinAktion } from "../../../lib/gutschein-aktionen";

type GutscheinPageProps = {
  params: Promise<{
    aktionscode: string;
  }>;
};

type ShopLogo =
  | {
      type: "logo";
      name: string;
      src: string;
    }
  | {
      type: "more";
      name: string;
    };

const shopLogos: ShopLogo[] = [
  {
    type: "logo",
    name: "Adidas",
    src: "/images/gutschein-shops/adidas.png",
  },
  {
    type: "logo",
    name: "Tchibo",
    src: "/images/gutschein-shops/tchibo.png",
  },
  {
    type: "logo",
    name: "OTTO",
    src: "/images/gutschein-shops/otto.png",
  },
  {
    type: "logo",
    name: "POCO",
    src: "/images/gutschein-shops/poco.png",
  },
  {
    type: "logo",
    name: "IKEA",
    src: "/images/gutschein-shops/ikea.png",
  },
  {
    type: "logo",
    name: "Müller",
    src: "/images/gutschein-shops/mueller.png",
  },
  {
    type: "logo",
    name: "Rituals",
    src: "/images/gutschein-shops/rituals.png",
  },
  {
    type: "logo",
    name: "Ankerkraut",
    src: "/images/gutschein-shops/ankerkraut.png",
  },
  {
    type: "logo",
    name: "Lieferando",
    src: "/images/gutschein-shops/lieferando.png",
  },
  {
    type: "logo",
    name: "Breuninger",
    src: "/images/gutschein-shops/breuninger.png",
  },
  {
    type: "logo",
    name: "Sephora",
    src: "/images/gutschein-shops/sephora.png",
  },
  {
    type: "logo",
    name: "H&M",
    src: "/images/gutschein-shops/hm.png",
  },
  {
    type: "logo",
    name: "Peek & Cloppenburg",
    src: "/images/gutschein-shops/peek-cloppenburg.png",
  },
  {
    type: "logo",
    name: "TK Maxx",
    src: "/images/gutschein-shops/tk-maxx.png",
  },
  {
    type: "logo",
    name: "Thalia",
    src: "/images/gutschein-shops/thalia.png",
  },
  {
    type: "logo",
    name: "Rossmann",
    src: "/images/gutschein-shops/rossmann.png",
  },
  {
    type: "logo",
    name: "Shop Apotheke",
    src: "/images/gutschein-shops/shop-apotheke.png",
  },
  {
    type: "logo",
    name: "Douglas",
    src: "/images/gutschein-shops/douglas.png",
  },
  {
    type: "logo",
    name: "Home24",
    src: "/images/gutschein-shops/home24.png",
  },
  {
    type: "logo",
    name: "Mister Spex",
    src: "/images/gutschein-shops/mister-spex.png",
  },
  {
    type: "logo",
    name: "toom",
    src: "/images/gutschein-shops/toom.png",
  },
  {
    type: "logo",
    name: "SIXT",
    src: "/images/gutschein-shops/sixt.png",
  },
  {
    type: "logo",
    name: "OBI",
    src: "/images/gutschein-shops/obi.png",
  },
  {
    type: "logo",
    name: "asambeauty",
    src: "/images/gutschein-shops/asam-beauty.png",
  },
  {
    type: "logo",
    name: "Lindt",
    src: "/images/gutschein-shops/lindt.png",
  },
  {
    type: "logo",
    name: "Spotify",
    src: "/images/gutschein-shops/spotify.png",
  },
  {
    type: "logo",
    name: "Bijou Brigitte",
    src: "/images/gutschein-shops/bijou-brigitte.png",
  },
  {
    type: "logo",
    name: "PlayStation",
    src: "/images/gutschein-shops/playstation.png",
  },
  {
    type: "logo",
    name: "Reishunger",
    src: "/images/gutschein-shops/reishunger.png",
  },
  {
    type: "logo",
    name: "BAUR",
    src: "/images/gutschein-shops/baur.png",
  },
  {
    type: "logo",
    name: "Xbox",
    src: "/images/gutschein-shops/xbox.png",
  },
  {
    type: "logo",
    name: "Uber Eats",
    src: "/images/gutschein-shops/ubereats.png",
  },
  {
    type: "more",
    name: "und viele mehr",
  },
];

export async function generateMetadata({
  params,
}: GutscheinPageProps): Promise<Metadata> {
  const { aktionscode } = await params;
  const aktion = getGutscheinAktion(aktionscode);

  if (!aktion) {
    return {
      title: "Gutscheinanforderung | StromDealz",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: "Gutschein anfordern | StromDealz",
    description:
      "Fordern Sie Ihren Aktionsgutschein nach erfolgreicher Prüfung Ihrer Unterlagen bei StromDealz an.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

function LogoItem({ item }: { item: ShopLogo }) {
  if (item.type === "more") {
    return (
      <div className="flex h-[68px] min-w-[174px] shrink-0 items-center justify-center rounded-2xl border border-orange-200 bg-orange-50 px-5">
        <span className="text-sm font-semibold text-orange-700">
          und viele mehr
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-[68px] min-w-[146px] shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5">
<img
  src={item.src}
  alt={`${item.name} Logo`}
  loading="eager"
  decoding="async"
  fetchPriority="high"
  className="max-h-[34px] w-auto max-w-[108px] object-contain"
/>
    </div>
  );
}

export default async function GutscheinAnfordernPage({
  params,
}: GutscheinPageProps) {
  const { aktionscode } = await params;
  const aktion = getGutscheinAktion(aktionscode);

  if (!aktion) {
    notFound();
  }

  const formatGutscheinwert = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(aktion.gutscheinwert);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <style>{`
        @keyframes stromdealz-gutschein-marquee {
          from {
            transform: translate3d(0, 0, 0);
          }

          to {
            transform: translate3d(-50%, 0, 0);
          }
        }

        .stromdealz-gutschein-track {
          display: flex;
          width: max-content;
          gap: 16px;
          padding-right: 16px;
          animation: stromdealz-gutschein-marquee 72s linear infinite;
          will-change: transform;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
        }

        @media (max-width: 768px) {
          .stromdealz-gutschein-track {
            animation-duration: 54s;
          }
        }

@media (prefers-reduced-motion: reduce) {
  .stromdealz-gutschein-track {
    animation-duration: 90s;
  }
}
      `}</style>

      {/* KOMPAKTER KOPFBEREICH */}
      <section className="border-b border-slate-200 bg-[#07162c] px-4 pb-8 pt-10 text-white sm:px-8 sm:pb-10 sm:pt-14 lg:px-10 lg:pb-12 lg:pt-16">
        <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-center">
          <div>
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-orange-100">
              StromDealz Gutscheinaktion
            </span>

            <h1 className="mt-5 max-w-4xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Jetzt Ihren {formatGutscheinwert} Gutscheincode bei StromDealz anfordern
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-200 sm:text-lg sm:leading-8">
              Bitte füllen Sie das Formular aus und laden Sie den erforderlichen
              Nachweis hoch. Nach erfolgreicher Prüfung erhalten Sie Ihren
              Gutscheincode im Wert von {formatGutscheinwert} per E-Mail.
            </p>
          </div>

          {/* WUNSCHGUTSCHEIN BILDPLATZHALTER */}
          <div className="mx-auto w-full max-w-[340px] lg:mx-0">
            <div className="rounded-[28px] border border-white/15 bg-white p-4 shadow-xl">
              <div className="flex min-h-[230px] items-center justify-center rounded-[22px] bg-gradient-to-br from-slate-50 via-white to-orange-50 p-4 sm:min-h-[250px]">
                <img
                  src="/images/gutschein/wunschgutschein-hero.png"
                  alt="Dein Wunschgutschein"
                  className="max-h-[220px] w-full max-w-[300px] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOGO BANNER DIREKT OBEN */}
      <section className="overflow-hidden border-b border-slate-200 bg-white py-6 sm:py-7">
        <div className="mx-auto mb-5 w-full max-w-6xl px-4 sm:px-8 lg:px-10">
          <p className="text-center text-sm font-medium text-slate-600 sm:text-base">
            Einlösbar bei vielen bekannten Shops und Marken
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-white to-transparent sm:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-white to-transparent sm:w-24" />

          <div className="stromdealz-gutschein-track">
            {shopLogos.map((item, index) => (
              <LogoItem key={`logo-a-${item.name}-${index}`} item={item} />
            ))}

            {shopLogos.map((item, index) => (
              <LogoItem key={`logo-b-${item.name}-${index}`} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* FORMULAR DIREKT DANACH */}
      <section className="px-4 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="mx-auto w-full max-w-4xl">
          <div className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
            <div className="mb-6 border-b border-slate-200 pb-5">
              <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Gutscheinanforderung
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                Tragen Sie Ihre Daten ein und laden Sie Ihren Nachweis zur
                ersten Abrechnung hoch.
              </p>
            </div>

            <GutscheinForm
              aktionscode={aktion.code}
              gutscheinwert={aktion.gutscheinwert}
              gutscheinTitel={aktion.titel}
            />
          </div>
        </div>
      </section>
    </main>
  );
}