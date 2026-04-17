"use client"
import { APIProvider, Map, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps"
import { useState } from "react"
import { Listing } from "@/types/listing"
import { AREA_COORDINATES } from "@/lib/area-coordinates"
import Link from "next/link"
import { useLang } from "@/lib/language-context"
import { t } from "@/lib/translations"

type Props = {
  listings: Listing[]
}

export default function ListingsMap({ listings }: Props) {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const { lang } = useLang()
  const tr = t[lang]
  const isAr = lang === "ar"

  const listingsWithCoords = listings.filter(l =>
    (l.latitude && l.longitude) || AREA_COORDINATES[l.area]
  )

  const badgeBg = (type: string) =>
    type === "rent" ? "#FF385C" : type === "short_stay" ? "#7C3AED" : "#222"

  const priceDisplay = (listing: Listing) => {
    const price = listing.listing_type === "short_stay"
      ? (listing.price_per_night ?? listing.price)
      : listing.price
    return `${price.toLocaleString()} ${isAr ? "د.ك" : "KWD"}`
  }

  const perLabel = (listing: Listing) => {
    if (listing.listing_type === "rent") return isAr ? "/ شهر" : "/ month"
    if (listing.listing_type === "short_stay") return isAr ? "/ ليلة" : "/ night"
    return ""
  }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Map
        defaultCenter={{ lat: 29.3117, lng: 47.9817 }}
        defaultZoom={11}
        mapId="aqari-map"
        style={{ width: "100%", height: "100%" }}
        gestureHandling="greedy"
      >
        {listingsWithCoords.map(listing => {
          const coords = AREA_COORDINATES[listing.area]
          if (!coords && !listing.latitude) return null
          const offset = listing.latitude && listing.longitude
            ? { lat: listing.latitude, lng: listing.longitude }
            : {
                lat: coords.lat + (Math.random() - 0.5) * 0.008,
                lng: coords.lng + (Math.random() - 0.5) * 0.008,
              }
          const isSelected = selectedListing?.id === listing.id

          return (
            <AdvancedMarker
              key={listing.id}
              position={offset}
              onClick={() => setSelectedListing(listing)}
            >
              <div style={{
                background: isSelected ? "#222" : "#FF385C",
                color: "white",
                border: `2px solid ${isSelected ? "#222" : "#E00B41"}`,
                borderRadius: "20px",
                padding: "5px 12px",
                fontSize: "13px",
                fontWeight: 700,
                whiteSpace: "nowrap" as const,
                cursor: "pointer",
                boxShadow: isSelected ? "0 4px 12px rgba(0,0,0,0.25)" : "0 2px 8px rgba(255,56,92,0.3)",
                transform: isSelected ? "scale(1.1)" : "scale(1)",
                transition: "all 0.15s ease",
              }}>
                {priceDisplay(listing)}
              </div>
            </AdvancedMarker>
          )
        })}

        {selectedListing && (
          <InfoWindow
            position={{
              lat: AREA_COORDINATES[selectedListing.area]?.lat ?? 29.3117,
              lng: AREA_COORDINATES[selectedListing.area]?.lng ?? 47.9817,
            }}
            onCloseClick={() => setSelectedListing(null)}
          >
            <Link href={`/listings/${selectedListing.id}`} className="block" style={{ maxWidth: "220px", textDecoration: "none" }}>
              {selectedListing.photos && selectedListing.photos.length > 0 && (
                <img
                  src={selectedListing.photos[0]}
                  alt={selectedListing.title}
                  style={{ width: "100%", height: "130px", objectFit: "cover", borderRadius: "10px", marginBottom: "10px" }}
                />
              )}
              <div style={{ marginBottom: "4px" }}>
                <span style={{ background: badgeBg(selectedListing.listing_type), color: "white", fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px" }}>
                  {selectedListing.listing_type === "rent" ? tr.forRentBadge : selectedListing.listing_type === "short_stay" ? tr.shortStayBadge : tr.forSaleBadge}
                </span>
              </div>
              <p style={{ color: "#222", fontWeight: 700, fontSize: "15px", margin: "6px 0 2px" }}>
                {priceDisplay(selectedListing)}
                {perLabel(selectedListing) && <span style={{ fontWeight: 400, color: "#717171", fontSize: "12px" }}> {perLabel(selectedListing)}</span>}
              </p>
              <p style={{ color: "#222", fontSize: "13px", margin: "0 0 2px", fontWeight: 500 }}>{selectedListing.title}</p>
              <p style={{ color: "#717171", fontSize: "12px", margin: "0 0 10px" }}>{selectedListing.area}</p>
              <div style={{ background: "#FF385C", color: "white", padding: "8px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 700, textAlign: "center" }}>
                {isAr ? "عرض الإعلان ←" : "View listing →"}
              </div>
            </Link>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  )
}