import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ELECTION_THRESHOLD, PARLIAMENT_SEATS } from "@/lib/parties";
import { formatPercent } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Methodik",
  description:
    "Regeln und Annahmen des hypothetischen Präferenzwahl-Modells — wie gezählt, übertragen und ausgewertet wird.",
};

export default function MethodologyPage() {
  return (
    <article className="container py-14 sm:py-20">
      <Link
        href="/"
        className="mb-10 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Zurück zur Startseite
      </Link>

      <header className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.18em] text-ink-subtle">Methodik</p>
        <h1 className="mt-3 font-serif text-display text-ink">
          Wie das Modell rechnet
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-ink-muted">
          Diese Seite beschreibt die Regeln dieser Simulation in klarer Sprache.
          Sie ist bewusst keine Nachbildung einer echten Bundestagswahl, sondern
          ein Gedankenexperiment: Was passiert, wenn Wählende drei Präferenzen
          angeben dürfen statt einer?
        </p>
      </header>

      <div className="mt-16 grid max-w-3xl grid-cols-1 gap-14 text-[15px] leading-[1.75] text-ink-soft">
        <Section number="1" title="Drei Stimmen pro Stimmzettel">
          <p>
            Jede Person gibt genau drei Präferenzen ab: eine Erststimme (die
            eigentliche Wunschpartei) und zwei Fallback-Stimmen. Die drei
            Stimmen müssen unterschiedliche Parteien sein — eine doppelte
            Nennung ist nicht möglich.
          </p>
        </Section>

        <Section number="2" title="Erststimmen zuerst zählen">
          <p>
            Zuerst werden alle Erststimmen regulär gezählt und als Prozentwert
            der Gesamtstimmen ausgewiesen. Das entspricht der Rohverteilung, die
            im Ergebnisabschnitt A dargestellt ist.
          </p>
        </Section>

        <Section number="3" title="5%-Hürde anwenden">
          <p>
            Parteien, deren Anteil an den Erststimmen unter{" "}
            {formatPercent(ELECTION_THRESHOLD)} liegt, sind für das Endergebnis
            nicht mehr qualifiziert. Sie scheiden aus der Zählung aus.
          </p>
        </Section>

        <Section number="4" title="Stimmen der Ausgeschiedenen weiterreichen">
          <p>
            Stimmzettel, deren Erststimme auf eine ausgeschiedene Partei fiel,
            werden nicht verworfen. Stattdessen wird pro Zettel die Zweitstimme
            geprüft. Ist die Zweitstimme-Partei noch qualifiziert, zählt die
            Stimme dort. Ist auch die Zweitstimme-Partei unter der Hürde, greift
            die Drittstimme.
          </p>
          <p className="mt-3">
            Greift auch die Drittstimme nicht — weil alle drei Präferenzen für
            Parteien unter der Hürde abgegeben wurden —, gilt der Zettel als
            erschöpft. Er zählt für niemanden.
          </p>
        </Section>

        <Section number="5" title="Prozentwerte nicht künstlich aufblähen">
          <p>
            Prozentwerte im Endergebnis beziehen sich weiterhin auf alle
            abgegebenen Stimmen, nicht nur auf die noch „im Rennen" liegenden.
            Verfallene Stimmen werden als solche ausgewiesen und zählen nicht
            zugunsten einer Partei. So bleibt der Gesamtbezug ehrlich.
          </p>
        </Section>

        <Section number="6" title="Sitzverteilung: Sainte-Laguë / Schepers">
          <p>
            Für die stilisierte Sitzverteilung werden die Sitze proportional zum
            Endergebnis auf die qualifizierten Parteien verteilt. Verwendet wird
            das Sainte-Laguë/Schepers-Verfahren, dasselbe wie bei realen
            Bundestagswahlen. Die Gesamtsitzzahl ist auf{" "}
            {PARLIAMENT_SEATS} festgelegt — rein zur Veranschaulichung.
          </p>
        </Section>

        <Section number="7" title="Was dieses Modell nicht abbildet">
          <p>Für die Klarheit der Demonstration wurden mehrere Aspekte bewusst ausgeklammert:</p>
          <ul className="mt-3 space-y-2 pl-5 list-disc marker:text-ink-subtle">
            <li>Erst- und Zweitstimme im Bundestags-Sinne (Direktkandidaten, Landeslisten).</li>
            <li>Überhang- und Ausgleichsmandate.</li>
            <li>Wahlkreise, Listenplätze, regionale Verteilung.</li>
            <li>Sonderregeln wie die Grundmandatsklausel.</li>
            <li>Strategisches Verhalten, das sich durch das Modell selbst ergäbe.</li>
          </ul>
        </Section>

        <Section number="8" title="Datenschutz">
          <p>
            Es werden ausschließlich die drei Partei-Referenzen pro Stimmzettel
            gespeichert — ohne IP-Adresse, Login oder sonstige Merkmale. Die
            Auswertung ist rein aggregiert und jederzeit öffentlich einsehbar.
          </p>
        </Section>
      </div>

      <div className="mx-auto mt-20 max-w-3xl rounded-2xl border border-rule bg-paper-50 px-7 py-6 text-sm text-ink-muted">
        <p className="font-serif text-base text-ink">Transparenz</p>
        <p className="mt-2 leading-relaxed">
          Die Simulationslogik steht in <code className="font-mono text-xs text-ink">src/lib/simulation.ts</code>.
          Regeln und Schwellenwerte sind dort zentral dokumentiert und lassen
          sich ohne Änderungen am UI anpassen.
        </p>
      </div>
    </article>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-baseline gap-4">
        <span className="font-serif text-sm text-ink-subtle">{number}</span>
        <h2 className="font-serif text-2xl text-ink">{title}</h2>
      </div>
      <div className="mt-4 pl-9">{children}</div>
    </section>
  );
}
