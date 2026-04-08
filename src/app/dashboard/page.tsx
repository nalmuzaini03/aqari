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
    <div style={{ background: "#FAF8F4", minHeight: "100vh" }}>
      <nav style={{ background: "#1C3829" }} className="px-6 sm:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: "#FAF8F4", letterSpacing: "3px" }}>
            AQ<span style={{ color: "#A8D5B5" }}>A</span>RI
          </Link>
          <span style={{ fontSize: "11px", color: "#6BA882", letterSpacing: "1.5px" }}>DASHBOARD</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/listings" style={{ fontSize: "13px", color: "#8FB89A" }}>Browse</Link>
          <Link href="/listings/new" style={{ background: "#FAF8F4", color: "#1C3829", fontSize: "13px", borderRadius: "4px" }} className="px-4 py-2 font-medium">
            + New listing
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-10">
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "32px", color: "#1C3829", fontWeight: "400" }}>Good to see you, {userName}</h1>
          <p style={{ fontSize: "14px", color: "#8C7B65", marginTop: "4px" }}>Here's how your listings are performing</p>
        </div>

        {loading ? (
          <p style={{ fontSize: "14px", color: "#8C7B65" }}>Loading your dashboard...</p>
        ) : stats.length === 0 ? (
          <div style={{ background: "#F2EDE4", border: "1px solid #E8E0D0", borderRadius: "8px" }} className="p-10 text-center">
            <p style={{ fontFamily: "Georgia, serif", fontSize: "22px", color: "#1C3829" }} className="mb-2">No listings yet</p>
            <p style={{ fontSize: "14px", color: "#8C7B65" }} className="mb-6">Post your first listing to start seeing analytics</p>
            <Link href="/listings/new" style={{ background: "#1C3829", color: "#FAF8F4", fontSize: "13px", borderRadius: "4px" }} className="px-6 py-2.5 font-medium">
              Post a listing
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
              {[
                { label: "TOTAL VIEWS", value: totalViews.toLocaleString() },
                { label: "WHATSAPP TAPS", value: totalClicks.toLocaleString() },
                { label: "ACTIVE LISTINGS", value: stats.length.toString() },
                { label: "CONVERSION RATE", value: `${conversionRate}%` },
              ].map(s => (
                <div key={s.label} style={{ background: "#FAF8F4", border: "1px solid #E8E0D0", borderRadius: "8px" }} className="p-5">
                  <p style={{ fontSize: "10px", color: "#8C7B65", letterSpacing: "1px" }} className="mb-2">{s.label}</p>
                  <p style={{ fontFamily: "Georgia, serif", fontSize: "28px", color: "#1C3829", fontWeight: "400" }}>{s.value}</p>
                </div>
              ))}
            </div>

            <p style={{ fontSize: "11px", color: "#8C7B65", letterSpacing: "1px" }} className="mb-4">LISTING PERFORMANCE</p>
            <div className="flex flex-col gap-3">
              {stats.map((listing, i) => (
                <div
                  key={listing.id}
                  style={{
                    background: "#FAF8F4",
                    border: i === 0 ? "1.5px solid #2D6A4F" : "1px solid #E8E0D0",
                    borderRadius: "8px",
                  }}
                  className="p-4"
                >
                  <div className="flex items-center gap-4">
                    <div style={{ background: "#F2EDE4", border: "1px solid #E8E0D0", borderRadius: "6px" }} className="w-14 h-14 flex-shrink-0 overflow-hidden">
                      {listing.photos && listing.photos.length > 0 ? (
                        <img src={listing.photos[0]} alt={listing.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-6 h-6" style={{ color: "#D4C9B5" }} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p style={{ fontSize: "14px", fontWeight: "500", color: "#1C3829" }} className="truncate">{listing.title}</p>
                        {i === 0 && (
                          <span style={{ background: "#1C3829", color: "#A8D5B5", fontSize: "10px", letterSpacing: "0.5px" }} className="px-2 py-0.5 rounded uppercase flex-shrink-0">
                            Top performer
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: "12px", color: "#8C7B65" }}>{listing.price.toLocaleString()} KWD · {listing.area}</p>
                      <div style={{ background: "#F2EDE4", borderRadius: "99px" }} className="h-1.5 mt-2">
                        <div
                          style={{ background: "#2D6A4F", width: `${(listing.views / maxViews) * 100}%`, borderRadius: "99px" }}
                          className="h-1.5"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 flex-shrink-0 text-center">
                      <div>
                        <p style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: "#1C3829" }}>{listing.views}</p>
                        <p style={{ fontSize: "11px", color: "#8C7B65", letterSpacing: "0.5px" }}>VIEWS</p>
                      </div>
                      <div>
                        <p style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: "#1C3829" }}>{listing.clicks}</p>
                        <p style={{ fontSize: "11px", color: "#8C7B65", letterSpacing: "0.5px" }}>TAPS</p>
                      </div>
                    </div>

                    <Link
                      href={`/listings/${listing.id}`}
                      style={{ color: "#2D6A4F", border: "1px solid #E8E0D0", fontSize: "12px", borderRadius: "4px" }}
                      className="px-3 py-1.5 flex-shrink-0"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "#1C3829", borderRadius: "8px" }} className="p-6 mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 style={{ fontFamily: "Georgia, serif", color: "#FAF8F4", fontSize: "18px", fontWeight: "400" }} className="mb-1">Get more views with featured listings</h3>
                <p style={{ fontSize: "14px", color: "#6BA882" }}>Featured listings appear at the top of search results and get 3x more views.</p>
              </div>
              <Link
                href="/listings/new"
                style={{ background: "#FAF8F4", color: "#1C3829", fontSize: "13px", borderRadius: "4px", whiteSpace: "nowrap" }}
                className="px-5 py-2.5 font-medium flex-shrink-0"
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
