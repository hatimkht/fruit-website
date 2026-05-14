"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PARTIES } from "@/lib/parties";
import { useBallotStore } from "@/lib/store";
import { PartyPicker } from "@/components/party-picker";
import { ProgressStepper } from "@/components/progress-stepper";
import { Button } from "@/components/ui/button";

export default function Step3Page() {
  const router = useRouter();
  const { first, second, third } = useBallotStore((s) => s.ballot);
  const setPreference = useBallotStore((s) => s.setPreference);
  const activeParties = PARTIES.filter((p) => p.active);

  useEffect(() => {
    if (!first) router.replace("/vote/step-1");
    else if (!second) router.replace("/vote/step-2");
  }, [first, second, router]);

  if (!first || !second) return null;

  return (
    <div className="space-y-12">
      <ProgressStepper current={3} />

      <header className="mx-auto max-w-2xl space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-ink-subtle">
          Schritt 3 von 4
        </p>
        <h1 className="font-serif text-hero text-ink">
          Wähle deine dritte Präferenz
        </h1>
        <p className="text-ink-muted leading-relaxed">
          Die letzte Fallback-Stimme. Sie greift nur, wenn auch deine zweite
          Präferenz die 5%-Hürde nicht erreicht.
        </p>
      </header>

      <PartyPicker
        parties={activeParties}
        value={third}
        disabledIds={[first, second]}
        onChange={(id) => setPreference(3, id)}
      />

      <div className="sticky bottom-4 z-10 mx-auto flex max-w-3xl items-center justify-between rounded-full border border-rule bg-paper/90 p-2 pl-5 shadow-paper backdrop-blur">
        <Button asChild variant="ghost" size="sm">
          <Link href="/vote/step-2">
            <ArrowLeft className="h-4 w-4" />
            Zurück
          </Link>
        </Button>
        <Button
          size="md"
          disabled={!third}
          onClick={() => router.push("/vote/review")}
        >
          Wahlzettel prüfen
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
