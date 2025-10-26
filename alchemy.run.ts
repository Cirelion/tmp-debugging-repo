import alchemy from "alchemy"
import { Hyperdrive, Nextjs } from "alchemy/cloudflare"
import { NeonProject } from "alchemy/neon"
import { Exec } from "alchemy/os"
import { RandomString } from "alchemy/random"

const app = await alchemy("unstability")

await Exec("prisma-generate", {
  command: "prisma generate",
  memoize: { patterns: ["prisma/schema.prisma"] },
})

// Secure secrets for better-auth
const jwtSecret = await RandomString("jwt-secret", { length: 64 })
const sessionSecret = await RandomString("session-secret", { length: 32 })

// Neon API key (from .env)
const neonApiKey = alchemy.secret(process.env.NEON_API_KEY!)

// Create Auth Database (Neon Project)
const authDb = await NeonProject("auth-database", {
  name: `${app.name}-${app.stage}-auth`,
  region_id: "aws-us-east-1",
  pg_version: 18,
  apiKey: neonApiKey,
})

// Create Primary Database (Neon Project)
const primaryDb = await NeonProject("primary-database", {
  name: `${app.name}-${app.stage}-primary`,
  region_id: "aws-us-east-1",
  pg_version: 18,
  apiKey: neonApiKey,
})

// Hyperdrive for Auth Database (connection pooling)
const authHyperdrive = await Hyperdrive("auth-hyperdrive", {
  name: `${app.name}-${app.stage}-auth-hyperdrive`,
  origin: authDb.connection_uris[0].connection_uri,
  adopt: true,
})

// Hyperdrive for Primary Database
const primaryHyperdrive = await Hyperdrive("primary-hyperdrive", {
  name: `${app.name}-${app.stage}-primary-hyperdrive`,
  origin: primaryDb.connection_uris[0].connection_uri,
  adopt: true,
})

// Next.js Worker with all bindings
export const worker = await Nextjs("website", {
  name: `${app.name}-${app.stage}-website`,
  adopt: true,
  compatibilityFlags: ["nodejs_compat"],
  bindings: {
    // Hyperdrive bindings
    AUTH_HYPERDRIVE: authHyperdrive,
    PRIMARY_HYPERDRIVE: primaryHyperdrive,

    // Better-auth secrets
    JWT_SECRET: jwtSecret.value,
    SESSION_SECRET: sessionSecret.value,
  },
})

// Export database URLs for local development
console.log({
  url: worker.url,
  authDb: authDb.name,
  primaryDb: primaryDb.name,
})

await app.finalize()
