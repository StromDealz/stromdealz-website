export default function DatenschutzPage() {
  return (
    <main className="page">
      <section className="containerPad">
        <div className="card p-6 sm:p-8 max-w-3xl">
          <h1 className="h1">Datenschutzerklärung</h1>
          <p className="lead mt-3">
            Der Schutz Ihrer persönlichen Daten ist uns wichtig. Nachfolgend informieren wir darüber,
            welche Daten im Rahmen unserer Dienstleistungen verarbeitet werden.
          </p>

          <div className="mt-8 space-y-6 text-sm text-slate-700 leading-relaxed">
            <div>
              <h2 className="text-base font-semibold text-slate-900">1. Verantwortlicher</h2>
              <p className="mt-2">
                StromDealz<br />
                Sendi Jaouadi Neffati<br />
                Quellstraße 25<br />
                41068 Mönchengladbach<br />
                Deutschland
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">2. Verarbeitung personenbezogener Daten</h2>
              <p className="mt-2">
                Personenbezogene Daten werden nur verarbeitet, wenn dies zur Durchführung unserer Dienstleistungen erforderlich ist oder Sie ausdrücklich eingewilligt haben.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">3. Terminbuchung</h2>
              <p className="mt-2">
                Bei der Buchung eines Beratungstermins werden personenbezogene Daten wie Name, Telefonnummer, E Mail Adresse sowie ggf. weitere Angaben erfasst.
                Diese Daten werden ausschließlich zur Terminabwicklung, Kontaktaufnahme und Vorbereitung der Beratung verwendet.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">4. Beratung und Vertragsprüfung</h2>
              <p className="mt-2">
                Im Rahmen der Energieberatung können weitere personenbezogene Daten verarbeitet werden, insbesondere Angaben zu Energieverträgen, Verbrauchsdaten, Abrechnungen
                und objektbezogene Informationen. Diese Verarbeitung erfolgt ausschließlich zur Durchführung der Beratung und Optimierung Ihrer Tarife.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">5. Weitergabe von Daten</h2>
              <p className="mt-2">
                Eine Weitergabe personenbezogener Daten an Dritte erfolgt nur, sofern dies zur Vertragserfüllung notwendig ist oder eine gesetzliche Verpflichtung besteht.
                Eine darüber hinausgehende Weitergabe findet nicht statt.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">6. Speicherdauer</h2>
              <p className="mt-2">
                Personenbezogene Daten werden nur so lange gespeichert, wie dies für die jeweiligen Zwecke erforderlich ist oder gesetzliche Aufbewahrungsfristen bestehen.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">7. Ihre Rechte</h2>
              <p className="mt-2">
                Sie haben das Recht auf Auskunft über die gespeicherten personenbezogenen Daten, deren Berichtigung, Löschung oder Einschränkung der Verarbeitung sowie ein
                Widerspruchsrecht gegen die Verarbeitung.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">8. Kontakt bei Datenschutzfragen</h2>
              <p className="mt-2">
                Bei Fragen zum Datenschutz können Sie sich jederzeit an uns wenden.<br />
                E Mail: info@stromdealz.de
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
