import { headers } from "next/headers"
import Link from "next/link"

import { auth } from "@/lib/auth"

import { SignOutButton } from "./sign-out-button"

import "./header.css"

/**
 * Header component with conditional rendering based on auth status
 * Shows user name, Generate link, and Sign Out if logged in
 * Shows Login link if logged out
 */
export async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <Link href="/" className="logo">
            Unstability
          </Link>

          <nav className="nav">
            {session ? (
              <>
                <div className="user-info">
                  <span className="user-name">Hi {session.user.name}</span>
                </div>
                <Link href="/generate" className="generate-link">
                  Generate
                </Link>
                <SignOutButton />
              </>
            ) : (
              <Link href="/login" className="sign-in-link">
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
