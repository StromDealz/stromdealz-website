import Hero from "@/components/hero/Hero";
import TrustStats from "@/components/sections/TrustStats";
import ProviderShowcase from "@/components/sections/ProviderShowcaseSection";
import CTA from "@/components/sections/CTA";
import Script from "next/script";

export default function HomePage() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "StromDealz",
    url: "https://www.stromdealz.de",
    sameAs: [],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "StromDealz",
    alternateName: "StromDealz Energieberatung",
    url: "https://www.stromdealz.de",
  };

  return (
    <>
      <Script
        id="stromdealz-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="stromdealz-website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <main>
      <Hero />
      <ProviderShowcase />
      <TrustStats />
<div className="relative">
</div>
      
      <CTA />
          </main>
    </>
  );
}
