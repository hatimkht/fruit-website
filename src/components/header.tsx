import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-rule bg-paper/80 backdrop-blur supports-[backdrop-filter]:bg-paper/60">
      <div className="container flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <span
            aria-hidden
            className="flex h-8 w-8 items-center justify-center rounded-full border border-rule bg-paper-50 text-ink"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              <path d="M4 19V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12" />
              <path d="M8 9h8M8 12h6M8 15h4" />
            </svg>
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-serif text-[15px] text-ink">Präferenzwahl</span>
            <span className="text-[11px] uppercase tracking-[0.12em] text-ink-subtle">
              Demonstrationsmodell
            </span>
          </span>
        </Link>
        <nav aria-label="Hauptnavigation" className="hidden items-center gap-8 text-sm text-ink-muted sm:flex">
          <Link className="hover:text-ink transition-colors" href="/methodology">
            Methodik
          </Link>
          <Link className="hover:text-ink transition-colors" href="/results">
            Aggregierte Ergebnisse
          </Link>
        </nav>
      </div>
    </header>
  );
}
