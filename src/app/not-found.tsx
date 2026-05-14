import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center py-32 text-center">
      <p className="text-xs uppercase tracking-[0.18em] text-ink-subtle">
        404 · Nicht gefunden
      </p>
      <h1 className="mt-4 font-serif text-hero text-ink">
        Diese Seite existiert nicht.
      </h1>
      <p className="mt-3 max-w-md text-ink-muted">
        Möglicherweise wurde der Link verschoben oder ist veraltet.
      </p>
      <div className="mt-8">
        <Button asChild>
          <Link href="/">Zur Startseite</Link>
        </Button>
      </div>
    </div>
  );
}
