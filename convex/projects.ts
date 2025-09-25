import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const project = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    return project;
  },
});

export const insert = mutation({
  args: {
    slug: v.string(),
    github_pat_encrypted: v.string(),
    repo_owner: v.string(),
    repo_name: v.string(),
    maintainer_email: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert("projects", { ...args, created_at: now });
    return id;
  },
});


