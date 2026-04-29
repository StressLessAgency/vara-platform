import { NextResponse } from "next/server";
import { triageConcierge } from "@/lib/anthropic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (typeof body?.description !== "string" || body.description.length < 4) {
      return NextResponse.json({ error: "description too short" }, { status: 400 });
    }
    const triage = await triageConcierge({
      category: body.category ?? "restaurant",
      description: body.description,
      needBy: body.needBy ?? new Date().toISOString(),
    });
    return NextResponse.json(triage);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
