import { mutation, query } from "convex/server";
import { v } from "convex/values";
import { encryptString } from "./encryption";

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

export const createProject = mutation({
  args: {
    pat: v.string(),
    repo: v.string(),
    email: v.string(),
  },
  handler: async (ctx, { pat, repo, email }) => {
    // Basic validation (detailed checks are done client/server utils too)
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("Invalid email");
    const [owner, name] = repo.split("/");
    if (!owner || !name) throw new Error("Invalid repo format; expected owner/repo");

    // Validate PAT can access the repo (public):
    const [owner, name] = repo.split("/");
    const resp = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
      headers: { Authorization: `token ${pat}` },
    });
    if (!resp.ok) throw new Error("Invalid PAT or repository access");

    // Encrypt PAT
    const github_pat_encrypted = encryptString(pat);

    // Generate slug
    const slug = generateSlug();

    const now = Date.now();
    const id = await ctx.db.insert("projects", {
      slug,
      github_pat_encrypted,
      repo_owner: owner,
      repo_name: name,
      maintainer_email: email,
      created_at: now,
    });

    return { id, slug, url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/f/${slug}` };
  },
});

function generateSlug(): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return result;
}


