import { cache } from "react"

import { neonConfig } from "@neondatabase/serverless"
import { PrismaNeon } from "@prisma/adapter-neon"
import { PrismaClient } from "@prisma/client"

/**
 * Edge-compatible Prisma client using Neon adapter
 * Works with Cloudflare Workers and Hyperdrive connection pooling
 *
 * IMPORTANT: On Cloudflare Workers, we create a new client per request
 * instead of using a global singleton. This is required because Workers
 * don't support persistent database connections across requests.
 */

// Enable WebSocket proxy for local development
if (process.env.NODE_ENV === "development") {
  neonConfig.webSocketConstructor = WebSocket
}

/**
 * Get database connection string from environment
 * In production: Uses AUTH_HYPERDRIVE binding from Cloudflare Workers
 * In development: Uses AUTH_DATABASE_URL from .env
 */
function getDatabaseUrl(): string {
  // In Cloudflare Workers with Hyperdrive, the binding provides a connectionString property
  // This will be available when running on the edge
  if (typeof process !== "undefined" && process.env.AUTH_HYPERDRIVE) {
    // Hyperdrive bindings expose a connectionString property
    const hyperdrive = process.env.AUTH_HYPERDRIVE as unknown as { connectionString: string }
    if (typeof hyperdrive === "object" && "connectionString" in hyperdrive) {
      return hyperdrive.connectionString
    }
    // Fallback if it's already a string
    return process.env.AUTH_HYPERDRIVE as string
  }

  // Fallback to direct database URL for local development
  if (!process.env.AUTH_DATABASE_URL) {
    throw new Error(
      "AUTH_DATABASE_URL is not set. Please add it to your .env file. " +
        'Run "bun run dev" to see the connection URLs from Alchemy.'
    )
  }

  return process.env.AUTH_DATABASE_URL
}

/**
 * Create Prisma client with Neon adapter for edge compatibility
 * This function is wrapped with React cache() to ensure we reuse
 * the same client within a single request, but create a new one
 * for each request (required for Cloudflare Workers)
 */
export const getPrismaClient = cache(() => {
  const connectionString = getDatabaseUrl()

  // Create Prisma adapter with connection string
  // The Neon adapter handles connection pooling internally
  const adapter = new PrismaNeon({ connectionString })

  // Initialize Prisma client with adapter
  return new PrismaClient({ adapter })
})
