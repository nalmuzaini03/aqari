"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-browser"
import { Listing } from "@/types/listing"
import Link from "next/link"
import { useLang } from "@/lib/language-context"
import { t } from "@/lib/translations"

export default function MyListingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const { lang, setLang } = useLang()
  const tr = t[lang]
  const isAr = lang === "ar"

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

  const badgeBg = (type: string) =>
    type === "rent" ? "#FF385C" : type === "short_stay" ? "#7C3AED" : "#222"
  const badgeLabel = (type: string) =>
    type === "rent" ? tr.forRentBadge : type === "short_stay" ? tr.shortStayBadge : tr.forSaleBadge

  return (
    <div style={{ background: "white", minHeight: "100vh" }}>

      {/* Nav */}
      <nav style={{ background: "white", borderBottom: "1px solid #EBEBEB" }} className="flex items-center justify-between px-6 sm:px-10 py-4">
        <Link href="/" style={{ fontSize: "22px", fontWeight: 800, color: "#FF385C", letterSpacing: "-0.5px", textDecoration: "none" }}>aqari</Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(isAr ? "en" : "ar")}
            style={{ fontSize: "13px", color: "#222", border: "1px solid #DDDDDD", padding: "7px 14px", borderRadius: "24px", background: "white", fontWeight: 600, cursor: "pointer" }}
          >
            {isAr ? "English" : "العربية"}
          </button>
          <Link href="/listings/new" style={{ background: "#FF385C", color: "white", fontSize: "13px", borderRadius: "24px", fontWeight: 600, padding: "8px 20px", textDecoration: "none" }}>
            {tr.newListing}
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">

        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#222", letterSpacing: "-0.5px" }} className="mb-1">{tr.myListings}</h1>
        <p style={{ fontSize: "15px", color: "#717171" }} className="mb-8">{tr.manageListings}</p>

        {loading ? (
          <p style={{ fontSize: "14px", color: "#717171" }}>{tr.loading}</p>
        ) : listings.length === 0 ? (
          <div style={{ border: "1px solid #EBEBEB", borderRadius: "16px" }} className="p-10 text-center">
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏠</div>
            <p style={{ fontSize: "20px", fontWeight: 700, color: "#222" }} className="mb-2">{tr.noListingsYet}</p>
            <p style={{ fontSize: "14px", color: "#717171" }} className="mb-6">{tr.noListingsDashSub}</p>
            <Link href="/listings/new" style={{ background: "#FF385C", color: "white", fontSize: "14px", borderRadius: "8px", fontWeight: 700, padding: "12px 28px", textDecoration: "none" }}>
              {tr.postTitle}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {listings.map(l => (
              <div key={l.id} style={{ border: "1px solid #EBEBEB", borderRadius: "12px", padding: "16px" }} className="flex items-center gap-4">

                {/* Thumbnail */}
                <div style={{ borderRadius: "8px", background: "#F7F7F7", width: "64px", height: "64px", flexShrink: 0, overflow: "hidden" }}>
                  {l.photos && l.photos.length > 0 ? (
                    <img src={l.photos[0]} alt={l.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-6 h-6" style={{ color: "#DDDDDD" }} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "#222" }} className="truncate">{l.title}</p>
                  <p style={{ fontSize: "13px", color: "#717171" }} className="mt-0.5">
                    {l.listing_type === "short_stay"
                      ? `${(l.price_per_night ?? l.price).toLocaleString()} ${isAr ? "د.ك" : "KWD"} ${tr.perNight}`
                      : `${l.price.toLocaleString()} ${isAr ? "د.ك" : "KWD"}${l.listing_type === "rent" ? ` ${tr.perMonth}` : ""}`
                    } · {l.area}
                  </p>
                  <span style={{ background: badgeBg(l.listing_type), color: "white", fontSize: "10px", letterSpacing: "0.5px", fontWeight: 600 }} className="inline-block mt-1.5 px-2 py-0.5 rounded uppercase">
                    {badgeLabel(l.listing_type)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <Link href={`/listings/${l.id}`} style={{ color: "#222", border: "1px solid #DDDDDD", fontSize: "12px", borderRadius: "8px", padding: "6px 14px", fontWeight: 500, textDecoration: "none" }}>
                    {tr.view}
                  </Link>
                  <button
                    onClick={() => deleteListing(l.id)}
                    disabled={deletingId === l.id}
                    style={{ background: "#FFF0F2", color: "#C4001B", border: "1px solid #FFD6DF", fontSize: "12px", borderRadius: "8px", padding: "6px 14px", fontWeight: 500, cursor: "pointer", opacity: deletingId === l.id ? 0.5 : 1 }}
                  >
                    {deletingId === l.id ? "..." : tr.delete}
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Link href="/listings" style={{ color: "#717171", fontSize: "13px", textDecoration: "none" }} className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {tr.backToListings}
          </Link>
        </div>

      </div>
    </div>
  )
}
