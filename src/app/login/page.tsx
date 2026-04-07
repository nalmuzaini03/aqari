"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase-browser"

export default function LoginPage() {
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function sendMagicLink() {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "https://getaqari.com/auth/callback",
        shouldCreateUser: true,
      },
    })
    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  return (
    <div style={{ background: "#E8F8F3" }} className="min-h-screen flex items-center justify-center px-4">
      <div style={{ background: "#C8F5E8", border: "1px solid #9FE1CB" }} className="w-full max-w-sm rounded-2xl p-8">
        {!sent ? (
          <>
            <h1 style={{ color: "#0A5C46" }} className="text-2xl font-semibold mb-1">Sign in to Aqari</h1>
            <p style={{ color: "#1D9E75" }} className="text-sm mb-8">Enter your email to continue</p>

            {error && (
              <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: "#B2F0DC", color: "#0A5C46" }}>{error}</div>
            )}

            <div className="flex flex-col gap-4">
              <div>
                <label style={{ color: "#0F7A5F" }} className="block text-sm font-medium mb-1">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{ background: "#B2F0DC", border: "1px solid #7FEDD0", color: "#0A5C46" }}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
                />
              </div>
              <button
                onClick={sendMagicLink}
                disabled={loading || email.length < 5}
                style={{ background: "#0F7A5F", color: "#7FEDD0" }}
                className="w-full rounded-lg py-2.5 text-sm font-medium disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send login link"}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div style={{ background: "#1D9E75" }} className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 style={{ color: "#0A5C46" }} className="text-lg font-semibold mb-1">Check your email</h2>
            <p style={{ color: "#1D9E75" }} className="text-sm">We sent a login link to<br /><span style={{ color: "#0A5C46" }} className="font-medium">{email}</span></p>
            <button onClick={() => setSent(false)} style={{ color: "#1D9E75" }} className="mt-6 text-sm">
              Use a different email
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

