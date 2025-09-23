import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
  // Wired when Convex generation is available. Placeholder prevents build errors.
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}


