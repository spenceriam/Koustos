import { NextRequest, NextResponse } from "next/server";
import { assertEnv } from "@/lib/env";
import { convexCreateProject } from "@/lib/convex";

export async function POST(req: NextRequest) {
  try {
    assertEnv();
    const { pat, repo, email } = (await req.json()) as {
      pat?: string;
      repo?: string;
      email?: string;
    };
    if (!pat || !repo || !email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const { url } = await convexCreateProject({ pat, repo, email });
    return NextResponse.json({ url });
  } catch (e: any) {
    const message = String(e?.message || "Internal error");
    const status = /Invalid PAT|Invalid repo|Invalid email|Missing/.test(message) ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}


