import { Listing } from "@/types/listing"
import Image from "next/image"
import Link from "next/link"

export default function ListingCard({ listing: l }: { listing: Listing }) {
  const hasPhoto = l.photos && l.photos.length > 0

  return (
    <Link href={`/listings/${l.id}`} style={{ background: "#C8F5E8", border: "1px solid #9FE1CB" }} className="group block rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
      <div style={{ background: "#B2F0DC" }} className="relative h-44">
        {hasPhoto ? (
          <Image src={l.photos[0]} alt={l.title} fill className="object-cover" />
        ) : (
          <div className="h-full flex items-center justify-center">
            <svg className="w-10 h-10" style={{ color: "#7FEDD0" }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            </svg>
          </div>
        )}
        <span style={{ background: l.listing_type === "rent" ? "#0F7A5F" : "#0A5C46", color: "#7FEDD0" }} className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-medium">
          {l.listing_type === "rent" ? "For rent" : "For sale"}
        </span>
        {l.is_verified && (
          <span style={{ background: "#1D9E75", color: "white" }} className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium">
            Verified
          </span>
        )}
      </div>

      <div className="p-4">
        <p style={{ color: "#0A5C46" }} className="text-lg font-semibold">
          {l.price.toLocaleString()} KWD
          {l.listing_type === "rent" && <span style={{ color: "#1D9E75" }} className="text-xs font-normal"> / month</span>}
        </p>
        <p style={{ color: "#0F7A5F" }} className="text-sm truncate mt-0.5">{l.title}</p>
        <div style={{ color: "#1D9E75" }} className="flex items-center gap-1.5 text-xs mt-2">
          {l.bedrooms !== null && <>{l.bedrooms === 0 ? "Studio" : `${l.bedrooms} beds`}<span>·</span></>}
          {l.bathrooms !== null && <>{l.bathrooms} baths<span>·</span></>}
          <span className="capitalize">{l.property_type}</span>
        </div>
        <p style={{ color: "#1D9E75" }} className="text-xs mt-2 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"/>
          </svg>
          {l.area}
        </p>
      </div>
    </Link>
  )
}

