import { Listing } from "@/types/listing"
import Image from "next/image"
import Link from "next/link"

export default function ListingCard({ listing: l }: { listing: Listing }) {
  const hasPhoto = l.photos && l.photos.length > 0

  return (
    <Link href={`/listings/${l.id}`} className="group block rounded-xl border border-gray-100 bg-white overflow-hidden hover:shadow-md transition-shadow">
      {/* Photo */}
      <div className="relative h-44 bg-gray-50">
        {hasPhoto ? (
          <Image src={l.photos[0]} alt={l.title} fill className="object-cover" />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-200">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22" fill="white"/>
            </svg>
          </div>
        )}
        <span className={`absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-medium
          ${l.listing_type === "rent" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>
          {l.listing_type === "rent" ? "For rent" : "For sale"}
        </span>
        {l.is_verified && (
          <span className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium">
            Verified
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-base font-medium text-gray-900">
          {l.price.toLocaleString()} KWD
          {l.listing_type === "rent" && <span className="text-xs font-normal text-gray-400"> / month</span>}
        </p>
        <p className="text-sm text-gray-500 truncate mt-0.5">{l.title}</p>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1.5">
          {l.bedrooms !== null && (
            <>{l.bedrooms === 0 ? "Studio" : `${l.bedrooms} beds`}<span>·</span></>
          )}
          {l.bathrooms !== null && <>{l.bathrooms} baths<span>·</span></>}
          <span className="capitalize">{l.property_type}</span>
        </div>
        <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"/>
          </svg>
          {l.area}
        </p>
      </div>
    </Link>
  )
}
