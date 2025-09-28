import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
import { components } from "./betterAuthComponent/_generated/api";
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { sendMagicLink } from "./magicLink";

const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

if (!googleClientId || !googleClientSecret) {
  throw new Error("Google OAuth credentials are missing in Convex env");
}
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
    magicLink: magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendMagicLink({ email, url });
      },
    }),
    socialProviders: {
      google: {
        clientId: googleClientId,
        clientSecret: googleClientSecret,
        scope: ["email", "profile"],
      },
      github: {
        clientId: githubClientId,
        clientSecret: githubClientSecret,
      },
    },
    plugins: [crossDomain({ siteUrl }), convex()],
  });
};
