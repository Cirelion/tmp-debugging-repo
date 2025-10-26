import { NextRequest, NextResponse } from "next/server"

import { getSessionCookie } from "better-auth/cookies"

/**
 * Next.js Middleware for optimistic authentication redirects
 *
 *
 * This is the recommended Better Auth + Next.js pattern for performance.
 */
export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)
  const { pathname } = request.nextUrl

  // Redirect authenticated users away from login page
  if (sessionCookie && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Redirect unauthenticated users to login (optimistic check)
  // The actual session validation happens server-side in the page
  if (!sessionCookie && pathname !== "/" && pathname !== "/login") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (handled by Better Auth)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public files (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|auth-demo).*)",
  ],
}
