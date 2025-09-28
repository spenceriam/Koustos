import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { encryptString } from "./encryption";
import { generateSlug } from "../lib/slug";

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
  },
});

export const createProject = mutation({
  args: {
    userId: v.id("user"),
    pat: v.string(),
    repo: v.string(),
    email: v.string(),
  },
  handler: async (ctx, { userId, pat, repo, email }) => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      throw new Error("Invalid email");
    }

    const [owner, name] = repo.split("/");
    if (!owner || !name) {
      throw new Error("Invalid repo format; expected owner/repo");
    }

    const resp = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
      headers: { Authorization: `token ${pat}` },
    });
    if (!resp.ok) {
      throw new Error("Invalid PAT or repository access");
    }

    const slug = generateSlug();
    const encryptedPat = await encryptString(pat);
    const now = Date.now();

    const projectId = await ctx.db.insert("projects", {
      user_id: userId,
      slug,
      github_pat_encrypted: encryptedPat,
      repo_owner: owner,
      repo_name: name,
      maintainer_email: email,
      created_at: now,
    });

    await ctx.db.insert("shareable_urls", {
      user_id: userId,
      project_id: projectId,
      repo_full_name: `${owner}/${name}`,
      slug,
      maintainer_email_snapshot: email,
      created_at: now,
    });

    return { projectId, slug, owner, name };
  },
});
