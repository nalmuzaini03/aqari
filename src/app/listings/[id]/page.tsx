import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import Link from "next/link"
import DeleteButton from "@/components/DeleteButton"

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
    <div style={{ background: "#E8F8F3", minHeight: "100vh" }}>
      <div className="max-w-3xl mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-6">
          <Link href="/listings" style={{ color: "#1D9E75" }} className="text-sm flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to listings
          </Link>
          <DeleteButton listingId={listing.id} />
        </div>

        {listing.photos && listing.photos.length > 0 ? (
          <div className={`grid gap-2 rounded-2xl overflow-hidden mb-6 ${listing.photos.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
            {listing.photos.slice(0, 6).map((url: string, i: number) => (
              <img key={i} src={url} alt={listing.title} className={`w-full object-cover ${listing.photos.length === 1 ? "h-72" : "h-48"}`} />
            ))}
          </div>
        ) : (
          <div style={{ background: "#B2F0DC" }} className="w-full h-56 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-12 h-12" style={{ color: "#7FEDD0" }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            </svg>
          </div>
        )}

        <div style={{ background: "#C8F5E8", border: "1px solid #9FE1CB" }} className="rounded-2xl p-6 mb-4">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span style={{ background: "#0F7A5F", color: "#7FEDD0" }} className="text-xs px-2 py-0.5 rounded-full font-medium">
                  {listing.listing_type === "rent" ? "For rent" : "For sale"}
                </span>
                {listing.is_verified && (
                  <span style={{ background: "#1D9E75", color: "white" }} className="text-xs px-2 py-0.5 rounded-full font-medium">
                    Verified
                  </span>
                )}
              </div>
              <h1 style={{ color: "#0A5C46" }} className="text-2xl font-semibold">{listing.title}</h1>
              <p style={{ color: "#1D9E75" }} className="text-sm mt-1 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"/>
                </svg>
                {listing.area}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p style={{ color: "#0A5C46" }} className="text-2xl font-semibold">{listing.price.toLocaleString()} KWD</p>
              {listing.listing_type === "rent" && <p style={{ color: "#1D9E75" }} className="text-sm">/ month</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {listing.bedrooms !== null && (
              <div style={{ background: "#B2F0DC" }} className="rounded-xl p-3 text-center">
                <p style={{ color: "#0A5C46" }} className="text-lg font-medium">{listing.bedrooms === 0 ? "Studio" : listing.bedrooms}</p>
                <p style={{ color: "#1D9E75" }} className="text-xs mt-0.5">Bedrooms</p>
              </div>
            )}
            {listing.bathrooms !== null && (
              <div style={{ background: "#B2F0DC" }} className="rounded-xl p-3 text-center">
                <p style={{ color: "#0A5C46" }} className="text-lg font-medium">{listing.bathrooms}</p>
                <p style={{ color: "#1D9E75" }} className="text-xs mt-0.5">Bathrooms</p>
              </div>
            )}
            <div style={{ background: "#B2F0DC" }} className="rounded-xl p-3 text-center">
              <p style={{ color: "#0A5C46" }} className="text-lg font-medium capitalize">{listing.property_type}</p>
              <p style={{ color: "#1D9E75" }} className="text-xs mt-0.5">Type</p>
            </div>
          </div>

          {listing.description && (
            <div>
              <h2 style={{ color: "#0F7A5F" }} className="text-sm font-medium mb-2">Description</h2>
              <p style={{ color: "#2D7A5F" }} className="text-sm leading-relaxed">{listing.description}</p>
            </div>
          )}
        </div>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{ background: "#0F7A5F", color: "#7FEDD0" }}
          className="flex items-center justify-center gap-2 w-full rounded-2xl py-4 text-base font-medium"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
          </svg>
          Contact on WhatsApp
        </a>
        <p style={{ color: "#1D9E75" }} className="text-center text-xs mt-2">{listing.phone_number}</p>

      </div>
    </div>
  )
}
