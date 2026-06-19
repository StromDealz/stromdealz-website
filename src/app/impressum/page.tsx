export default function ImpressumPage() {
  return (
    <main className="page">
      <section className="containerPad">
        <div className="card p-6 sm:p-8 max-w-3xl">
          <h1 className="h1">Impressum</h1>
          <p className="lead mt-3">Rechtliche Angaben und Kontaktinformationen zu StromDealz.</p>

          <div className="mt-8 space-y-6 text-sm text-slate-700 leading-relaxed">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Angaben gemäß § 5 TMG</h2>
              <p className="mt-2">
                <strong>Berater:</strong> Sendi Jaouadi Neffati<br />
                <strong>Unternehmen:</strong> StromDealz<br />
                <strong>Adresse:</strong><br />
                Quellstraße 25<br />
                41068 Mönchengladbach<br />
                Deutschland
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">Kontakt</h2>
              <p className="mt-2">
                Telefon: 02161 6202538<br />
                E Mail: info@stromdealz.de
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">Verantwortlich für den Inhalt</h2>
              <p className="mt-2">
                StromDealz<br />
                Sendi Jaouadi Neffati<br />
                Quellstraße 25<br />
                41068 Mönchengladbach
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">Haftung für Inhalte</h2>
              <p className="mt-2">
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
                Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen
                oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">Haftung für Links</h2>
              <p className="mt-2">
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben.
                Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">Urheberrecht</h2>
              <p className="mt-2">
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht.
                Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
