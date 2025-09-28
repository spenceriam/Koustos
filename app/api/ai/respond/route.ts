import { NextRequest, NextResponse } from "next/server";
import { assertEnv } from "@/lib/env";
import { convexAiRespond } from "@/lib/convex";

export async function POST(req: NextRequest) {
  try {
    assertEnv();
    const { reportId, answer } = (await req.json()) as {
      reportId?: string;
      answer?: string;
    };
    if (!reportId || !answer) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const result = await convexAiRespond({ reportId, answer });
    return NextResponse.json(result);
  } catch (e: any) {
    const message = String(e?.message || "Internal error");
    return NextResponse.json({ error: message }, { status: 400 });
  }
}


