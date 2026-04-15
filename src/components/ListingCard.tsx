import { Listing } from "@/types/listing"
import Image from "next/image"
import Link from "next/link"
import { useLang } from "@/lib/language-context"

export default function ListingCard({ listing: l }: { listing: Listing }) {
  const { lang } = useLang()
  const isAr = lang === "ar"
  const hasPhoto = l.photos && l.photos.length > 0

  const badgeBg = l.listing_type === "rent" ? "#FF385C" : l.listing_type === "short_stay" ? "#7C3AED" : "#222"
  const badgeLabel = l.listing_type === "rent" ? "For rent" : l.listing_type === "short_stay" ? "Short stay" : "For sale"

  const priceDisplay = l.listing_type === "short_stay"
    ? <>{(l.price_per_night ?? l.price).toLocaleString()} KWD <span style={{ fontSize: "13px", fontWeight: 400, color: "#717171" }}>/ night</span></>
    : <>{l.price.toLocaleString()} KWD{l.listing_type === "rent" && <span style={{ fontSize: "13px", fontWeight: 400, color: "#717171" }}> / month</span>}</>

  return (
    <Link href={`/listings/${l.id}`} className="group block overflow-hidden" style={{ borderRadius: "16px", border: "1px solid #EBEBEB", background: "white", transition: "box-shadow 0.2s" }}>
      <div className="relative" style={{ height: "200px", background: "#F7F7F7" }}>
        {hasPhoto ? (
          <Image src={l.photos[0]} alt={l.title} fill className="object-cover" style={{ borderRadius: "16px 16px 0 0" }} />
        ) : (
          <div className="h-full flex items-center justify-center">
            <svg className="w-10 h-10" style={{ color: "#DDDDDD" }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            </svg>
          </div>
        )}
        <span style={{ background: badgeBg, color: "white", fontSize: "11px", letterSpacing: "0.5px", fontWeight: 600, position: "absolute", top: "12px", left: "12px", padding: "4px 10px", borderRadius: "6px" }}>
          {badgeLabel}
        </span>
        {l.is_verified && (
          <span style={{ background: "white", color: "#222", fontSize: "11px", fontWeight: 600, position: "absolute", top: "12px", right: "12px", padding: "4px 10px", borderRadius: "6px", border: "1px solid #EBEBEB" }}>
            ✓ Verified
          </span>
        )}
      </div>

      <div className="p-4">
        <p style={{ fontSize: "15px", fontWeight: 700, color: "#222" }} className="truncate mb-1">
          {isAr ? (l.title_ar || l.title) : (l.title_en || l.title)}
        </p>
        <p style={{ fontSize: "13px", color: "#717171" }} className="flex items-center gap-1 mb-2">
          <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"/>
          </svg>
          {l.area}
        </p>
        <div style={{ fontSize: "12px", color: "#717171" }} className="flex items-center gap-1.5 mb-3">
          {l.bedrooms !== null && <>{l.bedrooms === 0 ? "Studio" : `${l.bedrooms} beds`}<span>·</span></>}
          {l.bathrooms !== null && <>{l.bathrooms} baths<span>·</span></>}
          <span className="capitalize">{l.property_type}</span>
        </div>
        <p style={{ fontSize: "16px", fontWeight: 700, color: "#222" }}>{priceDisplay}</p>
      </div>
    </Link>
  )
}
