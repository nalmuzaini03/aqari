"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-browser"
import Link from "next/link"

type ListingStats = {
  id: string
  title: string
  price: number
  price_per_night: number | null
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
        .select("id, title, price, price_per_night, area, listing_type, photos")
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

  const badgeBg = (type: string) =>
    type === "rent" ? "#FF385C" : type === "short_stay" ? "#7C3AED" : "#222"
  const badgeLabel = (type: string) =>
    type === "rent" ? "For rent" : type === "short_stay" ? "Short stay" : "For sale"
  const priceLabel = (l: ListingStats) =>
    l.listing_type === "short_stay"
      ? `${(l.price_per_night ?? l.price).toLocaleString()} KWD / night`
      : `${l.price.toLocaleString()} KWD${l.listing_type === "rent" ? " / month" : ""}`

  return (
    <div style={{ background: "#F7F7F7", minHeight: "100vh" }}>

      {/* Nav */}
      <nav style={{ background: "white", borderBottom: "1px solid #EBEBEB" }} className="px-6 sm:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" style={{ fontSize: "22px", fontWeight: 800, color: "#FF385C", letterSpacing: "-0.5px", textDecoration: "none" }}>aqari</Link>
          <span style={{ fontSize: "11px", color: "#AAAAAA", letterSpacing: "1.5px", fontWeight: 600 }}>DASHBOARD</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/listings" style={{ fontSize: "13px", color: "#222", fontWeight: 500 }}>Browse</Link>
          <Link href="/listings/new" style={{ background: "#FF385C", color: "white", fontSize: "13px", borderRadius: "24px", fontWeight: 600, padding: "8px 20px", textDecoration: "none" }}>
            + New listing
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#222", letterSpacing: "-0.5px" }}>
            Welcome back, {userName} 👋
          </h1>
          <p style={{ fontSize: "15px", color: "#717171", marginTop: "4px" }}>Here's how your listings are performing</p>
        </div>

        {loading ? (
          <p style={{ fontSize: "14px", color: "#717171" }}>Loading your dashboard...</p>
        ) : stats.length === 0 ? (
          <div style={{ background: "white", border: "1px solid #EBEBEB", borderRadius: "16px" }} className="p-12 text-center">
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏠</div>
            <p style={{ fontSize: "20px", fontWeight: 700, color: "#222" }} className="mb-2">No listings yet</p>
            <p style={{ fontSize: "14px", color: "#717171" }} className="mb-6">Post your first listing to start seeing analytics</p>
            <Link href="/listings/new" style={{ background: "#FF385C", color: "white", fontSize: "14px", borderRadius: "8px", fontWeight: 700, padding: "12px 28px", textDecoration: "none" }}>
              Post a listing
            </Link>
          </div>
        ) : (
          <>
            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { label: "Total views", value: totalViews.toLocaleString(), icon: "👁" },
                { label: "WhatsApp taps", value: totalClicks.toLocaleString(), icon: "💬" },
                { label: "Active listings", value: stats.length.toString(), icon: "🏠" },
                { label: "Conversion rate", value: `${conversionRate}%`, icon: "📈" },
              ].map(s => (
                <div key={s.label} style={{ background: "white", border: "1px solid #EBEBEB", borderRadius: "16px", padding: "20px" }}>
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>{s.icon}</div>
                  <p style={{ fontSize: "26px", fontWeight: 800, color: "#222", letterSpacing: "-0.5px" }}>{s.value}</p>
                  <p style={{ fontSize: "13px", color: "#717171", marginTop: "2px" }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Listings performance */}
            <div style={{ background: "white", border: "1px solid #EBEBEB", borderRadius: "16px", overflow: "hidden", marginBottom: "16px" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #EBEBEB", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p style={{ fontSize: "16px", fontWeight: 700, color: "#222" }}>Listing performance</p>
                <Link href="/listings/new" style={{ fontSize: "13px", color: "#FF385C", fontWeight: 600, textDecoration: "none" }}>+ Add listing</Link>
              </div>

              <div className="flex flex-col">
                {stats.map((listing, i) => (
                  <div key={listing.id} style={{ padding: "16px 24px", borderBottom: i < stats.length - 1 ? "1px solid #EBEBEB" : "none" }}>
                    <div className="flex items-center gap-4">

                      {/* Thumbnail */}
                      <div style={{ borderRadius: "10px", background: "#F7F7F7", width: "56px", height: "56px", flexShrink: 0, overflow: "hidden" }}>
                        {listing.photos && listing.photos.length > 0 ? (
                          <img src={listing.photos[0]} alt={listing.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-5 h-5" style={{ color: "#DDDDDD" }} fill="currentColor" viewBox="0 0 24 24">
                              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p style={{ fontSize: "14px", fontWeight: 600, color: "#222" }} className="truncate">{listing.title}</p>
                          {i === 0 && (
                            <span style={{ background: "#FFF0F2", color: "#FF385C", fontSize: "10px", fontWeight: 700, letterSpacing: "0.5px", padding: "2px 8px", borderRadius: "20px", flexShrink: 0 }}>
                              TOP
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span style={{ background: badgeBg(listing.listing_type), color: "white", fontSize: "10px", fontWeight: 600, padding: "2px 8px", borderRadius: "4px" }}>
                            {badgeLabel(listing.listing_type)}
                          </span>
                          <span style={{ fontSize: "12px", color: "#717171" }}>{priceLabel(listing)} · {listing.area}</span>
                        </div>
                        {/* Progress bar */}
                        <div style={{ background: "#F7F7F7", borderRadius: "99px", height: "4px" }}>
                          <div style={{ background: "#FF385C", width: `${(listing.views / maxViews) * 100}%`, borderRadius: "99px", height: "4px", transition: "width 0.5s" }} />
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex gap-5 flex-shrink-0 text-center">
                        <div>
                          <p style={{ fontSize: "18px", fontWeight: 700, color: "#222" }}>{listing.views}</p>
                          <p style={{ fontSize: "11px", color: "#717171" }}>Views</p>
                        </div>
                        <div>
                          <p style={{ fontSize: "18px", fontWeight: 700, color: "#25D366" }}>{listing.clicks}</p>
                          <p style={{ fontSize: "11px", color: "#717171" }}>Taps</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-shrink-0">
                        <Link href={`/listings/${listing.id}`} style={{ fontSize: "12px", color: "#222", border: "1px solid #DDDDDD", borderRadius: "8px", padding: "6px 14px", fontWeight: 500, textDecoration: "none" }}>
                          View
                        </Link>
                        <Link href={`/my-listings`} style={{ fontSize: "12px", color: "#FF385C", border: "1px solid #FFD6DF", borderRadius: "8px", padding: "6px 14px", fontWeight: 500, textDecoration: "none" }}>
                          Manage
                        </Link>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { href: "/listings/new", icon: "➕", title: "New listing", desc: "Post a property for free" },
                { href: "/my-listings", icon: "📋", title: "My listings", desc: "Edit or delete listings" },
                { href: "/listings", icon: "🔍", title: "Browse market", desc: "See what's listed in Kuwait" },
              ].map(a => (
                <Link key={a.href} href={a.href} style={{ background: "white", border: "1px solid #EBEBEB", borderRadius: "16px", padding: "20px", textDecoration: "none", display: "block" }}>
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>{a.icon}</div>
                  <p style={{ fontSize: "15px", fontWeight: 700, color: "#222", marginBottom: "2px" }}>{a.title}</p>
                  <p style={{ fontSize: "13px", color: "#717171" }}>{a.desc}</p>
                </Link>
              ))}
            </div>

          </>
        )}
      </div>
    </div>
  )
}
