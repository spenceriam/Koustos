import { ConvexHttpClient } from "convex/browser";

function getConvexUrl(): string {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;
  if (!url) {
    throw new Error("CONVEX_URL (or NEXT_PUBLIC_CONVEX_URL) missing");
  }
  return url;
}

function getClient(): ConvexHttpClient {
  const url = getConvexUrl();
  return new ConvexHttpClient(url);
}

export async function convexCreateProject(args: {
  pat: string;
  repo: string;
  email: string;
}): Promise<{ slug: string; url: string }> {
  const client = getClient();
  const res = (await client.mutation("projects:createProject", args)) as {
    slug: string;
    url: string;
  };
  return res;
}

export async function convexReportStart(args: {
  slug: string;
  name: string;
  email: string;
  description: string;
}): Promise<{ reportId: string; ai_q1: string }> {
  const client = getClient();
  const res = (await client.mutation("report:start", args)) as {
    reportId: string;
    ai_q1: string;
  };
  return res;
}

export async function convexAiRespond(args: {
  reportId: string;
  answer: string;
}): Promise<{ nextQuestion?: string; formattedDraft?: string }> {
  const client = getClient();
  const res = (await client.mutation("ai:respond", args)) as {
    nextQuestion?: string;
    formattedDraft?: string;
  };
  return res;
}

export async function convexFinalizeSubmit(args: {
  reportId: string;
  editMarkdown?: string;
}): Promise<{ issueUrl: string }> {
  const client = getClient();
  const res = (await client.mutation("finalize:submit", args)) as {
    issueUrl: string;
  };
  return res;
}



