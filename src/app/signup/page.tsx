"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-browser"
import Link from "next/link"

export default function SignupPage() {
  const supabase = createClient()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSignup() {
    setLoading(true)
    setError(null)

    if (password !== confirm) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setError(error.message)
    else router.push("/listings")
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
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "32px", color: "#1C3829", fontWeight: "400" }} className="mb-2">
            Create an account
          </h1>
          <p style={{ fontSize: "14px", color: "#8C7B65" }} className="mb-8">
            List your property on Aqari for free
          </p>

          {error && (
            <div style={{ background: "#F2EDE4", border: "1px solid #E8E0D0", borderRadius: "6px", color: "#6B5F50", fontSize: "13px" }} className="mb-4 p-3">{error}</div>
          )}

          <div className="flex flex-col gap-4">
            <div>
              <label style={{ fontSize: "12px", color: "#8C7B65", letterSpacing: "0.5px" }} className="block mb-2 uppercase">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{ background: "#FAF8F4", border: "1px solid #E8E0D0", color: "#1C3829", borderRadius: "4px", fontSize: "14px" }}
                className="w-full px-4 py-3 focus:outline-none"
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "#8C7B65", letterSpacing: "0.5px" }} className="block mb-2 uppercase">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                style={{ background: "#FAF8F4", border: "1px solid #E8E0D0", color: "#1C3829", borderRadius: "4px", fontSize: "14px" }}
                className="w-full px-4 py-3 focus:outline-none"
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "#8C7B65", letterSpacing: "0.5px" }} className="block mb-2 uppercase">Confirm password</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="••••••••"
                style={{ background: "#FAF8F4", border: "1px solid #E8E0D0", color: "#1C3829", borderRadius: "4px", fontSize: "14px" }}
                className="w-full px-4 py-3 focus:outline-none"
                onKeyDown={e => e.key === "Enter" && handleSignup()}
              />
            </div>
            <button
              onClick={handleSignup}
              disabled={loading || email.length < 5 || password.length < 6}
              style={{ background: "#1C3829", color: "#FAF8F4", borderRadius: "4px", fontSize: "14px", border: "none", letterSpacing: "0.3px" }}
              className="w-full py-3 font-medium disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account →"}
            </button>
          </div>

          <p style={{ fontSize: "13px", color: "#8C7B65" }} className="mt-6 text-center">
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#2D6A4F" }}>Sign in</Link>
          </p>

          <p style={{ fontSize: "12px", color: "#B4A99A", textAlign: "center", marginTop: "16px", lineHeight: "1.5" }}>
            By signing up you agree to Aqari's terms. Your account will be used to manage your listings.
          </p>
        </div>
      </div>
    </div>
  )
}
