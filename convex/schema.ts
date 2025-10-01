import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "./betterAuthSchema";

export default defineSchema({
  ...authTables,

  projects: defineTable({
    user_id: v.id("user"),
    slug: v.string(),
    github_pat_encrypted: v.string(),
    repo_owner: v.string(),
    repo_name: v.string(),
    maintainer_email: v.optional(v.string()),
    created_at: v.number(),
    updated_at: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_user_repo", ["user_id", "repo_owner", "repo_name"]),

  shareable_urls: defineTable({
    user_id: v.id("user"),
    project_id: v.id("projects"),
    repo_full_name: v.string(),
    slug: v.string(),
    maintainer_email_snapshot: v.optional(v.string()),
    created_at: v.number(),
  })
    .index("by_user_repo", ["user_id", "repo_full_name"])
    .index("by_slug", ["slug"]),

  reports: defineTable({
    project_id: v.id("projects"),
    reporter_name: v.string(),
    reporter_email: v.optional(v.string()),
    raw_input: v.string(),
    ai_q1: v.optional(v.string()),
    ai_a1: v.optional(v.string()),
    ai_q2: v.optional(v.string()),
    ai_a2: v.optional(v.string()),
    formatted_issue: v.optional(v.string()),
    github_issue_number: v.optional(v.number()),
    created_at: v.number(),
    updated_at: v.optional(v.number()),
  })
    .index("by_project_created", ["project_id", "created_at"])
    .index("by_reporter_email", ["reporter_email"]),
});


