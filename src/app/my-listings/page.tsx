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
    <div style={{ background: "#E8F8F3", minHeight: "100vh" }}>
      <div className="max-w-2xl mx-auto px-4 py-10">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 style={{ color: "#0A5C46" }} className="text-2xl font-semibold">My listings</h1>
            <p style={{ color: "#1D9E75" }} className="text-sm mt-0.5">Manage your property listings</p>
          </div>
          <Link
            href="/listings/new"
            style={{ background: "#0F7A5F", color: "#7FEDD0" }}
            className="text-sm font-medium px-4 py-2 rounded-full"
          >
            + New listing
          </Link>
        </div>

        {loading ? (
          <p style={{ color: "#1D9E75" }} className="text-sm">Loading...</p>
        ) : listings.length === 0 ? (
          <div style={{ background: "#C8F5E8", border: "1px solid #9FE1CB" }} className="rounded-2xl p-8 text-center">
            <p style={{ color: "#0A5C46" }} className="font-medium mb-1">No listings yet</p>
            <p style={{ color: "#1D9E75" }} className="text-sm mb-4">Post your first property listing</p>
            <Link href="/listings/new" style={{ background: "#0F7A5F", color: "#7FEDD0" }} className="text-sm font-medium px-4 py-2 rounded-full">
              Post a listing
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {listings.map(l => (
              <div key={l.id} style={{ background: "#C8F5E8", border: "1px solid #9FE1CB" }} className="rounded-2xl p-4 flex items-center gap-4">
                {/* Photo */}
                <div style={{ background: "#B2F0DC" }} className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden">
                  {l.photos && l.photos.length > 0 ? (
                    <img src={l.photos[0]} alt={l.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-6 h-6" style={{ color: "#7FEDD0" }} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p style={{ color: "#0A5C46" }} className="font-medium text-sm truncate">{l.title}</p>
                  <p style={{ color: "#1D9E75" }} className="text-xs mt-0.5">{l.price.toLocaleString()} KWD · {l.area}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span style={{ background: l.listing_type === "rent" ? "#0F7A5F" : "#0A5C46", color: "#7FEDD0" }} className="text-xs px-2 py-0.5 rounded-full">
                      {l.listing_type === "rent" ? "For rent" : "For sale"}
                    </span>
                    {l.is_verified && (
                      <span style={{ background: "#1D9E75", color: "white" }} className="text-xs px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Link
                    href={`/listings/${l.id}`}
                    style={{ color: "#1D9E75", border: "1px solid #1D9E75" }}
                    className="text-xs px-3 py-1.5 rounded-full text-center"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => deleteListing(l.id)}
                    disabled={deletingId === l.id}
                    style={{ background: "#0A5C46", color: "#7FEDD0" }}
                    className="text-xs px-3 py-1.5 rounded-full disabled:opacity-50"
                  >
                    {deletingId === l.id ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6">
          <Link href="/listings" style={{ color: "#1D9E75" }} className="text-sm flex items-center gap-1">
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
