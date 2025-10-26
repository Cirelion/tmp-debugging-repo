import { toNextJsHandler } from "better-auth/next-js"

import { auth } from "@/lib/auth"

/**
 * Better Auth API route handler
 * Handles all authentication endpoints: /api/auth/*
 *
 * Endpoints include:
 * - POST /api/auth/sign-in/email - Email/password sign in
 * - POST /api/auth/sign-up/email - Email/password sign up
 * - POST /api/auth/sign-out - Sign out
 * - GET /api/auth/session - Get current session
 * - POST /api/auth/forget-password - Request password reset
 * - POST /api/auth/reset-password - Reset password
 * - GET /api/auth/callback/github - GitHub OAuth callback
 * - GET /api/auth/callback/google - Google OAuth callback
 */
export const { GET, POST } = toNextJsHandler(auth.handler)
