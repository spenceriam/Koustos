import { NextRequest, NextResponse } from "next/server";
import { assertEnv } from "@/lib/env";
import { convexCreateProject } from "@/lib/convex";

export async function POST(req: NextRequest) {
  try {
    assertEnv();
    const { pat, repo } = (await req.json()) as {
      pat?: string;
      repo?: string;
    };
    if (!pat || !repo) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const { url } = await convexCreateProject({ pat, repo });
    return NextResponse.json({ url });
  } catch (e: any) {
    const message = String(e?.message || "Internal error");
    const status = /Invalid PAT|Invalid repo|Missing/.test(message) ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}


