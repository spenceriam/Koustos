import { betterAuth } from "better-auth";
import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
import { components } from "./betterAuthComponent/_generated/api";
import { mutation } from "./_generated/server";
import { v } from "convex/values";
// Magic link disabled in MVP

const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";
// GitHub OAuth disabled in MVP

// In dev, allow running without Google OAuth by omitting the provider
if (!githubClientId || !githubClientSecret) {
  throw new Error("GitHub OAuth credentials are missing in Convex env");
}

export const authComponent = createClient(components.betterAuth, {
  triggers: {
    onCreate: mutation({
      args: { model: v.string(), doc: v.any() },
      handler: async (ctx, args) => {
        await authComponent.triggers.onCreate(ctx, args);
      },
    }),
    onUpdate: mutation({
      args: { model: v.string(), oldDoc: v.any(), newDoc: v.any() },
      handler: async (ctx, args) => {
        await authComponent.triggers.onUpdate(ctx, args);
      },
    }),
    onDelete: mutation({
      args: { model: v.string(), doc: v.any() },
      handler: async (ctx, args) => {
        await authComponent.triggers.onDelete(ctx, args);
      },
    }),
  },
});

export const createAuth = (ctx: GenericCtx<typeof components.betterAuth>) => {
  return betterAuth({
    logger: { disabled: true },
    trustedOrigins: [siteUrl],
    database: authComponent.adapter(ctx),
    // Password auth handled via Better Auth defaults; no magic link, no social
    socialProviders: {},
    plugins: [crossDomain({ siteUrl }), convex()],
  });
};
