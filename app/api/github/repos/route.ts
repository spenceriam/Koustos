import { NextRequest, NextResponse } from "next/server";

interface GithubRepo {
  id: number;
  full_name: string;
  private: boolean;
  archived: boolean;
  owner: { login: string };
  name: string;
}

export async function POST(req: NextRequest) {
  try {
    const { pat } = (await req.json()) as { pat?: string };
    if (!pat) {
      return NextResponse.json({ error: "Missing PAT" }, { status: 400 });
    }

    const response = await fetch("https://api.github.com/user/repos?per_page=100&affiliation=owner,collaborator,organization_member", {
      headers: {
        Authorization: `token ${pat}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (response.status === 401) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!response.ok) {
      return NextResponse.json({ error: "GitHub request failed" }, { status: 500 });
    }

    const data = (await response.json()) as GithubRepo[];
    const repos = data
      .filter((repo) => !repo.archived)
      .map((repo) => ({
        id: repo.id,
        fullName: repo.full_name,
        private: repo.private,
        owner: repo.owner.login,
        name: repo.name,
      }));

    return NextResponse.json({ repos });
  } catch (error: any) {
    const message = String(error?.message || "Server error");
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
