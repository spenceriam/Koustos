"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { decryptString } from "./encryption";
import { removeEmojis } from "../lib/noEmoji";

export const submit = action({
  args: { reportId: v.id("reports"), editMarkdown: v.optional(v.string()) },
  handler: async (ctx, { reportId, editMarkdown }) => {
    const report = await ctx.db.get(reportId);
    if (!report) throw new Error("Report not found");
    const project = await ctx.db.get(report.project_id);
    if (!project) throw new Error("Project not found");

    const pat = await decryptString(project.github_pat_encrypted);

    // Title heuristic: first line up to 80 chars
    const bodyRaw = (editMarkdown && editMarkdown.trim()) || report.formatted_issue || "";
    const bodyClean = removeEmojis(bodyRaw);
    const firstLine = bodyClean.split(/\r?\n/)[0]?.trim() || "New bug report";
    const title = removeEmojis(firstLine.replace(/^#+\s*/, "")).slice(0, 80);

    const issueBody = `${bodyClean}\n\n---\nReported via Koustos`;

    const res = await fetch(
      `https://api.github.com/repos/${project.repo_owner}/${project.repo_name}/issues`,
      {
        method: "POST",
        headers: {
          Authorization: `token ${pat}`,
          Accept: "application/vnd.github.v3+json",
        },
        body: JSON.stringify({ title, body: issueBody, labels: ["bug", "via-koustos"] }),
      }
    );
    if (!res.ok) throw new Error(`GitHub issue failed: ${res.status}`);
    const json = (await res.json()) as { number: number; html_url: string };

    await ctx.db.patch(reportId, { github_issue_number: json.number });

    // Email sending removed for MVP scale-back

    return { issueUrl: json.html_url };
  },
});


