import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { clampLength } from "../lib/validation";

async function ensureRateLimit(ctx: any, projectId: string) {
  // Simple fixed window: count reports in last hour
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  const count = await ctx.db
    .query("reports")
    .withIndex("by_project_created", (q: any) => q.eq("project_id", projectId as any))
    .filter((q: any) => q.gte(q.field("created_at"), oneHourAgo))
    .collect();
  if (count.length >= 10) throw new Error("Too many reports. Try again later.");
}

export const start = mutation({
  args: {
    slug: v.string(),
    name: v.string(),
    email: v.string(),
    description: v.string(),
  },
  handler: async (ctx, { slug, name, email, description }) => {
    const project = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (!project) throw new Error("Project not found");

    await ensureRateLimit(ctx, project._id);

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("Invalid email");
    if (!description.trim()) throw new Error("Description required");
    const safeDesc = clampLength(description, 2000);
    const safeName = clampLength(name, 120);
    const safeEmail = clampLength(email, 120);

    const now = Date.now();
    const reportId = await ctx.db.insert("reports", {
      project_id: project._id,
      reporter_name: safeName,
      reporter_email: safeEmail,
      raw_input: safeDesc,
      created_at: now,
    });

    // First question (deterministic prompt kept on client/spec)
    const ai_q1 = "What device and browser are you using, and what steps lead to the issue?";
    await ctx.db.patch(reportId, { ai_q1 });
    return { reportId, ai_q1 };
  },
});

export const getById = query({
  args: { reportId: v.id("reports") },
  handler: async (ctx, { reportId }) => {
    return await ctx.db.get(reportId);
  },
});

export const setA1Q2 = mutation({
  args: { reportId: v.id("reports"), a1: v.string(), q2: v.string() },
  handler: async (ctx, { reportId, a1, q2 }) => {
    await ctx.db.patch(reportId, { ai_a1: a1, ai_q2: q2 });
  },
});

export const setA2 = mutation({
  args: { reportId: v.id("reports"), a2: v.string() },
  handler: async (ctx, { reportId, a2 }) => {
    await ctx.db.patch(reportId, { ai_a2: a2 });
  },
});

export const setFormattedIssue = mutation({
  args: { reportId: v.id("reports"), formatted: v.string() },
  handler: async (ctx, { reportId, formatted }) => {
    await ctx.db.patch(reportId, { formatted_issue: formatted, updated_at: Date.now() });
  },
});

export const setIssueNumber = mutation({
  args: { reportId: v.id("reports"), number: v.number() },
  handler: async (ctx, { reportId, number }) => {
    await ctx.db.patch(reportId, { github_issue_number: number, updated_at: Date.now() });
  },
});


