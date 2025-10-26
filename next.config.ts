import type { NextConfig } from "next"

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare"

const nextConfig: NextConfig = {
  // Prisma packages must be external for Cloudflare Workers
  // This ensures OpenNext properly patches them for workerd runtime
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
}

export default nextConfig

initOpenNextCloudflareForDev()
