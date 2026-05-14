import Link from "next/link";
import { ArrowRight, CheckCircle2, Layers, Route, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: CheckCircle2,
    title: "Erste Präferenz wählen",
    text:
      "Wähle die Partei, die du wirklich bevorzugst — unabhängig von taktischen Erwägungen.",
  },
  {
    icon: Layers,
    title: "Fallback-Präferenzen festlegen",
    text:
      "Zwei weitere Stimmen greifen, wenn deine bevorzugte Partei an der 5%-Hürde scheitert.",
  },
  {
    icon: Route,
    title: "Transparent nachvollziehen",
    text:
      "Die Auswertung zeigt im Detail, wie Stimmen übertragen und gewichtet wurden.",
  },
];

export default function Page() {
  return (
    <>
      <section className="container pt-20 pb-16 sm:pt-28 sm:pb-24">
        <div className="max-w-3xl">
          <Badge variant="outline" className="mb-7 animate-fade-up">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            Hypothetisches Simulationsmodell
          </Badge>
          <h1 className="font-serif text-display font-light text-ink animate-fade-up">
            Ehrliche Präferenz<span className="text-ink-subtle">,</span>
            <br />
            statt taktisches Wählen.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-muted animate-fade-up [animation-delay:80ms]">
            Diese Demonstration simuliert ein Wahlsystem mit drei Stimmen: Scheitert
            deine bevorzugte Partei an der 5%-Hürde, greifen deine Fallback-Stimmen.
            Keine Stimme verfällt ungesehen — jede Übertragung ist nachvollziehbar.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center animate-fade-up [animation-delay:160ms]">
            <Button asChild size="lg" className="group">
              <Link href="/vote/step-1">
                Starten
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/methodology" className="gap-1.5">
                <ScrollText className="h-4 w-4" />
                Methodik lesen
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="hairline-divider" />
      </div>

      <section className="container py-20">
        <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="max-w-xl font-serif text-hero text-ink">
            So funktioniert die Simulation
          </h2>
          <p className="max-w-sm text-sm text-ink-muted">
            In drei Schritten zur ehrlichen Stimmabgabe — die Auswertung zeigt
            transparent, wie dein Votum tatsächlich zählt.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Card
                key={f.title}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <CardContent className="flex h-full flex-col gap-4 p-7">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-tint text-accent">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <div className="space-y-1.5">
                    <CardTitle>{f.title}</CardTitle>
                    <CardDescription>{f.text}</CardDescription>
                  </div>
                  <span className="mt-auto text-xs uppercase tracking-[0.14em] text-ink-subtle">
                    Schritt {i + 1}
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="mx-auto mt-14 max-w-2xl text-center text-xs leading-relaxed text-ink-subtle">
          Hinweis: Dieses Modell ist eine öffentlich einsehbare Demonstration. Es
          hat keine rechtliche Wirkung, repräsentiert keine politische Position
          und spricht keine Empfehlung aus.
        </p>
      </section>
    </>
  );
}
