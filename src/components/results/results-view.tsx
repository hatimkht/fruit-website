"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Share2, ScrollText, Check } from "lucide-react";
import type { ResultsPayload } from "@/types/results";
import { formatInt } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RawDistribution } from "./raw-distribution";
import { ThresholdSummary } from "./threshold-summary";
import { TransferFlow } from "./transfer-flow";
import { FinalResult } from "./final-result";
import { Parliament } from "./parliament";
import { Explanation } from "./explanation";

export function ResultsView({ data }: { data: ResultsPayload }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const payload = {
      title: "Präferenzwahl — Demonstrationsmodell",
      text: "Aggregierte Ergebnisse einer Simulation mit drei Präferenzen.",
      url,
    };
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share(payload);
        return;
      } catch {
        // user dismissed — fall through to copy fallback
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  }

  return (
    <div className="container py-14 sm:py-20">
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 border-b border-rule pb-10 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.18em] text-ink-subtle">
            Aggregierte Auswertung · Live
          </p>
          <h1 className="mt-3 font-serif text-hero text-ink">
            So hat die Simulation entschieden
          </h1>
          <p className="mt-3 text-ink-muted leading-relaxed">
            Basierend auf {formatInt(data.totalBallots)} anonymen Stimmzettel
            {data.totalBallots === 1 ? "" : "n"}. Alle Zahlen werden bei jeder
            neuen Stimmabgabe aktualisiert.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/vote/step-1">
              <RefreshCw className="h-3.5 w-3.5" />
              Neue Auswahl
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={share}>
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Link kopiert
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5" />
                Ergebnis teilen
              </>
            )}
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/methodology">
              <ScrollText className="h-3.5 w-3.5" />
              Methodik
            </Link>
          </Button>
        </div>
      </motion.header>

      <div className="mt-14 grid grid-cols-1 gap-14">
        {data.totalBallots === 0 ? (
          <EmptyState />
        ) : (
          <>
            <Section
              kicker="A · Rohverteilung"
              title="Erststimmen vor der Hürde"
              description="Reine Auszählung aller ersten Präferenzen, bevor die 5%-Hürde angewendet wird. Die gestrichelte Linie markiert die Schwelle."
            >
              <RawDistribution data={data} />
            </Section>

            <Section
              kicker="B · 5%-Hürde"
              title="Wer zieht ein, wer scheidet aus?"
              description="Nur Parteien mit mindestens 5 % ziehen ins Endergebnis ein. Stimmen der übrigen Parteien werden nicht verworfen — sie wandern im nächsten Schritt weiter."
            >
              <ThresholdSummary data={data} />
            </Section>

            <Section
              kicker="C · Übertragung"
              title="Wohin die Stimmen wandern"
              description="Ausgeschiedene Stimmen werden auf die Zweit-, notfalls auf die Drittstimme übertragen. Stärke der Linien entspricht dem Stimmvolumen."
            >
              <TransferFlow data={data} />
            </Section>

            <Section
              kicker="D · Endergebnis"
              title="Nach Anwendung aller Regeln"
              description="Nur noch die qualifizierten Parteien, inklusive übertragener Stimmen. Anteile beziehen sich weiterhin auf alle Stimmen."
            >
              <FinalResult data={data} />
            </Section>

            <Section
              kicker="E · Sitzverteilung"
              title="Halbrund — stilisiertes Parlament"
              description="Proportionale Sitzverteilung nach Sainte-Laguë/Schepers auf die qualifizierten Parteien."
            >
              <Parliament data={data} />
            </Section>

            <Section kicker="F · Lesehilfe" title="" description="">
              <Explanation data={data} />
            </Section>
          </>
        )}
      </div>
    </div>
  );
}

function Section({
  kicker,
  title,
  description,
  children,
}: {
  kicker: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.45 }}
      className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]"
    >
      <header className="md:pt-1">
        <p className="text-[11px] uppercase tracking-[0.18em] text-ink-subtle">
          {kicker}
        </p>
        {title && (
          <h2 className="mt-2 font-serif text-2xl leading-snug text-ink">
            {title}
          </h2>
        )}
        {description && (
          <p className="mt-2 text-sm text-ink-muted leading-relaxed">
            {description}
          </p>
        )}
      </header>
      <div>{children}</div>
    </motion.section>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-rule bg-paper-50 p-14 text-center">
      <p className="font-serif text-2xl text-ink">
        Noch keine Stimmen in der Simulation.
      </p>
      <p className="mx-auto mt-3 max-w-md text-sm text-ink-muted">
        Sei die erste Teilnehmerin oder der erste Teilnehmer — sobald Stimmen
        eintreffen, erscheinen hier die aggregierten Ergebnisse.
      </p>
      <div className="mt-6">
        <Button asChild size="md" variant="accent">
          <Link href="/vote/step-1">Simulation starten</Link>
        </Button>
      </div>
    </div>
  );
}
