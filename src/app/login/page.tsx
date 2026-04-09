"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-browser"
import Link from "next/link"

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin() {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else router.push("/listings/new")
    setLoading(false)
  }

  return (
    <div style={{ background: "white", minHeight: "100vh" }} className="flex flex-col">

      {/* Nav */}
      <nav style={{ background: "white", borderBottom: "1px solid #EBEBEB" }} className="flex items-center justify-between px-6 sm:px-10 py-4">
        <Link href="/" style={{ fontSize: "22px", fontWeight: 800, color: "#FF385C", letterSpacing: "-0.5px", textDecoration: "none" }}>aqari</Link>
        <Link href="/listings" style={{ fontSize: "14px", color: "#222", border: "1px solid #DDDDDD", padding: "8px 20px", borderRadius: "24px", fontWeight: 500 }}>Browse listings</Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div style={{ width: "100%", maxWidth: "400px" }}>

          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#222", letterSpacing: "-0.5px" }} className="mb-1">Welcome back</h1>
          <p style={{ fontSize: "15px", color: "#717171" }} className="mb-8">Sign in to your Aqari account</p>

          {error && (
            <div style={{ background: "#FFF0F2", border: "1px solid #FFD6DF", borderRadius: "8px", color: "#C4001B", fontSize: "13px" }} className="mb-4 p-3">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div>
              <label style={{ fontSize: "12px", color: "#717171", letterSpacing: "0.5px", fontWeight: 600 }} className="block mb-2">EMAIL ADDRESS</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{ background: "white", border: "1px solid #DDDDDD", color: "#222", borderRadius: "8px", fontSize: "14px", width: "100%", padding: "12px 16px" }}
                className="focus:outline-none"
                onKeyDown={e => e.key === "Enter" && handleLogin()}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "#717171", letterSpacing: "0.5px", fontWeight: 600 }} className="block mb-2">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ background: "white", border: "1px solid #DDDDDD", color: "#222", borderRadius: "8px", fontSize: "14px", width: "100%", padding: "12px 16px" }}
                className="focus:outline-none"
                onKeyDown={e => e.key === "Enter" && handleLogin()}
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={loading || email.length < 5 || password.length < 6}
              style={{ background: "#FF385C", color: "white", borderRadius: "8px", fontSize: "15px", border: "none", fontWeight: 700, cursor: "pointer", padding: "14px", opacity: (loading || email.length < 5 || password.length < 6) ? 0.5 : 1 }}
              className="w-full"
            >
              {loading ? "Signing in..." : "Sign in →"}
            </button>
          </div>

          <p style={{ fontSize: "13px", color: "#717171" }} className="mt-6 text-center">
            Don't have an account?{" "}
            <Link href="/signup" style={{ color: "#FF385C", fontWeight: 600 }}>Sign up free</Link>
          </p>

          <p style={{ fontSize: "13px", color: "#717171" }} className="mt-3 text-center">
            Want to browse first?{" "}
            <Link href="/listings" style={{ color: "#222", fontWeight: 600 }}>View listings</Link>
          </p>

        </div>
      </div>
    </div>
  )
}