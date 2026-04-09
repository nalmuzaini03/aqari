"use client"
import { Listing } from "@/types/listing"
import ListingCard from "./ListingCard"
import { useLang } from "@/lib/language-context"
import { t } from "@/lib/translations"

export default function ListingsGrid({ listings }: { listings: Listing[] }) {
  const { lang } = useLang()
  const tr = t[lang]
  const isAr = lang === "ar"

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 flex-1" style={{ background: "white" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
        <p style={{ fontSize: "20px", fontWeight: 700, color: "#222" }}>{tr.noListings}</p>
        <p style={{ fontSize: "14px", color: "#717171", marginTop: "8px" }}>{tr.noListingsSub}</p>
      </div>
    )
  }

  return (
    <div className="flex-1 px-4 py-6" style={{ background: "white" }}>
      <p style={{ fontSize: "13px", color: "#717171" }} className="mb-4">
        {isAr ? `${listings.length} ${tr.listingsFound}` : `${listings.length} listing${listings.length !== 1 ? "s" : ""} found`}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
        {listings.map(l => <ListingCard key={l.id} listing={l} />)}
      </div>
    </div>
  )
}
