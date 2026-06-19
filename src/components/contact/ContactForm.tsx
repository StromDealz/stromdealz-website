"use client";

import Link from "next/link";
import { useState } from "react";

type FormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  privacyAccepted: boolean;
};

const subjectOptions = [
  "Ich möchte eine Stromberatung vereinbaren",
  "Ich habe eine Frage zu meinem aktuellen Vertrag",
  "Sie wurden mir empfohlen und ich möchte Sie zwecks Terminbuchung kontaktieren",
  "Ich wurde von Ihnen beraten und habe noch ein Anliegen",
  "Ich habe einen Vertrag bei Ihnen abgeschlossen und benötige Hilfe",
];

const initialForm: FormData = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  privacyAccepted: false,
};

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim() ||
      !formData.privacyAccepted
    ) {
      setErrorMessage("Bitte füllen Sie alle Pflichtfelder aus und bestätigen Sie den Datenschutz.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Die Anfrage konnte nicht verarbeitet werden.");
      }

      setSuccessMessage("Vielen Dank. Deine Nachricht wurde erfolgreich übermittelt.");
      setFormData(initialForm);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Es ist ein Fehler aufgetreten. Bitte versuche es später erneut."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="page bg-slate-50">
      <div className="containerPad">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <span className="pill">
              Kontakt
            </span>

            <h1 className="h1 mt-5 text-slate-900">
              Wir helfen Ihnen gerne weiter!
            </h1>

            <p className="lead mt-4">
              Nutzen Sie das Kontaktformular für Beratungsanfragen, Rückfragen zu bestehenden Verträgen
              oder für allgemeine Unterstützung rund um das Thema Strom und Gas.
            </p>
          </div>

          <div className="card p-6 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-800">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Vorname und Nachname"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-800">
                    E Mail <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="deine@email.de"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-slate-800">
                    Telefon <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="0176 12345678"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm font-semibold text-slate-800">
                    Betreff <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={(e) => updateField("subject", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                  >
                    <option value="">Bitte auswählen</option>
                    {subjectOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-semibold text-slate-800">
                  Nachricht <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={7}
                  value={formData.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  placeholder="Beschreiben Sie hier bitte Ihr Anliegen."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <label className="flex items-start gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.privacyAccepted}
                    onChange={(e) => updateField("privacyAccepted", e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300"
                  />
                  <span>
                    Ich habe die{" "}
                    <Link href="/datenschutz" className="font-semibold text-[rgb(var(--primary))] underline underline-offset-4">
                      Datenschutzerklärung
                    </Link>{" "}
                    gelesen und stimme der Verarbeitung meiner Daten zur Bearbeitung meiner Anfrage zu.
                    <span className="text-red-500"> *</span>
                  </span>
                </label>
              </div>

              {successMessage ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {successMessage}
                </div>
              ) : null}

              {errorMessage ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Pflichtfelder sind mit <span className="text-red-500">*</span> markiert.
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btnPrimary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Wird gesendet..." : "Anfrage absenden"}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-[0_8px_28px_rgba(2,6,23,0.06)]">
            <p className="font-semibold text-slate-900">
              Hinweis
            </p>
            <p className="mt-2">
              Ihre Anfrage wird direkt an unser Team weitergeleitet. Wir kümmern uns zeitnah um Ihr 			Anliegen. Bei Bedarf können Sie selbstverständlich auch jederzeit telefonisch Kontakt mit 		uns aufnehmen.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}