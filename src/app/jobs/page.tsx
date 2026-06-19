"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";

type FormErrors = {
  salutation?: string;
  firstName?: string;
  lastName?: string;
  position?: string;
  age?: string;
  coverLetter?: string;
  resume?: string;
  privacyAccepted?: string;
  otherFiles?: string;
};

export default function JobsPage() {
  const [salutation, setSalutation] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [position, setPosition] = useState("");
  const [age, setAge] = useState("");
  const [coverLetter, setCoverLetter] = useState<File | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [otherFiles, setOtherFiles] = useState<File[]>([]);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const otherFilesLabel = useMemo(() => {
    if (otherFiles.length === 0) return "Keine zusätzlichen Anhänge ausgewählt";
    if (otherFiles.length === 1) return otherFiles[0].name;
    return `${otherFiles.length} zusätzliche Anhänge ausgewählt`;
  }, [otherFiles]);

  function validate(): FormErrors {
    const newErrors: FormErrors = {};

    if (!salutation.trim()) newErrors.salutation = "Bitte wählen Sie eine Ansprache aus.";
    if (!firstName.trim()) newErrors.firstName = "Bitte geben Sie Ihren Vornamen ein.";
    if (!lastName.trim()) newErrors.lastName = "Bitte geben Sie Ihren Namen ein.";
    if (!position.trim()) newErrors.position = "Bitte geben Sie die gewünschte Stelle ein.";

    if (!age.trim()) {
      newErrors.age = "Bitte geben Sie Ihr Alter ein.";
    } else {
      const ageNumber = Number(age);
      if (!Number.isFinite(ageNumber) || ageNumber < 14 || ageNumber > 100) {
        newErrors.age = "Bitte geben Sie ein gültiges Alter ein.";
      }
    }

    if (!coverLetter) newErrors.coverLetter = "Bitte laden Sie ein Motivschreiben hoch.";
    if (!resume) newErrors.resume = "Bitte laden Sie Ihren Lebenslauf hoch.";
    if (!privacyAccepted) {
      newErrors.privacyAccepted = "Bitte stimmen Sie der Verarbeitung Ihrer personenbezogenen Daten zu.";
    }

    if (otherFiles.length > 3) {
      newErrors.otherFiles = "Es sind maximal 3 zusätzliche Anhänge erlaubt.";
    }

    return newErrors;
  }

  function handleOtherFilesChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    setOtherFiles(files.slice(0, 3));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setSubmitted(false);
      return;
    }

    setSubmitted(true);

    // Platz für spätere Anbindung an API oder E Mail Versand
    console.log({
      salutation,
      firstName,
      lastName,
      position,
      age,
      coverLetter,
      resume,
      photo,
      otherFiles,
      privacyAccepted,
    });
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#163a63_0%,#245a94_52%,#dbe7f3_100%)]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-[-8%] top-[8%] h-44 w-44 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute right-[8%] top-[14%] h-52 w-52 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute left-[35%] bottom-[-10%] h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="containerPad relative z-10 py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-4xl text-center text-white">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/75">
              Karriere
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Aktuell keine offenen Stellenangebote
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/88 sm:text-lg">
              Sie möchten sich initiativ bei uns bewerben? Dann senden Sie uns
              gerne Ihre Unterlagen über das nachstehende Formular.
            </p>
          </div>
        </div>
      </section>

      <section className="relative -mt-6 pb-14 sm:-mt-8 sm:pb-16 lg:-mt-10 lg:pb-20">
        <div className="containerPad">
          <div className="mx-auto max-w-4xl rounded-[32px] border border-slate-200/70 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Initiativbewerbung
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                Bitte füllen Sie das Formular vollständig aus. Pflichtfelder sind
                entsprechend erforderlich. Foto und sonstige Anhänge sind
                freiwillig.
              </p>
            </div>

            {submitted && (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                Ihre Bewerbung wurde lokal geprüft und ist bereit für die weitere
                technische Anbindung.
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-8" noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="salutation"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Ansprache *
                  </label>
                  <select
                    id="salutation"
                    value={salutation}
                    onChange={(e) => setSalutation(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#245a94] focus:ring-4 focus:ring-[#245a94]/10"
                  >
                    <option value="">Bitte auswählen</option>
                    <option value="Frau">Frau</option>
                    <option value="Herr">Herr</option>
                    <option value="Divers">Divers</option>
                  </select>
                  {errors.salutation && (
                    <p className="mt-2 text-sm text-rose-600">{errors.salutation}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Vorname *
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#245a94] focus:ring-4 focus:ring-[#245a94]/10"
                    placeholder="Vorname"
                  />
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-rose-600">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Name *
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#245a94] focus:ring-4 focus:ring-[#245a94]/10"
                    placeholder="Name"
                  />
                  {errors.lastName && (
                    <p className="mt-2 text-sm text-rose-600">{errors.lastName}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="position"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Ich bewerbe mich für eine Stelle als *
                  </label>
                  <input
                    id="position"
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#245a94] focus:ring-4 focus:ring-[#245a94]/10"
                    placeholder="Freie Eingabe"
                  />
                  {errors.position && (
                    <p className="mt-2 text-sm text-rose-600">{errors.position}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
  htmlFor="age"
  className="mb-2 block text-sm font-semibold text-slate-800"
>
  Ich bin {age || "…"} Jahre alt *
</label>
<input
  id="age"
  type="number"
  min="14"
  max="100"
  inputMode="numeric"
  value={age}
  onChange={(e) => setAge(e.target.value)}
  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#245a94] focus:ring-4 focus:ring-[#245a94]/10"
  placeholder="Alter"
/>
                  {errors.age && (
                    <p className="mt-2 text-sm text-rose-600">{errors.age}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="coverLetter"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Motivationsschreiben *
                  </label>
                  <input
                    id="coverLetter"
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => setCoverLetter(e.target.files?.[0] ?? null)}
                    className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-800 hover:file:bg-slate-200"
                  />
                  {errors.coverLetter && (
                    <p className="mt-2 text-sm text-rose-600">{errors.coverLetter}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="resume"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Lebenslauf *
                  </label>
                  <input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => setResume(e.target.files?.[0] ?? null)}
                    className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-800 hover:file:bg-slate-200"
                  />
                  {errors.resume && (
                    <p className="mt-2 text-sm text-rose-600">{errors.resume}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="photo"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Foto Upload
                  </label>
                  <input
                    id="photo"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
                    className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-800 hover:file:bg-slate-200"
                  />
                  <p className="mt-2 text-xs text-slate-500">Freiwillig</p>
                </div>

                <div>
                  <label
                    htmlFor="otherFiles"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Sonstige Anhänge
                  </label>
                  <input
                    id="otherFiles"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                    onChange={handleOtherFilesChange}
                    className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-800 hover:file:bg-slate-200"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Optional, bis zu 3 Anhänge möglich
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{otherFilesLabel}</p>
                  {errors.otherFiles && (
                    <p className="mt-2 text-sm text-rose-600">{errors.otherFiles}</p>
                  )}
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-slate-50 px-5 py-5 sm:px-6 sm:py-6">
                <p className="text-sm leading-7 text-slate-700">
                  Ich erkläre mich damit einverstanden, dass meine im Rahmen der
                  Bewerbung übermittelten personenbezogenen Daten zum Zweck der
                  Bearbeitung und Prüfung meiner Bewerbung verarbeitet werden. *
                </p>

                <label className="mt-4 flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={privacyAccepted}
                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-[#245a94] focus:ring-[#245a94]"
                  />
                  <span className="text-sm text-slate-700">
                    Ich stimme der Verarbeitung meiner personenbezogenen Daten zu.
                  </span>
                </label>

                {errors.privacyAccepted && (
                  <p className="mt-3 text-sm text-rose-600">
                    {errors.privacyAccepted}
                  </p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-[#163a63] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(22,58,99,0.16)] transition hover:-translate-y-[1px] hover:bg-[#1d4a7a]"
                >
                  Bewerbung absenden
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}