import { NextRequest, NextResponse } from "next/server";
import { assertEnv } from "@/lib/env";
import { convexFinalizeSubmit } from "@/lib/convex";

export async function POST(req: NextRequest) {
  try {
    assertEnv();
    const { reportId, editMarkdown } = (await req.json()) as {
      reportId?: string;
      editMarkdown?: string;
    };
    if (!reportId) {
      return NextResponse.json({ error: "Missing reportId" }, { status: 400 });
    }
    const result = await convexFinalizeSubmit({ reportId, editMarkdown });
    return NextResponse.json(result);
  } catch (e: any) {
    const message = String(e?.message || "Internal error");
    return NextResponse.json({ error: message }, { status: 400 });
  }
}


