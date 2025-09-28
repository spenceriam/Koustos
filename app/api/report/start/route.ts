import { NextRequest, NextResponse } from "next/server";
import { assertEnv } from "@/lib/env";
import { convexReportStart } from "@/lib/convex";

export async function POST(req: NextRequest) {
  try {
    assertEnv();
    const { slug, name, email, description } = (await req.json()) as {
      slug?: string;
      name?: string;
      email?: string;
      description?: string;
    };
    if (!slug || !name || !email || !description) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const result = await convexReportStart({ slug, name, email, description });
    return NextResponse.json(result);
  } catch (e: any) {
    const message = String(e?.message || "Internal error");
    const status = /Too many reports|Invalid email|Missing/.test(message) ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}


