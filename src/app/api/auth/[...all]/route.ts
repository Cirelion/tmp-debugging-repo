import { toNextJsHandler } from "better-auth/next-js"

import { getAuth } from "@/lib/auth"

/**
 * Better Auth API route handler
 * Handles all authentication endpoints: /api/auth/*
 *
 * The auth instance is created per-request to access Cloudflare Worker bindings
 * (JWT_SECRET, OAuth credentials, etc.) which are only available at request time.
 *
 * Endpoints include:
 * - POST /api/auth/sign-in/social - Social OAuth login
 * - POST /api/auth/sign-out - Sign out
 * - GET /api/auth/session - Get current session
 * - GET /api/auth/callback/discord - Discord OAuth callback
 * - GET /api/auth/callback/google - Google OAuth callback
 */
export async function GET(request: Request) {
  const auth = await getAuth()
  return toNextJsHandler(auth.handler).GET(request)
}

export async function POST(request: Request) {
  const auth = await getAuth()
  return toNextJsHandler(auth.handler).POST(request)
}
