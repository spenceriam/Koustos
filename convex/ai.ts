"use node";
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getOpenAI, MODEL, MAX_TOKENS } from "../lib/openai";
const openai = getOpenAI();

function sanitizeNoEmoji(text: string): string {
  // Remove common emoji ranges; conservative to ensure none leak
  return text.replace(/[\p{Emoji}\p{Extended_Pictographic}]/gu, "");
}

export const respond = mutation({
  args: { reportId: v.id("reports"), answer: v.string() },
  handler: async (ctx, { reportId, answer }) => {
    const report = await ctx.db.get(reportId);
    if (!report) throw new Error("Report not found");

    // Determine state
    const hasA1 = !!report.ai_a1;
    const hasQ2 = !!report.ai_q2;
    const hasA2 = !!report.ai_a2;

    if (hasA2) {
      throw new Error("Conversation already complete");
    }

    if (!hasA1) {
      await ctx.db.patch(reportId, { ai_a1: answer });
      const ai_q2 = "What would need to be fixed for you to consider this bug resolved?";
      await ctx.db.patch(reportId, { ai_q2 });
      return { nextQuestion: ai_q2 };
    }

    if (!hasQ2) {
      // Should not happen, but guard
      const ai_q2 = "What would need to be fixed for you to consider this bug resolved?";
      await ctx.db.patch(reportId, { ai_q2 });
      return { nextQuestion: ai_q2 };
    }

    // This is answer to Q2 → produce formatted draft
    await ctx.db.patch(reportId, { ai_a2: answer });

    const prompt = [
      {
        role: "system" as const,
        content:
          "Bug report assistant. NO EMOJIS. Ask exactly 2 concise questions then stop. English only. Format sections: Description, Environment, Steps to Reproduce, Expected Behavior, Resolution Criteria.",
      },
      {
        role: "user" as const,
        content: `${report.raw_input}\nQ1: ${report.ai_q1}\nA1: ${report.ai_a1}\nQ2: ${report.ai_q2}\nA2: ${answer}`,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: prompt,
      max_tokens: MAX_TOKENS,
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content ?? "";
    const formatted = sanitizeNoEmoji(content);
    await ctx.db.patch(reportId, { formatted_issue: formatted });
    return { formattedDraft: formatted };
  },
});


