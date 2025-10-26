"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { authClient } from "@/lib/auth-client"

import "./sign-out-button.css"

/**
 * Client component for sign out functionality
 * This is the only interactive part, so it's the only client component
 */
export function SignOutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await authClient.signOut()
      router.refresh()
      setLoading(false)
    } catch (error) {
      console.error("Failed to sign out:", error)
      setLoading(false)
    }
  }

  return (
    <button onClick={handleSignOut} disabled={loading} className="sign-out-button">
      <span className="button-content">
        {loading ? (
          <>
            <div className="spinner" />
            <span>Signing out...</span>
          </>
        ) : (
          <>
            <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Sign Out</span>
          </>
        )}
      </span>
    </button>
  )
}
