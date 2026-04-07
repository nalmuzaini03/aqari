import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: listing, error } = await supabase
    .from("property_listings")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !listing) return notFound()

  const whatsappNumber = listing.phone_number.replace(/\D/g, "")
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hi, I'm interested in your listing: ${listing.title}`

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/listings" className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to listings
      </Link>

      {listing.photos && listing.photos.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden mb-6">
          {listing.photos.slice(0, 4).map((url: string, i: number) => (
            <img key={i} src={url} alt={listing.title} className="w-full h-56 object-cover" />
          ))}
        </div>
      ) : (
        <div className="w-full h-56 bg-gray-50 rounded-xl flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-gray-200" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          </svg>
        </div>
      )}

      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${listing.listing_type === "rent" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>
              {listing.listing_type === "rent" ? "For rent" : "For sale"}
            </span>
            {listing.is_verified && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium">
                Verified
              </span>
            )}
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">{listing.title}</h1>
          <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"/>
            </svg>
            {listing.area}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl font-semibold text-gray-900">{listing.price.toLocaleString()} KWD</p>
          {listing.listing_type === "rent" && (
            <p className="text-sm text-gray-400">/ month</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {listing.bedrooms !== null && (
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-lg font-medium text-gray-900">{listing.bedrooms === 0 ? "Studio" : listing.bedrooms}</p>
            <p className="text-xs text-gray-400 mt-0.5">Bedrooms</p>
          </div>
        )}
        {listing.bathrooms !== null && (
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-lg font-medium text-gray-900">{listing.bathrooms}</p>
            <p className="text-xs text-gray-400 mt-0.5">Bathrooms</p>
          </div>
        )}
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-lg font-medium text-gray-900 capitalize">{listing.property_type}</p>
          <p className="text-xs text-gray-400 mt-0.5">Type</p>
        </div>
      </div>

      {listing.description && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-700 mb-2">Description</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{listing.description}</p>
        </div>
      )}

      <div className="border-t border-gray-100 pt-6">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-emerald-600 text-white rounded-xl py-3 text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
          </svg>
          Contact on WhatsApp
        </a>
        <p className="text-center text-xs text-gray-400 mt-2">{listing.phone_number}</p>
      </div>
    </div>
  )
}
