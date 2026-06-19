import { locations } from "@/lib/locations";

export default function LocationList() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {locations.map((loc) => (
        <div
          key={loc.id}
          className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold">{loc.name}</h3>
          <p className="mt-2 text-slate-600">
            {loc.address}
            <br />
            {loc.city}
          </p>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2.5 h-2.5 rounded-full ${loc.openNow ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
              <span className={`text-sm font-medium ${loc.openNow ? 'text-emerald-700' : 'text-slate-500'}`}>
                {loc.openNow ? 'Geöffnet für Beratung' : 'Zurzeit keine Beratung an dem Standort'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{loc.hours || "Nach Vereinbarung"}</span>
            </div>
          </div>

          <p className="mt-4 text-sm font-medium text-blue-600">
            Einfach vorbeikommen – keine Terminbuchung nötig
          </p>
        </div>
      ))}
    </div>
  );
}
