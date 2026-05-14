"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container flex flex-col items-center justify-center py-32 text-center">
      <p className="text-xs uppercase tracking-[0.18em] text-threshold">
        Fehler · {error.digest ?? "unerwartet"}
      </p>
      <h1 className="mt-4 font-serif text-hero text-ink">
        Etwas ist schiefgelaufen.
      </h1>
      <p className="mt-3 max-w-md text-ink-muted">
        Das sollte nicht passieren. Versuch es bitte erneut oder kehre zur
        Startseite zurück.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <Button onClick={reset}>Erneut versuchen</Button>
        <Button asChild variant="outline">
          <Link href="/">Zur Startseite</Link>
        </Button>
      </div>
    </div>
  );
}
