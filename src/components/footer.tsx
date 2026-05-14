export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-rule bg-paper-50">
      <div className="container flex flex-col gap-6 py-10 text-sm text-ink-muted sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-md">
          <p className="font-serif text-base text-ink">Präferenzwahl — Demonstrationsmodell</p>
          <p className="mt-2 leading-relaxed">
            Dieses Projekt ist eine hypothetische Simulation zur öffentlichen
            Diskussion über Wahlsysteme. Es ist keine offizielle Wahl und keine
            Empfehlung.
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-x-10 gap-y-2 text-ink-muted">
          <li><a className="hover:text-ink transition-colors" href="/methodology">Methodik</a></li>
          <li><a className="hover:text-ink transition-colors" href="/results">Aggregierte Ergebnisse</a></li>
          <li><a className="hover:text-ink transition-colors" href="/vote/step-1">Stimme abgeben</a></li>
          <li><a className="hover:text-ink transition-colors" href="/">Startseite</a></li>
        </ul>
      </div>
    </footer>
  );
}
