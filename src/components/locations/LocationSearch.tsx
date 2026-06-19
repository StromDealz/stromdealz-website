"use client";

import { useState } from "react";
import { locations, type Location } from "@/lib/locations";

export default function LocationSearch() {
  const [zip, setZip] = useState("");
  const [foundLocation, setFoundLocation] = useState<Location | null>(null);

  const [error, setError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (zip.length !== 5 || !/^\d+$/.test(zip)) {
      setError("Bitte geben Sie eine gültige 5-stellige Postleitzahl ein.");
      return;
    }

    // Suche nach exakter PLZ oder PLZ-Bereich
    const found = locations.find(l => l.zip === zip);
    
    if (found) {
      setFoundLocation(found);
    } else {
      // Wenn keine exakte Übereinstimmung, suche nach dem nächsten Standort in MG (da alle Standorte aktuell dort sind)
      // Oder zeige eine Nachricht, dass kein Standort direkt in dieser PLZ gefunden wurde
      setError("In diesem PLZ-Bereich haben wir aktuell keinen direkten Beratungsstandort. Besuchen Sie uns gerne an einem unserer anderen Standorte in Mönchengladbach!");
    }
  };

  return (
    <div className="mt-12 max-w-2xl mx-auto -translate-y-[13%]">
      <div className="rounded-3xl p-8 bg-slate-50/50 border border-slate-200/60 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Sind wir auch in Ihrer Nähe?</h2>
        <p className="text-slate-600 mb-6 leading-relaxed">
          Geben Sie Ihre Postleitzahl ein und entdecken Sie Ihren nächsten Beratungsstandort!
        </p>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Ihre PLZ (z.B. 41068)"
              className={`flex-1 rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 transition font-medium text-slate-900 placeholder:text-slate-400 placeholder:font-normal ${
                error ? "border-red-300 focus:ring-red-500 bg-red-50/30" : "border-slate-200 focus:ring-blue-500 bg-white"
              }`}
              value={zip}
              onChange={(e) => {
                setZip(e.target.value.replace(/\D/g, ""));
                if (error) setError(null);
              }}
              maxLength={5}
            />
            <button type="submit" className="btnPrimary">
              Suchen
            </button>
          </div>
          {error && (
            <p className="text-sm text-red-600 animate-in fade-in slide-in-from-top-1">
              {error}
            </p>
          )}
        </form>
      </div>

      {foundLocation && (
        <div className="fixed inset-0 z-[2000] flex items-start justify-center bg-slate-900/50 backdrop-blur-sm p-4 pt-10">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in fade-in slide-in-from-top-10 duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{foundLocation.name}</h3>
                <p className="text-sm text-slate-500">Ihr nächster Standort</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex gap-3">
                <div className="text-blue-500 mt-1">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-slate-900">{foundLocation.address}</p>
                  <p className="text-slate-500">{foundLocation.city}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="text-blue-500 mt-1">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Beratungszeiten:</p>
                  <p className="text-slate-500">{foundLocation.hours || "Nach Vereinbarung"}</p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-4 mb-6 border border-emerald-100 flex items-start gap-3">
              <div className="text-emerald-500 mt-0.5">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-emerald-800">
                {foundLocation.openNow ? 'Geöffnet für Beratung' : 'Zurzeit keine Beratung an dem Standort'} – Besuchen Sie uns ohne Termin!
              </p>
            </div>

            <button 
              onClick={() => setFoundLocation(null)}
              className="w-full btnPrimary"
            >
              Verstanden
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
