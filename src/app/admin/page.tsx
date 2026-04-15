"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-browser"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

const ADMIN_EMAIL = "nalmuzaini03@gmail.com"

type Listing = {
  id: string
  title: string
  title_ar: string | null
  title_en: string | null
  description: string | null
  description_ar: string | null
  description_en: string | null
  price: number
  price_per_night: number | null
  area: string
  listing_type: string
  property_type: string
  photos: string[]
  is_verified: boolean
  created_at: string
  user_id: string
  phone_number: string
}

export default function AdminPage() {
  const router = useRouter()
  const supabaseBrowser = createClient()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "verified" | "unverified">("all")
  const [search, setSearch] = useState("")
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [backfilling, setBackfilling] = useState(false)
  const [backfillDone, setBackfillDone] = useState(0)

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.push("/login"); return }
      if (data.session.user.email !== ADMIN_EMAIL) { router.push("/"); return }

      const { data: listings } = await supabase
        .from("property_listings")
        .select("*")
        .order("created_at", { ascending: false })

      setListings(listings ?? [])
      setLoading(false)
    })
  }, [])

  async function toggleVerified(id: string, current: boolean) {
    setTogglingId(id)
    await supabaseBrowser.from("property_listings").update({ is_verified: !current }).eq("id", id)
    setListings(listings.map(l => l.id === id ? { ...l, is_verified: !current } : l))
    setTogglingId(null)
  }

  async function backfillTranslations() {
    setBackfilling(true)
    setBackfillDone(0)

    const untranslated = listings.filter(l => !l.title_ar && !l.title_en)

    for (const listing of untranslated) {
      try {
        const isArabic = /[\u0600-\u06FF]/.test(listing.title)
        const targetLang = isArabic ? "en" : "ar"

        const [titleRes, descRes] = await Promise.all([
          fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: listing.title, targetLang }),
          }),
          listing.description ? fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: listing.description, targetLang }),
          }) : Promise.resolve(null),
        ])

        const titleData = await titleRes.json()
        const descData = descRes ? await descRes.json() : { translated: "" }

        const update = isArabic ? {
          title_ar: listing.title,
          title_en: titleData.translated,
          description_ar: listing.description,
          description_en: descData.translated,
        } : {
          title_en: listing.title,
          title_ar: titleData.translated,
          description_en: listing.description,
          description_ar: descData.translated,
        }

        await supabase.from("property_listings").update(update).eq("id", listing.id)
        setBackfillDone(n => n + 1)
      } catch {
        continue
      }
    }

    setBackfilling(false)
  }

  async function deleteListing(id: string) {
    if (!confirm("Are you sure you want to delete this listing?")) return
    setDeletingId(id)
    const { error } = await supabaseBrowser.from("property_listings").delete().eq("id", id)
    if (!error) {
      setListings(listings.filter(l => l.id !== id))
    }
    setDeletingId(null)
  }

  const filtered = listings.filter(l => {
    const matchesFilter = filter === "all" ? true : filter === "verified" ? l.is_verified : !l.is_verified
    const matchesSearch = search === "" ? true :
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.area.toLowerCase().includes(search.toLowerCase()) ||
      l.phone_number.includes(search)
    return matchesFilter && matchesSearch
  })

  const totalVerified = listings.filter(l => l.is_verified).length
  const totalUnverified = listings.filter(l => !l.is_verified).length

  const badgeBg = (type: string) =>
    type === "rent" ? "#FF385C" : type === "short_stay" ? "#7C3AED" : "#222"
  const badgeLabel = (type: string) =>
    type === "rent" ? "For rent" : type === "short_stay" ? "Short stay" : "For sale"

  return (
    <div style={{ background: "#F7F7F7", minHeight: "100vh" }}>

      {/* Nav */}
      <nav style={{ background: "white", borderBottom: "1px solid #EBEBEB" }} className="px-6 sm:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" style={{ fontSize: "22px", fontWeight: 800, color: "#FF385C", letterSpacing: "-0.5px", textDecoration: "none" }}>aqari</Link>
          <span style={{ fontSize: "11px", color: "#AAAAAA", letterSpacing: "1.5px", fontWeight: 600 }}>ADMIN</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" style={{ fontSize: "13px", color: "#222", fontWeight: 500 }}>Dashboard</Link>
          <Link href="/listings" style={{ fontSize: "13px", color: "#222", fontWeight: 500 }}>Browse</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-10">

        <div className="mb-8">
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#222", letterSpacing: "-0.5px" }}>Admin Panel</h1>
          <p style={{ fontSize: "15px", color: "#717171", marginTop: "4px" }}>Manage all listings on Aqari</p>
        </div>

        {loading ? (
          <p style={{ fontSize: "14px", color: "#717171" }}>Loading...</p>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { label: "Total listings", value: listings.length, color: "#222" },
                { label: "Verified", value: totalVerified, color: "#25D366" },
                { label: "Pending verification", value: totalUnverified, color: "#FF385C" },
              ].map(s => (
                <div key={s.label} style={{ background: "white", border: "1px solid #EBEBEB", borderRadius: "16px", padding: "20px" }}>
                  <p style={{ fontSize: "28px", fontWeight: 800, color: s.color }}>{s.value}</p>
                  <p style={{ fontSize: "13px", color: "#717171", marginTop: "4px" }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Backfill translations */}
            <div style={{ background: "white", border: "1px solid #EBEBEB", borderRadius: "16px", padding: "20px", marginBottom: "8px" }} className="flex items-center justify-between">
              <div>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "#222" }}>Translate existing listings</p>
                <p style={{ fontSize: "13px", color: "#717171", marginTop: "2px" }}>
                  {backfilling
                    ? `Translating... ${backfillDone} done`
                    : `${listings.filter(l => !l.title_ar && !l.title_en).length} listings need translation`}
                </p>
              </div>
              <button
                onClick={backfillTranslations}
                disabled={backfilling || listings.filter(l => !l.title_ar && !l.title_en).length === 0}
                style={{
                  background: backfilling ? "#DDDDDD" : "#FF385C",
                  color: "white", border: "none", borderRadius: "8px",
                  padding: "10px 20px", fontSize: "13px", fontWeight: 700,
                  cursor: backfilling ? "not-allowed" : "pointer",
                }}
              >
                {backfilling ? `${backfillDone} / ${listings.filter(l => !l.title_ar && !l.title_en).length}` : "Translate all →"}
              </button>
            </div>

            {/* Search + filter */}
            <div style={{ background: "white", border: "1px solid #EBEBEB", borderRadius: "16px", padding: "16px 20px", marginBottom: "16px" }} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by title, area or phone..."
                style={{ background: "#F7F7F7", border: "1px solid #EBEBEB", borderRadius: "8px", fontSize: "14px", padding: "10px 16px", flex: 1, width: "100%", outline: "none", color: "#222" }}
              />
              <div className="flex gap-2">
                {(["all", "unverified", "verified"] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    style={{ padding: "8px 16px", borderRadius: "24px", border: filter === f ? "2px solid #222" : "1px solid #DDDDDD", background: filter === f ? "#222" : "white", color: filter === f ? "white" : "#222", fontSize: "13px", fontWeight: filter === f ? 700 : 400, cursor: "pointer" }}>
                    {f === "all" ? "All" : f === "unverified" ? "Pending" : "Verified"}
                  </button>
                ))}
              </div>
            </div>

            {/* Listings table */}
            <div style={{ background: "white", border: "1px solid #EBEBEB", borderRadius: "16px", overflow: "hidden" }}>
              <div style={{ padding: "16px 24px", borderBottom: "1px solid #EBEBEB" }}>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#222" }}>{filtered.length} listings</p>
              </div>

              {filtered.length === 0 ? (
                <div className="p-10 text-center">
                  <p style={{ fontSize: "16px", color: "#717171" }}>No listings found</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {filtered.map((listing, i) => (
                    <div key={listing.id} style={{ padding: "16px 24px", borderBottom: i < filtered.length - 1 ? "1px solid #EBEBEB" : "none" }}>
                      <div className="flex items-center gap-4">

                        {/* Thumbnail */}
                        <div style={{ borderRadius: "8px", background: "#F7F7F7", width: "56px", height: "56px", flexShrink: 0, overflow: "hidden" }}>
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
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <p style={{ fontSize: "14px", fontWeight: 600, color: "#222" }} className="truncate">{listing.title}</p>
                            {listing.is_verified && (
                              <span style={{ background: "#E8F8EF", color: "#25D366", fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "20px" }}>✓ Verified</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span style={{ background: badgeBg(listing.listing_type), color: "white", fontSize: "10px", fontWeight: 600, padding: "2px 8px", borderRadius: "4px" }}>
                              {badgeLabel(listing.listing_type)}
                            </span>
                            <span style={{ fontSize: "12px", color: "#717171" }}>
                              {listing.listing_type === "short_stay"
                                ? `${(listing.price_per_night ?? listing.price).toLocaleString()} KWD / night`
                                : `${listing.price.toLocaleString()} KWD${listing.listing_type === "rent" ? " / month" : ""}`
                              } · {listing.area} · {listing.property_type}
                            </span>
                          </div>
                          <p style={{ fontSize: "11px", color: "#AAAAAA", marginTop: "4px" }}>
                            {listing.phone_number} · {new Date(listing.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
                          <button
                            onClick={() => toggleVerified(listing.id, listing.is_verified)}
                            disabled={togglingId === listing.id}
                            style={{
                              background: listing.is_verified ? "#F7F7F7" : "#E8F8EF",
                              color: listing.is_verified ? "#717171" : "#25D366",
                              border: `1px solid ${listing.is_verified ? "#DDDDDD" : "#25D366"}`,
                              fontSize: "12px", borderRadius: "8px", padding: "6px 14px",
                              fontWeight: 600, cursor: "pointer",
                              opacity: togglingId === listing.id ? 0.5 : 1,
                            }}
                          >
                            {togglingId === listing.id ? "..." : listing.is_verified ? "Unverify" : "✓ Verify"}
                          </button>
                          <Link href={`/listings/${listing.id}`}
                            style={{ color: "#222", border: "1px solid #DDDDDD", fontSize: "12px", borderRadius: "8px", padding: "6px 14px", fontWeight: 500, textDecoration: "none" }}>
                            View
                          </Link>
                          <button
                            onClick={() => deleteListing(listing.id)}
                            disabled={deletingId === listing.id}
                            style={{ background: "#FFF0F2", color: "#C4001B", border: "1px solid #FFD6DF", fontSize: "12px", borderRadius: "8px", padding: "6px 14px", fontWeight: 500, cursor: "pointer", opacity: deletingId === listing.id ? 0.5 : 1 }}
                          >
                            {deletingId === listing.id ? "..." : "Delete"}
                          </button>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
