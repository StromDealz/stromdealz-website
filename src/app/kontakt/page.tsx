import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Kontakt | StromDealz Energieberatung",
  description: "Kontaktformular für StromDealz. Jetzt Anfrage senden und persönlich beraten lassen.",
};

export default function KontaktPage() {
  return <ContactForm />;
}