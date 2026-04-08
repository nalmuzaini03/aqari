import { Listing } from "@/types/listing"
import Image from "next/image"
import Link from "next/link"

export default function ListingCard({ listing: l }: { listing: Listing }) {
  const hasPhoto = l.photos && l.photos.length > 0

  return (
    <Link href={`/listings/${l.id}`} style={{ background: "#FAF8F4", border: "1px solid #E8E0D0", borderRadius: "8px" }} className="group block overflow-hidden hover:shadow-lg transition-shadow">
      <div style={{ background: "#F2EDE4" }} className="relative h-48">
        {hasPhoto ? (
          <Image src={l.photos[0]} alt={l.title} fill className="object-cover" />
        ) : (
          <div className="h-full flex items-center justify-center">
            <svg className="w-10 h-10" style={{ color: "#D4C9B5" }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            </svg>
          </div>
        )}
        <span style={{ background: l.listing_type === "rent" ? "#1C3829" : "#2D6A4F", color: "#A8D5B5", fontSize: "11px", letterSpacing: "0.5px" }} className="absolute top-2 left-2 px-2 py-0.5 rounded font-medium uppercase">
          {l.listing_type === "rent" ? "For rent" : "For sale"}
        </span>
        {l.is_verified && (
          <span style={{ background: "#FAF8F4", color: "#2D6A4F", fontSize: "11px" }} className="absolute top-2 right-2 px-2 py-0.5 rounded font-medium">
            Verified
          </span>
        )}
      </div>

      <div className="p-4">
        <p style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: "#1C3829", fontWeight: "400" }}>
          {l.price.toLocaleString()} KWD
          {l.listing_type === "rent" && <span style={{ fontSize: "13px", color: "#8C7B65", fontFamily: "sans-serif", fontWeight: "400" }}> / month</span>}
        </p>
        <p style={{ fontSize: "14px", color: "#6B5F50" }} className="truncate mt-1">{l.title}</p>
        <div style={{ fontSize: "12px", color: "#8C7B65" }} className="flex items-center gap-1.5 mt-2">
          {l.bedrooms !== null && <>{l.bedrooms === 0 ? "Studio" : `${l.bedrooms} beds`}<span>·</span></>}
          {l.bathrooms !== null && <>{l.bathrooms} baths<span>·</span></>}
          <span className="capitalize">{l.property_type}</span>
        </div>
        <p style={{ fontSize: "12px", color: "#8C7B65" }} className="mt-2 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"/>
          </svg>
          {l.area}
        </p>
      </div>
    </Link>
  )
}
