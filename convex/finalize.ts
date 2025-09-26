"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { decryptString } from "./encryption";
import { Resend } from "resend";
import { removeEmojis } from "../lib/noEmoji";

const resend = new Resend(process.env.RESEND_API_KEY);

export const submit = action({
  args: { reportId: v.id("reports"), editMarkdown: v.optional(v.string()) },
  handler: async (ctx, { reportId, editMarkdown }) => {
    const report = await ctx.db.get(reportId);
    if (!report) throw new Error("Report not found");
    const project = await ctx.db.get(report.project_id);
    if (!project) throw new Error("Project not found");

    const pat = decryptString(project.github_pat_encrypted);

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

    // Emails (no emojis)
    const toMaintainer = {
      from: "bugs@koustos.dev",
      to: project.maintainer_email,
      subject: `New bug: ${title}`,
      html: `<h2>New Issue Created</h2><p><strong>Reporter:</strong> ${report.reporter_name}</p><a href="${json.html_url}">View Issue #${json.number} on GitHub</a>`,
    } as const;

    const toReporter = {
      from: "bugs@koustos.dev",
      to: report.reporter_email,
      subject: "Bug report submitted",
      html: `<h2>Thank You</h2><p>Your bug report has been submitted.</p><a href="${json.html_url}">Track on GitHub</a>`,
    } as const;

    await Promise.allSettled([
      resend.emails.send(toMaintainer as any),
      resend.emails.send(toReporter as any),
    ]);

    return { issueUrl: json.html_url };
  },
});


