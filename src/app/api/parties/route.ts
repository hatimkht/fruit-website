import { NextResponse } from "next/server";
import { PARTIES } from "@/lib/parties";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ parties: PARTIES.filter((p) => p.active) });
}
