"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Pencil } from "lucide-react";
import { PARTIES } from "@/lib/parties";
import { useBallotStore } from "@/lib/store";
import { ProgressStepper } from "@/components/progress-stepper";
import { Ballot } from "@/components/ballot";
import { BallotUrn } from "@/components/ballot-urn";
import { Button } from "@/components/ui/button";

type SubmitState = "idle" | "stamping" | "dropping" | "submitted" | "error";

export default function ReviewPage() {
  const router = useRouter();
  const { first, second, third } = useBallotStore((s) => s.ballot);
  const reset = useBallotStore((s) => s.reset);

  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!first) router.replace("/vote/step-1");
    else if (!second) router.replace("/vote/step-2");
    else if (!third) router.replace("/vote/step-3");
  }, [first, second, third, router]);

  const rows = useMemo(() => {
    if (!first || !second || !third) return [];
    const find = (id: string) => PARTIES.find((p) => p.id === id)!;
    return [
      { rank: 1 as const, party: find(first) },
      { rank: 2 as const, party: find(second) },
      { rank: 3 as const, party: find(third) },
    ];
  }, [first, second, third]);

  if (!first || !second || !third) return null;

  async function handleSubmit() {
    setError(null);
    setState("stamping");
    try {
      // Stamp dwell — gives the animation time to read without feeling slow.
      await delay(720);
      setState("dropping");
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ first, second, third }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Unbekannter Fehler.");
      }
      await delay(1100);
      setState("submitted");
      reset();
      await delay(350);
      router.push("/results");
    } catch (e: unknown) {
      setState("error");
      setError(e instanceof Error ? e.message : "Unbekannter Fehler.");
    }
  }

  const busy = state !== "idle" && state !== "error";

  return (
    <div className="space-y-12">
      <ProgressStepper current={4} />

      <header className="mx-auto max-w-2xl space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-ink-subtle">
          Schritt 4 von 4
        </p>
        <h1 className="font-serif text-hero text-ink">
          Wahlzettel prüfen
        </h1>
        <p className="text-ink-muted leading-relaxed">
          Wenn alles passt, kannst du deinen Stimmzettel abgeben. Die Daten
          werden anonym gespeichert und fließen in die aggregierte Auswertung.
        </p>
      </header>

      <div className="relative mx-auto min-h-[540px] max-w-xl">
        <AnimatePresence mode="wait">
          {state !== "submitted" && (
            <motion.div
              key="ballot"
              initial={{ opacity: 0, y: 20 }}
              animate={
                state === "dropping"
                  ? {
                      opacity: 0,
                      y: 320,
                      scale: 0.35,
                      rotate: -2,
                      transition: { duration: 1.05, ease: [0.55, 0.05, 0.6, 1] },
                    }
                  : { opacity: 1, y: 0 }
              }
              exit={{ opacity: 0 }}
            >
              <Ballot rows={rows} stamped={state === "stamping" || state === "dropping"} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(state === "dropping" || state === "submitted") && (
            <motion.div
              key="urn"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center"
            >
              <BallotUrn className="w-40" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <div
          role="alert"
          className="mx-auto max-w-xl rounded-xl border border-threshold/40 bg-threshold-tint px-5 py-4 text-sm text-threshold"
        >
          {error} <span className="opacity-70">Bitte erneut versuchen.</span>
        </div>
      )}

      <div className="mx-auto flex max-w-xl flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <Button asChild variant="outline" size="md" disabled={busy}>
          <Link href="/vote/step-1">
            <Pencil className="h-4 w-4" />
            Bearbeiten
          </Link>
        </Button>
        <Button
          size="md"
          variant="accent"
          onClick={handleSubmit}
          disabled={busy}
          className="sm:min-w-[180px]"
        >
          {state === "idle" || state === "error" ? "Abgeben" : "Wird übertragen…"}
        </Button>
      </div>

      <p className="mx-auto max-w-md text-center text-xs text-ink-subtle">
        <Link href="/vote/step-3" className="underline underline-offset-4 hover:text-ink">
          <ArrowLeft className="mr-1 inline h-3 w-3" />
          Zur Drittstimme
        </Link>
      </p>
    </div>
  );
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
