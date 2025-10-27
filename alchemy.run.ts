import alchemy from "alchemy"
import { Hyperdrive, Nextjs } from "alchemy/cloudflare"
import { Exec } from "alchemy/os"
import { Database, Role } from "alchemy/planetscale"
import { RandomString } from "alchemy/random"

const app = await alchemy("unstability")

// Secure secrets for better-auth
const jwtSecret = await RandomString("jwt-secret", { length: 64 })
const sessionSecret = await RandomString("session-secret", { length: 32 })

// Create the PostgreSQL database
const database = await Database("Database", {
  name: "sample-database",
  clusterSize: "PS_10",
  kind: "postgresql",
})

// Create a database role with postgres privileges
const role = await Role("Role", {
  database,
  branch: database.defaultBranch,
  inheritedRoles: ["postgres"],
})

// Create Hyperdrive configuration for connection pooling
const hyperdrive = await Hyperdrive("hyperdrive", {
  origin: role.connectionUrl,
  caching: { disabled: true },
})

// Generate Drizzle migrations
await Exec("DrizzleGenerate", {
  command: "bun run db:generate",
  env: {
    DATABASE_URL: role.connectionUrl,
  },
  memoize: {
    patterns: ["drizzle.config.ts", "src/db/schema.ts"],
  },
})

// Apply migrations to the database
await Exec("DrizzleMigrate", {
  command:
    process.platform === "win32"
      ? `cmd /C "bun run db:migrate || if %ERRORLEVEL%==9 exit 0 else exit %ERRORLEVEL%"`
      : `sh -c 'bun run db:migrate || ( [ $? -eq 9 ] && exit 0 ); exit $?'`,
  env: {
    DATABASE_URL: role.connectionUrl,
  },
  memoize: {
    patterns: ["drizzle.config.ts", "drizzle/*.sql"],
  },
})
import { Secret } from "alchemy/cloudflare"

const RunwareAPIKey = await Secret("runware-api-key", {
  value: alchemy.secret(process.env.RUNWARE_API_KEY),
})

// Next.js Worker with all bindings
export const worker = await Nextjs("website", {
  name: `${app.name}-${app.stage}-website`,
  adopt: true,
  bindings: {
    // Better Auth secrets
    JWT_SECRET: jwtSecret.value,
    SESSION_SECRET: sessionSecret.value,

    // Database connection
    HYPERDRIVE: hyperdrive,

    // Better Auth configuration
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL!,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL!,

    // OAuth providers
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID!,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET!,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,

    RUNWARE_API_KEY: RunwareAPIKey,
  },
})

// Export URLs for local development
console.log({
  url: worker.url,
})

await app.finalize()
