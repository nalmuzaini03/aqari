"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-browser"
import { Listing } from "@/types/listing"
import Link from "next/link"

export default function MyListingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.push("/login"); return }
      const { data: listings } = await supabase
        .from("property_listings")
        .select("*")
        .eq("user_id", data.session.user.id)
        .order("created_at", { ascending: false })
      setListings(listings ?? [])
      setLoading(false)
    })
  }, [])

  async function deleteListing(id: string) {
    setDeletingId(id)
    await supabase.from("property_listings").delete().eq("id", id)
    setListings(listings.filter(l => l.id !== id))
    setDeletingId(null)
  }

  return (
    <div style={{ background: "#FAF8F4", minHeight: "100vh" }}>
      <nav style={{ background: "#FAF8F4", borderBottom: "1px solid #E8E0D0" }} className="flex items-center justify-between px-6 sm:px-12 py-5">
        <Link href="/" style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: "#1C3829", letterSpacing: "3px" }}>
          AQ<span style={{ color: "#2D6A4F" }}>A</span>RI
        </Link>
        <Link href="/listings/new" style={{ background: "#1C3829", color: "#FAF8F4", fontSize: "13px", borderRadius: "4px" }} className="px-4 py-2 font-medium">
          + New listing
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "32px", color: "#1C3829", fontWeight: "400" }} className="mb-1">My listings</h1>
        <p style={{ fontSize: "14px", color: "#8C7B65" }} className="mb-8">Manage your property listings</p>

        {loading ? (
          <p style={{ fontSize: "14px", color: "#8C7B65" }}>Loading...</p>
        ) : listings.length === 0 ? (
          <div style={{ background: "#F2EDE4", border: "1px solid #E8E0D0", borderRadius: "8px" }} className="p-10 text-center">
            <p style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: "#1C3829" }} className="mb-2">No listings yet</p>
            <p style={{ fontSize: "14px", color: "#8C7B65" }} className="mb-6">Post your first property listing</p>
            <Link href="/listings/new" style={{ background: "#1C3829", color: "#FAF8F4", fontSize: "13px", borderRadius: "4px" }} className="px-6 py-2.5 font-medium">
              Post a listing
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {listings.map(l => (
              <div key={l.id} style={{ background: "#FAF8F4", border: "1px solid #E8E0D0", borderRadius: "8px" }} className="p-4 flex items-center gap-4">
                <div style={{ background: "#F2EDE4", border: "1px solid #E8E0D0", borderRadius: "6px" }} className="w-16 h-16 flex-shrink-0 overflow-hidden">
                  {l.photos && l.photos.length > 0 ? (
                    <img src={l.photos[0]} alt={l.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-6 h-6" style={{ color: "#D4C9B5" }} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: "14px", fontWeight: "500", color: "#1C3829" }} className="truncate">{l.title}</p>
                  <p style={{ fontSize: "12px", color: "#8C7B65" }} className="mt-0.5">{l.price.toLocaleString()} KWD · {l.area}</p>
                  <span style={{ background: "#1C3829", color: "#A8D5B5", fontSize: "10px", letterSpacing: "0.5px" }} className="inline-block mt-1 px-2 py-0.5 rounded uppercase">
                    {l.listing_type === "rent" ? "For rent" : "For sale"}
                  </span>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <Link href={`/listings/${l.id}`} style={{ color: "#2D6A4F", border: "1px solid #E8E0D0", fontSize: "12px", borderRadius: "4px" }} className="px-3 py-1.5">
                    View
                  </Link>
                  <button
                    onClick={() => deleteListing(l.id)}
                    disabled={deletingId === l.id}
                    style={{ background: "#F2EDE4", color: "#6B5F50", border: "1px solid #E8E0D0", fontSize: "12px", borderRadius: "4px" }}
                    className="px-3 py-1.5 disabled:opacity-50"
                  >
                    {deletingId === l.id ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6">
          <Link href="/listings" style={{ color: "#8C7B65", fontSize: "13px" }} className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to listings
          </Link>
        </div>
      </div>
    </div>
  )
}
