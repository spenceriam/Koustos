import { defineTable } from "convex/server";
import { v } from "convex/values";

export const authTables = {
  user: defineTable({
    name: v.string(),
    email: v.string(),
    emailVerified: v.boolean(),
    image: v.optional(v.union(v.null(), v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
    twoFactorEnabled: v.optional(v.union(v.null(), v.boolean())),
    isAnonymous: v.optional(v.union(v.null(), v.boolean())),
    username: v.optional(v.union(v.null(), v.string())),
    displayUsername: v.optional(v.union(v.null(), v.string())),
    phoneNumber: v.optional(v.union(v.null(), v.string())),
    phoneNumberVerified: v.optional(v.union(v.null(), v.boolean())),
    userId: v.optional(v.union(v.null(), v.string())),
  })
    .index("email_name", ["email", "name"])
    .index("name", ["name"])
    .index("userId", ["userId"])
    .index("username", ["username"])
    .index("phoneNumber", ["phoneNumber"]),
  session: defineTable({
    expiresAt: v.number(),
    token: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    ipAddress: v.optional(v.union(v.null(), v.string())),
    userAgent: v.optional(v.union(v.null(), v.string())),
    userId: v.string(),
  })
    .index("expiresAt", ["expiresAt"])
    .index("expiresAt_userId", ["expiresAt", "userId"])
    .index("token", ["token"])
    .index("userId", ["userId"]),
  account: defineTable({
    accountId: v.string(),
    providerId: v.string(),
    userId: v.string(),
    accessToken: v.optional(v.union(v.null(), v.string())),
    refreshToken: v.optional(v.union(v.null(), v.string())),
    idToken: v.optional(v.union(v.null(), v.string())),
    accessTokenExpiresAt: v.optional(v.union(v.null(), v.number())),
    refreshTokenExpiresAt: v.optional(v.union(v.null(), v.number())),
    scope: v.optional(v.union(v.null(), v.string())),
    password: v.optional(v.union(v.null(), v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("accountId", ["accountId"])
    .index("accountId_providerId", ["accountId", "providerId"])
    .index("providerId_userId", ["providerId", "userId"])
    .index("userId", ["userId"]),
  verification: defineTable({
    identifier: v.string(),
    value: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("expiresAt", ["expiresAt"])
    .index("identifier", ["identifier"]),
  twoFactor: defineTable({
    secret: v.string(),
    backupCodes: v.string(),
    userId: v.string(),
  }).index("userId", ["userId"]),
  passkey: defineTable({
    name: v.optional(v.union(v.null(), v.string())),
    publicKey: v.string(),
    userId: v.string(),
    credentialID: v.string(),
    counter: v.number(),
    deviceType: v.string(),
    backedUp: v.boolean(),
    transports: v.optional(v.union(v.null(), v.string())),
    createdAt: v.optional(v.union(v.null(), v.number())),
    aaguid: v.optional(v.union(v.null(), v.string())),
  })
    .index("credentialID", ["credentialID"])
    .index("userId", ["userId"]),
  oauthApplication: defineTable({
    name: v.optional(v.union(v.null(), v.string())),
    icon: v.optional(v.union(v.null(), v.string())),
    metadata: v.optional(v.union(v.null(), v.string())),
    clientId: v.optional(v.union(v.null(), v.string())),
    clientSecret: v.optional(v.union(v.null(), v.string())),
    redirectURLs: v.optional(v.union(v.null(), v.string())),
    type: v.optional(v.union(v.null(), v.string())),
    disabled: v.optional(v.union(v.null(), v.boolean())),
    userId: v.optional(v.union(v.null(), v.string())),
    createdAt: v.optional(v.union(v.null(), v.number())),
    updatedAt: v.optional(v.union(v.null(), v.number())),
  })
    .index("clientId", ["clientId"])
    .index("userId", ["userId"]),

  oauthAccessToken: defineTable({
    accessToken: v.optional(v.union(v.null(), v.string())),
    refreshToken: v.optional(v.union(v.null(), v.string())),
    accessTokenExpiresAt: v.optional(v.union(v.null(), v.number())),
    refreshTokenExpiresAt: v.optional(v.union(v.null(), v.number())),
    clientId: v.optional(v.union(v.null(), v.string())),
    userId: v.optional(v.union(v.null(), v.string())),
    scopes: v.optional(v.union(v.null(), v.string())),
    createdAt: v.optional(v.union(v.null(), v.number())),
    updatedAt: v.optional(v.union(v.null(), v.number())),
  })
    .index("accessToken", ["accessToken"])
    .index("refreshToken", ["refreshToken"])
    .index("clientId", ["clientId"])
    .index("userId", ["userId"]),

  oauthConsent: defineTable({
    clientId: v.optional(v.union(v.null(), v.string())),
    userId: v.optional(v.union(v.null(), v.string())),
    scopes: v.optional(v.union(v.null(), v.string())),
    createdAt: v.optional(v.union(v.null(), v.number())),
    updatedAt: v.optional(v.union(v.null(), v.number())),
    consentGiven: v.optional(v.union(v.null(), v.boolean())),
  })
    .index("clientId_userId", ["clientId", "userId"])
    .index("userId", ["userId"]),

  team: defineTable({
    name: v.string(),
    organizationId: v.string(),
    createdAt: v.number(),
    updatedAt: v.optional(v.union(v.null(), v.number())),
  }).index("organizationId", ["organizationId"]),

  teamMember: defineTable({
    teamId: v.string(),
    userId: v.string(),
    createdAt: v.optional(v.union(v.null(), v.number())),
  })
    .index("teamId", ["teamId"])
    .index("userId", ["userId"]),

  organization: defineTable({
    name: v.string(),
    slug: v.optional(v.union(v.null(), v.string())),
    logo: v.optional(v.union(v.null(), v.string())),
    createdAt: v.number(),
    metadata: v.optional(v.union(v.null(), v.string())),
  })
    .index("name", ["name"])
    .index("slug", ["slug"]),

  member: defineTable({
    organizationId: v.string(),
    userId: v.string(),
    role: v.string(),
    createdAt: v.number(),
  })
    .index("organizationId_userId", ["organizationId", "userId"])
    .index("userId", ["userId"])
    .index("role", ["role"]),

  invitation: defineTable({
    organizationId: v.string(),
    email: v.string(),
    role: v.optional(v.union(v.null(), v.string())),
    teamId: v.optional(v.union(v.null(), v.string())),
    status: v.string(),
    expiresAt: v.number(),
    inviterId: v.string(),
  })
    .index("email_organizationId_status", ["email", "organizationId", "status"])
    .index("organizationId_status", ["organizationId", "status"])
    .index("role", ["role"])
    .index("teamId", ["teamId"])
    .index("status", ["status"])
    .index("inviterId", ["inviterId"]),

  ssoProvider: defineTable({
    issuer: v.string(),
    oidcConfig: v.optional(v.union(v.null(), v.string())),
    samlConfig: v.optional(v.union(v.null(), v.string())),
    userId: v.optional(v.union(v.null(), v.string())),
    providerId: v.string(),
    organizationId: v.optional(v.union(v.null(), v.string())),
    domain: v.string(),
  })
    .index("organizationId", ["organizationId"])
    .index("domain", ["domain"])
    .index("userId", ["userId"])
    .index("providerId", ["providerId"]),

  jwks: defineTable({
    publicKey: v.string(),
    privateKey: v.string(),
    createdAt: v.number(),
  }),

  subscription: defineTable({
    plan: v.string(),
    referenceId: v.string(),
    stripeCustomerId: v.optional(v.union(v.null(), v.string())),
    stripeSubscriptionId: v.optional(v.union(v.null(), v.string())),
    status: v.optional(v.union(v.null(), v.string())),
    periodStart: v.optional(v.union(v.null(), v.number())),
    periodEnd: v.optional(v.union(v.null(), v.number())),
    trialStart: v.optional(v.union(v.null(), v.number())),
    trialEnd: v.optional(v.union(v.null(), v.number())),
    cancelAtPeriodEnd: v.optional(v.union(v.null(), v.boolean())),
    seats: v.optional(v.union(v.null(), v.number())),
  })
    .index("stripeSubscriptionId", ["stripeSubscriptionId"])
    .index("stripeCustomerId", ["stripeCustomerId"])
    .index("referenceId", ["referenceId"]),

  walletAddress: defineTable({
    userId: v.string(),
    address: v.string(),
    chainId: v.number(),
    isPrimary: v.optional(v.union(v.null(), v.boolean())),
    createdAt: v.number(),
  }).index("userId", ["userId"]),

  rateLimit: defineTable({
    key: v.optional(v.union(v.null(), v.string())),
    count: v.optional(v.union(v.null(), v.number())),
    lastRequest: v.optional(v.union(v.null(), v.number())),
  }).index("key", ["key"]),
  ratelimit: defineTable({
    key: v.string(),
    count: v.number(),
    lastRequest: v.number(),
  }).index("key", ["key"]),
};
