"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import Link from "next/link"

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
      options: { emailRedirectTo: "https://getaqari.com/auth/callback", shouldCreateUser: true },
    })
    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  return (
    <div style={{ background: "#FAF8F4", minHeight: "100vh" }} className="flex flex-col">
      <nav style={{ background: "#FAF8F4", borderBottom: "1px solid #E8E0D0" }} className="flex items-center justify-between px-6 sm:px-12 py-5">
        <Link href="/" style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: "#1C3829", letterSpacing: "3px" }}>
          AQ<span style={{ color: "#2D6A4F" }}>A</span>RI
        </Link>
        <Link href="/listings" style={{ fontSize: "13px", color: "#6B5F50" }}>Browse listings</Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div style={{ width: "100%", maxWidth: "420px" }}>
          {!sent ? (
            <>
              <h1 style={{ fontFamily: "Georgia, serif", fontSize: "32px", color: "#1C3829", fontWeight: "400" }} className="mb-2">
                Sign in to Aqari
              </h1>
              <p style={{ fontSize: "14px", color: "#8C7B65" }} className="mb-8">
                Enter your email and we'll send you a login link
              </p>

              {error && (
                <div style={{ background: "#F2EDE4", border: "1px solid #E8E0D0", borderRadius: "6px", color: "#6B5F50", fontSize: "13px" }} className="mb-4 p-3">{error}</div>
              )}

              <div className="flex flex-col gap-3">
                <div>
                  <label style={{ fontSize: "12px", color: "#8C7B65", letterSpacing: "0.5px" }} className="block mb-2 uppercase">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={{ background: "#FAF8F4", border: "1px solid #E8E0D0", color: "#1C3829", borderRadius: "4px", fontSize: "14px" }}
                    className="w-full px-4 py-3 focus:outline-none"
                    onKeyDown={e => e.key === "Enter" && sendMagicLink()}
                  />
                </div>
                <button
                  onClick={sendMagicLink}
                  disabled={loading || email.length < 5}
                  style={{ background: "#1C3829", color: "#FAF8F4", borderRadius: "4px", fontSize: "14px", border: "none", letterSpacing: "0.3px" }}
                  className="w-full py-3 font-medium disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send login link →"}
                </button>
              </div>

              <p style={{ fontSize: "13px", color: "#8C7B65" }} className="mt-6 text-center">
                Don't have an account?{" "}
                <button onClick={sendMagicLink} style={{ color: "#2D6A4F", background: "none", border: "none", cursor: "pointer" }}>
                  Sign up free
                </button>
              </p>
            </>
          ) : (
            <div className="text-center">
              <div style={{ width: "56px", height: "56px", background: "#F2EDE4", border: "1px solid #E8E0D0", borderRadius: "50%" }} className="flex items-center justify-center mx-auto mb-6">
                <svg className="w-6 h-6" style={{ color: "#2D6A4F" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: "24px", color: "#1C3829", fontWeight: "400" }} className="mb-2">Check your email</h2>
              <p style={{ fontSize: "14px", color: "#8C7B65" }}>
                We sent a login link to<br />
                <span style={{ color: "#1C3829", fontWeight: "500" }}>{email}</span>
              </p>
              <button onClick={() => setSent(false)} style={{ color: "#8C7B65", fontSize: "13px", background: "none", border: "none", cursor: "pointer" }} className="mt-6">
                Use a different email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
