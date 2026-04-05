import { NextResponse } from "next/server";

const ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL || "";

export async function GET() {
  if (!ORCHESTRATOR_URL) {
    return NextResponse.json({ flows: [] });
  }
  try {
    const res = await fetch(`${ORCHESTRATOR_URL}/templates`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 30 },
    });
    if (!res.ok) return NextResponse.json({ flows: [] });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ flows: [] });
  }
}
