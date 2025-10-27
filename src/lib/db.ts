import { getCloudflareContext } from "@opennextjs/cloudflare"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import * as schema from "@/db/schema"

/**
 * Database client for Cloudflare Workers with Hyperdrive support
 *
 * In production (Cloudflare Workers):
 * - Uses HYPERDRIVE binding via getCloudflareContext()
 * - Binding is configured in alchemy.run.ts
 *
 * In development:
 * - Falls back to DATABASE_URL from .env
 * - Connects directly to PlanetScale PostgreSQL
 */
async function getConnectionString(): Promise<string> {
  const { env } = await getCloudflareContext({ async: true })

  return env.HYPERDRIVE.connectionString
}

export async function getDb() {
  const connectionString = await getConnectionString()

  // Hyperdrive handles SSL internally, so only enable SSL for direct connections
  const isHyperdrive = connectionString.includes(".hyperdrive.local")

  const client = postgres(connectionString, {
    prepare: false, // Required for PlanetScale
    ssl: isHyperdrive ? undefined : "require", // SSL only for direct PlanetScale connections
    fetch_types: false, // Required for Hyperdrive to avoid timeouts
    max: 1, // Hyperdrive handles connection pooling, so limit to 1 connection
    idle_timeout: 20, // Close idle connections after 20 seconds
    connect_timeout: 10, // Timeout connection attempts after 10 seconds
  })

  return drizzle(client, { schema })
}
