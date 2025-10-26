import { headers } from "next/headers"

import { auth } from "@/lib/auth"

import "./page.css"

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <main className="home-main">
      <div className="home-content">
        <div className="hero-section">
          <h1 className="hero-title">Welcome to Unstability 2.something</h1>
          <p className="hero-description">Basic test of our new infra</p>
        </div>

        {session ? (
          <div className="session-card">
            <div className="session-header">
              <h2 className="session-header-title">
                <svg
                  className="session-header-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Your Session
              </h2>
            </div>
            <div className="session-body">
              <div className="session-grid">
                <div className="session-field">
                  <p className="session-label">Name</p>
                  <p className="session-value">{session.user.name}</p>
                </div>
                <div className="session-field">
                  <p className="session-label">Email</p>
                  <p className="session-value">{session.user.email}</p>
                </div>
                <div className="session-field">
                  <p className="session-label">User ID</p>
                  <p className="session-value-mono">{session.user.id}</p>
                </div>
                {session.user.image && (
                  <div className="session-field">
                    <p className="session-label">Avatar</p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={session.user.image} alt="User avatar" className="session-avatar" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="not-logged-in-card">
            <div className="not-logged-in-content">
              <div className="not-logged-in-icon-wrapper">
                <svg
                  className="not-logged-in-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="not-logged-in-title">Not Logged In</h2>
              <p className="not-logged-in-description">
                Sign in to access your personalized session data and features
              </p>
              <a href="/login" className="sign-in-link">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Sign In Now
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
