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

export default function Step2Page() {
  const router = useRouter();
  const { first, second } = useBallotStore((s) => s.ballot);
  const setPreference = useBallotStore((s) => s.setPreference);
  const activeParties = PARTIES.filter((p) => p.active);

  // Hard guard: if the previous step wasn't completed, send them back.
  useEffect(() => {
    if (!first) router.replace("/vote/step-1");
  }, [first, router]);

  if (!first) return null;

  return (
    <div className="space-y-12">
      <ProgressStepper current={2} />

      <header className="mx-auto max-w-2xl space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-ink-subtle">
          Schritt 2 von 4
        </p>
        <h1 className="font-serif text-hero text-ink">
          Lege deine zweite Präferenz fest
        </h1>
        <p className="text-ink-muted leading-relaxed">
          Diese Stimme greift nur, falls deine erste Partei an der 5%-Hürde
          scheitert. Sie kann nicht mit deiner ersten Wahl identisch sein.
        </p>
      </header>

      <PartyPicker
        parties={activeParties}
        value={second}
        disabledIds={[first]}
        onChange={(id) => setPreference(2, id)}
      />

      <div className="sticky bottom-4 z-10 mx-auto flex max-w-3xl items-center justify-between rounded-full border border-rule bg-paper/90 p-2 pl-5 shadow-paper backdrop-blur">
        <Button asChild variant="ghost" size="sm">
          <Link href="/vote/step-1">
            <ArrowLeft className="h-4 w-4" />
            Zurück
          </Link>
        </Button>
        <Button
          size="md"
          disabled={!second}
          onClick={() => router.push("/vote/step-3")}
        >
          Weiter
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
