import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import Link from "next/link"
import DeleteButton from "@/components/DeleteButton"
import ViewTracker from "@/components/ViewTracker"
import WhatsAppButton from "@/components/WhatsAppButton"

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: listing, error } = await supabase.from("property_listings").select("*").eq("id", id).single()
  if (error || !listing) return notFound()

  const whatsappNumber = listing.phone_number.replace(/\D/g, "")
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hi, I'm interested in your listing: ${listing.title}`

  return (
    <div style={{ background: "#FAF8F4", minHeight: "100vh" }}>
      <ViewTracker listingId={listing.id} />
      <nav style={{ background: "#FAF8F4", borderBottom: "1px solid #E8E0D0" }} className="flex items-center justify-between px-6 sm:px-12 py-5">
        <Link href="/" style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: "#1C3829", letterSpacing: "3px" }}>
          AQ<span style={{ color: "#2D6A4F" }}>A</span>RI
        </Link>
        <Link href="/listings" style={{ fontSize: "13px", color: "#6B5F50" }}>Browse listings</Link>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/listings" style={{ color: "#8C7B65", fontSize: "13px" }} className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to listings
          </Link>
          <DeleteButton listingId={listing.id} />
        </div>

        {listing.photos && listing.photos.length > 0 ? (
          <div className={`grid gap-2 rounded overflow-hidden mb-6 ${listing.photos.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
            {listing.photos.slice(0, 6).map((url: string, i: number) => (
              <img key={i} src={url} alt={listing.title} className={`w-full object-cover ${listing.photos.length === 1 ? "h-72" : "h-48"}`} />
            ))}
          </div>
        ) : (
          <div style={{ background: "#F2EDE4", border: "1px solid #E8E0D0" }} className="w-full h-56 rounded flex items-center justify-center mb-6">
            <svg className="w-12 h-12" style={{ color: "#D4C9B5" }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            </svg>
          </div>
        )}

        <div style={{ background: "#FAF8F4", border: "1px solid #E8E0D0", borderRadius: "8px" }} className="p-6 mb-4">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span style={{ background: "#1C3829", color: "#A8D5B5", fontSize: "11px", letterSpacing: "0.5px" }} className="px-2 py-0.5 rounded uppercase font-medium">
                  {listing.listing_type === "rent" ? "For rent" : "For sale"}
                </span>
                {listing.is_verified && (
                  <span style={{ background: "#F2EDE4", color: "#2D6A4F", fontSize: "11px", border: "1px solid #E8E0D0" }} className="px-2 py-0.5 rounded font-medium">
                    Verified
                  </span>
                )}
              </div>
              <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(20px, 3vw, 28px)", color: "#1C3829", fontWeight: "400" }}>{listing.title}</h1>
              <p style={{ fontSize: "13px", color: "#8C7B65" }} className="mt-2 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"/>
                </svg>
                {listing.area}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p style={{ fontFamily: "Georgia, serif", fontSize: "clamp(20px, 3vw, 28px)", color: "#1C3829", fontWeight: "400" }}>{listing.price.toLocaleString()} KWD</p>
              {listing.listing_type === "rent" && <p style={{ fontSize: "13px", color: "#8C7B65" }}>/ month</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {listing.bedrooms !== null && (
              <div style={{ background: "#F2EDE4", border: "1px solid #E8E0D0", borderRadius: "4px" }} className="p-3 text-center">
                <p style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: "#1C3829" }}>{listing.bedrooms === 0 ? "Studio" : listing.bedrooms}</p>
                <p style={{ fontSize: "11px", color: "#8C7B65", letterSpacing: "0.5px" }} className="mt-0.5">BEDROOMS</p>
              </div>
            )}
            {listing.bathrooms !== null && (
              <div style={{ background: "#F2EDE4", border: "1px solid #E8E0D0", borderRadius: "4px" }} className="p-3 text-center">
                <p style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: "#1C3829" }}>{listing.bathrooms}</p>
                <p style={{ fontSize: "11px", color: "#8C7B65", letterSpacing: "0.5px" }} className="mt-0.5">BATHROOMS</p>
              </div>
            )}
            <div style={{ background: "#F2EDE4", border: "1px solid #E8E0D0", borderRadius: "4px" }} className="p-3 text-center">
              <p style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: "#1C3829" }} className="capitalize">{listing.property_type}</p>
              <p style={{ fontSize: "11px", color: "#8C7B65", letterSpacing: "0.5px" }} className="mt-0.5">TYPE</p>
            </div>
          </div>

          {listing.description && (
            <div style={{ borderTop: "1px solid #E8E0D0" }} className="pt-5">
              <p style={{ fontSize: "11px", color: "#8C7B65", letterSpacing: "0.5px" }} className="mb-2">DESCRIPTION</p>
              <p style={{ fontSize: "14px", color: "#6B5F50", lineHeight: "1.7" }}>{listing.description}</p>
            </div>
          )}
        </div>

        <WhatsAppButton listingId={listing.id} whatsappLink={whatsappLink} phoneNumber={listing.phone_number} />
      </div>
    </div>
  )
}
