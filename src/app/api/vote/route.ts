import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { PARTIES } from "@/lib/parties";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z
  .object({
    first: z.string().min(1),
    second: z.string().min(1),
    third: z.string().min(1),
  })
  .refine((v) => v.first !== v.second, { message: "Zweite Präferenz darf nicht der ersten entsprechen." })
  .refine((v) => v.first !== v.third, { message: "Dritte Präferenz darf nicht der ersten entsprechen." })
  .refine((v) => v.second !== v.third, { message: "Dritte Präferenz darf nicht der zweiten entsprechen." });

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültiger Request-Body." }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(payload);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Validierung fehlgeschlagen.";
    return NextResponse.json({ error: msg }, { status: 422 });
  }

  const { first, second, third } = parsed.data;

  // Validate against the party catalog so we never store references to
  // parties that don't exist (or are inactive).
  const active = new Set(PARTIES.filter((p) => p.active).map((p) => p.id));
  for (const id of [first, second, third]) {
    if (!active.has(id)) {
      return NextResponse.json(
        { error: `Unbekannte oder inaktive Partei: ${id}` },
        { status: 422 },
      );
    }
  }

  try {
    const session = await prisma.voteSession.create({
      data: {
        submittedAt: new Date(),
        preferences: {
          create: [
            { partyId: first, rank: 1 },
            { partyId: second, rank: 2 },
            { partyId: third, rank: 3 },
          ],
        },
      },
      select: { id: true },
    });

    return NextResponse.json({ ok: true, sessionId: session.id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/vote: Stimme konnte nicht gespeichert werden.", err);
    return NextResponse.json(
      { error: "Stimme konnte nicht gespeichert werden. Bitte später erneut versuchen." },
      { status: 500 },
    );
  }
}
