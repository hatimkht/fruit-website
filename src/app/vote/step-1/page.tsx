"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PARTIES } from "@/lib/parties";
import { useBallotStore } from "@/lib/store";
import { PartyPicker } from "@/components/party-picker";
import { ProgressStepper } from "@/components/progress-stepper";
import { Button } from "@/components/ui/button";

export default function Step1Page() {
  const router = useRouter();
  const first = useBallotStore((s) => s.ballot.first);
  const setPreference = useBallotStore((s) => s.setPreference);
  const activeParties = PARTIES.filter((p) => p.active);

  return (
    <div className="space-y-12">
      <ProgressStepper current={1} />

      <header className="mx-auto max-w-2xl space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-ink-subtle">
          Schritt 1 von 4
        </p>
        <h1 className="font-serif text-hero text-ink">
          Wähle deine erste Präferenz
        </h1>
        <p className="text-ink-muted leading-relaxed">
          Die Partei, der deine Stimme zuerst gelten soll. Wähle ehrlich — die
          Fallback-Stimmen greifen nur, wenn diese Partei an der 5%-Hürde scheitert.
        </p>
      </header>

      <PartyPicker
        parties={activeParties}
        value={first}
        onChange={(id) => setPreference(1, id)}
      />

      <div className="sticky bottom-4 z-10 mx-auto flex max-w-3xl items-center justify-between rounded-full border border-rule bg-paper/90 p-2 pl-5 shadow-paper backdrop-blur">
        <Button asChild variant="ghost" size="sm">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Zurück
          </Link>
        </Button>
        <Button
          size="md"
          disabled={!first}
          onClick={() => router.push("/vote/step-2")}
        >
          Weiter
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
