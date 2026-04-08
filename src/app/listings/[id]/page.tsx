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
    <div style={{ background: "white", minHeight: "100vh" }}>
      <ViewTracker listingId={listing.id} />

      {/* Nav */}
      <nav style={{ background: "white", borderBottom: "1px solid #EBEBEB" }} className="flex items-center justify-between px-6 sm:px-10 py-4">
        <Link href="/" style={{ fontSize: "22px", fontWeight: 800, color: "#FF385C", letterSpacing: "-0.5px", textDecoration: "none" }}>aqari</Link>
        <Link href="/listings" style={{ fontSize: "14px", color: "#222", border: "1px solid #DDDDDD", padding: "8px 20px", borderRadius: "24px", fontWeight: 500 }}>Browse listings</Link>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Back + Delete */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/listings" style={{ color: "#717171", fontSize: "14px", textDecoration: "none" }} className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to listings
          </Link>
          <DeleteButton listingId={listing.id} />
        </div>

        {/* Photos */}
        {listing.photos && listing.photos.length > 0 ? (
          <div className={`grid gap-2 mb-6 overflow-hidden ${listing.photos.length === 1 ? "grid-cols-1" : "grid-cols-2"}`} style={{ borderRadius: "16px" }}>
            {listing.photos.slice(0, 6).map((url: string, i: number) => (
              <img key={i} src={url} alt={listing.title} className={`w-full object-cover ${listing.photos.length === 1 ? "h-80" : "h-52"}`} />
            ))}
          </div>
        ) : (
          <div style={{ background: "#F7F7F7", border: "1px solid #EBEBEB", borderRadius: "16px" }} className="w-full h-56 flex items-center justify-center mb-6">
            <svg className="w-12 h-12" style={{ color: "#DDDDDD" }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            </svg>
          </div>
        )}

        {/* Main info card */}
        <div style={{ border: "1px solid #EBEBEB", borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>

          {/* Badges + title + price */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span style={{ background: listing.listing_type === "rent" ? "#FF385C" : "#222", color: "white", fontSize: "11px", letterSpacing: "0.5px", fontWeight: 600 }} className="px-2 py-0.5 rounded-md uppercase">
                  {listing.listing_type === "rent" ? "For rent" : "For sale"}
                </span>
                {listing.is_verified && (
                  <span style={{ background: "white", color: "#222", fontSize: "11px", fontWeight: 600, border: "1px solid #EBEBEB" }} className="px-2 py-0.5 rounded-md">
                    ✓ Verified
                  </span>
                )}
              </div>
              <h1 style={{ fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 700, color: "#222", lineHeight: 1.2 }}>{listing.title}</h1>
              <p style={{ fontSize: "14px", color: "#717171" }} className="mt-2 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"/>
                </svg>
                {listing.area}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p style={{ fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 700, color: "#222" }}>{listing.price.toLocaleString()} KWD</p>
              {listing.listing_type === "rent" && <p style={{ fontSize: "13px", color: "#717171" }}>/ month</p>}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {listing.bedrooms !== null && (
              <div style={{ background: "#F7F7F7", borderRadius: "12px", border: "1px solid #EBEBEB" }} className="p-3 text-center">
                <p style={{ fontSize: "20px", fontWeight: 700, color: "#222" }}>{listing.bedrooms === 0 ? "Studio" : listing.bedrooms}</p>
                <p style={{ fontSize: "11px", color: "#717171", letterSpacing: "0.5px" }} className="mt-0.5">BEDROOMS</p>
              </div>
            )}
            {listing.bathrooms !== null && (
              <div style={{ background: "#F7F7F7", borderRadius: "12px", border: "1px solid #EBEBEB" }} className="p-3 text-center">
                <p style={{ fontSize: "20px", fontWeight: 700, color: "#222" }}>{listing.bathrooms}</p>
                <p style={{ fontSize: "11px", color: "#717171", letterSpacing: "0.5px" }} className="mt-0.5">BATHROOMS</p>
              </div>
            )}
            <div style={{ background: "#F7F7F7", borderRadius: "12px", border: "1px solid #EBEBEB" }} className="p-3 text-center">
              <p style={{ fontSize: "20px", fontWeight: 700, color: "#222" }} className="capitalize">{listing.property_type}</p>
              <p style={{ fontSize: "11px", color: "#717171", letterSpacing: "0.5px" }} className="mt-0.5">TYPE</p>
            </div>
          </div>

          {/* Description */}
          {listing.description && (
            <div style={{ borderTop: "1px solid #EBEBEB" }} className="pt-5">
              <p style={{ fontSize: "11px", color: "#717171", letterSpacing: "0.5px", fontWeight: 600 }} className="mb-2">DESCRIPTION</p>
              <p style={{ fontSize: "15px", color: "#222", lineHeight: 1.7 }}>{listing.description}</p>
            </div>
          )}
        </div>

        <WhatsAppButton listingId={listing.id} whatsappLink={whatsappLink} phoneNumber={listing.phone_number} />
      </div>
    </div>
  )
}
