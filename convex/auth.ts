import { betterAuth } from "better-auth";
import { password } from "better-auth/plugins";
import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
import { components } from "./betterAuthComponent/_generated/api";
import { mutation } from "./_generated/server";
import { v } from "convex/values";
// Magic link disabled in MVP

const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
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
    password: password({
      requireEmailVerification: false,
      minPasswordLength: 8,
    }),
    socialProviders:
      googleClientId && googleClientSecret
        ? {
            google: {
              clientId: googleClientId,
              clientSecret: googleClientSecret,
              scope: ["email", "profile"],
            },
          }
        : {},
    plugins: [crossDomain({ siteUrl }), convex()],
  });
};
