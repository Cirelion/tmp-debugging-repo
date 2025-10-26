import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"

import { getPrismaClient } from "./prisma"

/**
 * Better Auth configuration with Prisma adapter
 * Uses Neon adapter for edge-compatible PostgreSQL access
 */
export const auth = betterAuth({
  database: prismaAdapter(getPrismaClient(), {
    provider: "postgresql",
  }),

  // Use secrets from Alchemy bindings
  secret: process.env.JWT_SECRET,
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  // Base URL for redirects and email links
  baseURL: process.env.BETTER_AUTH_URL,

  // OAuth social providers
  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },

  // Account linking - allow users to link multiple OAuth providers
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["discord", "google"],
    },
  },
})
