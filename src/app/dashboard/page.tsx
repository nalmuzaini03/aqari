"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-browser"
import Link from "next/link"

type ListingStats = {
  id: string
  title: string
  price: number
  area: string
  listing_type: string
  photos: string[]
  views: number
  clicks: number
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [stats, setStats] = useState<ListingStats[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.push("/login"); return }

      setUserName(data.session.user.email?.split("@")[0] ?? "there")

      const { data: listings } = await supabase
        .from("property_listings")
        .select("id, title, price, area, listing_type, photos")
        .eq("user_id", data.session.user.id)
        .order("created_at", { ascending: false })

      if (!listings) { setLoading(false); return }

      const statsWithCounts = await Promise.all(
        listings.map(async (listing) => {
          const [{ count: views }, { count: clicks }] = await Promise.all([
            supabase.from("listing_views").select("*", { count: "exact", head: true }).eq("listing_id", listing.id),
            supabase.from("listing_clicks").select("*", { count: "exact", head: true }).eq("listing_id", listing.id),
          ])
          return { ...listing, views: views ?? 0, clicks: clicks ?? 0 }
        })
      )

      setStats(statsWithCounts.sort((a, b) => b.views - a.views))
      setLoading(false)
    })
  }, [])

  const totalViews = stats.reduce((sum, l) => sum + l.views, 0)
  const totalClicks = stats.reduce((sum, l) => sum + l.clicks, 0)
  const conversionRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0"
  const maxViews = Math.max(...stats.map(l => l.views), 1)

  return (
    <div style={{ background: "#E8F8F3", minHeight: "100vh" }}>

      {/* Nav */}
      <nav style={{ background: "#0A5C46" }} className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" style={{ color: "white" }} className="text-xl font-semibold tracking-tight">
            aq<span style={{ color: "#7FEDD0" }}>a</span>ri
          </Link>
          <span style={{ color: "#5DCAA5", fontSize: "12px" }}>Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/listings" style={{ color: "#B2F0DC" }} className="text-sm">Browse</Link>
          <Link href="/listings/new" style={{ background: "#7FEDD0", color: "#0A5C46" }} className="text-sm font-medium px-4 py-2 rounded-full">
            + New listing
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Welcome */}
        <div className="mb-8">
          <h1 style={{ color: "#0A5C46" }} className="text-2xl font-semibold">Good to see you, {userName}</h1>
          <p style={{ color: "#1D9E75" }} className="text-sm mt-1">Here's how your listings are performing</p>
        </div>

        {loading ? (
          <p style={{ color: "#1D9E75" }} className="text-sm">Loading your dashboard...</p>
        ) : stats.length === 0 ? (
          <div style={{ background: "#C8F5E8", border: "1px solid #9FE1CB" }} className="rounded-2xl p-10 text-center">
            <p style={{ color: "#0A5C46" }} className="text-lg font-medium mb-2">No listings yet</p>
            <p style={{ color: "#1D9E75" }} className="text-sm mb-6">Post your first listing to start seeing analytics</p>
            <Link href="/listings/new" style={{ background: "#0F7A5F", color: "#7FEDD0" }} className="text-sm font-medium px-6 py-3 rounded-full">
              Post a listing
            </Link>
          </div>
        ) : (
          <>
            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { label: "Total views", value: totalViews.toLocaleString() },
                { label: "WhatsApp taps", value: totalClicks.toLocaleString() },
                { label: "Active listings", value: stats.length.toString() },
                { label: "Conversion rate", value: `${conversionRate}%` },
              ].map(s => (
                <div key={s.label} style={{ background: "#C8F5E8", border: "1px solid #9FE1CB" }} className="rounded-2xl p-5">
                  <p style={{ color: "#1D9E75" }} className="text-xs mb-1">{s.label}</p>
                  <p style={{ color: "#0A5C46" }} className="text-3xl font-semibold">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Listings performance */}
            <h2 style={{ color: "#0A5C46" }} className="text-base font-medium mb-4">Listing performance</h2>
            <div className="flex flex-col gap-3">
              {stats.map((listing, i) => (
                <div
                  key={listing.id}
                  style={{
                    background: i === 0 ? "#B2F0DC" : "#C8F5E8",
                    border: i === 0 ? "2px solid #1D9E75" : "1px solid #9FE1CB"
                  }}
                  className="rounded-2xl p-4"
                >
                  <div className="flex items-center gap-4">
                    {/* Photo */}
                    <div style={{ background: "#9FE1CB" }} className="w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden">
                      {listing.photos && listing.photos.length > 0 ? (
                        <img src={listing.photos[0]} alt={listing.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-6 h-6" style={{ color: "#0F7A5F" }} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p style={{ color: "#0A5C46" }} className="text-sm font-medium truncate">{listing.title}</p>
                        {i === 0 && (
                          <span style={{ background: "#0F7A5F", color: "#7FEDD0" }} className="text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                            Top performer
                          </span>
                        )}
                      </div>
                      <p style={{ color: "#1D9E75" }} className="text-xs">{listing.price.toLocaleString()} KWD · {listing.area}</p>

                      {/* Performance bar */}
                      <div className="mt-2">
                        <div style={{ background: "#9FE1CB" }} className="rounded-full h-1.5 mt-1">
                          <div
                            style={{ background: "#0F7A5F", width: `${(listing.views / maxViews) * 100}%` }}
                            className="h-1.5 rounded-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4 flex-shrink-0 text-center">
                      <div>
                        <p style={{ color: "#0A5C46" }} className="text-xl font-semibold">{listing.views}</p>
                        <p style={{ color: "#1D9E75" }} className="text-xs">Views</p>
                      </div>
                      <div>
                        <p style={{ color: "#0A5C46" }} className="text-xl font-semibold">{listing.clicks}</p>
                        <p style={{ color: "#1D9E75" }} className="text-xs">Taps</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      <Link
                        href={`/listings/${listing.id}`}
                        style={{ color: "#0F7A5F", border: "1px solid #1D9E75" }}
                        className="text-xs px-3 py-1.5 rounded-lg"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Upsell CTA */}
            <div style={{ background: "#0A5C46" }} className="rounded-2xl p-6 mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 style={{ color: "#E8FFF8" }} className="text-base font-medium mb-1">Get more views with featured listings</h3>
                <p style={{ color: "#7FEDD0" }} className="text-sm">Featured listings appear at the top of search results and get 3x more views.</p>
              </div>
              <Link
                href="/listings/new"
                style={{ background: "#7FEDD0", color: "#0A5C46" }}
                className="text-sm font-medium px-5 py-2.5 rounded-full whitespace-nowrap flex-shrink-0"
              >
                Feature a listing
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
