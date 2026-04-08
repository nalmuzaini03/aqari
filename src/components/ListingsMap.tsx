"use client"
import { APIProvider, Map, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps"
import { useState } from "react"
import { Listing } from "@/types/listing"
import { AREA_COORDINATES } from "@/lib/area-coordinates"
import Link from "next/link"

type Props = {
  listings: Listing[]
}

export default function ListingsMap({ listings }: Props) {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)

  const listingsWithCoords = listings.filter(l => AREA_COORDINATES[l.area])

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
          const offset = {
            lat: coords.lat + (Math.random() - 0.5) * 0.008,
            lng: coords.lng + (Math.random() - 0.5) * 0.008,
          }

          return (
            <AdvancedMarker
              key={listing.id}
              position={offset}
              onClick={() => setSelectedListing(listing)}
            >
              <div
                style={{
                  background: selectedListing?.id === listing.id ? "#0A5C46" : "#0F7A5F",
                  color: "#7FEDD0",
                  border: "2px solid #7FEDD0",
                  borderRadius: "20px",
                  padding: "4px 10px",
                  fontSize: "13px",
                  fontWeight: "600",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  transform: selectedListing?.id === listing.id ? "scale(1.1)" : "scale(1)",
                  transition: "all 0.15s ease",
                }}
              >
                {listing.price.toLocaleString()} KWD
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
                  style={{ width: "100%", height: "130px", objectFit: "cover", borderRadius: "8px", marginBottom: "8px" }}
                />
              )}
              <p style={{ color: "#0A5C46", fontWeight: "600", fontSize: "14px", margin: "0 0 2px" }}>
                {selectedListing.price.toLocaleString()} KWD
                {selectedListing.listing_type === "rent" && <span style={{ fontWeight: "400", color: "#1D9E75", fontSize: "12px" }}> / month</span>}
              </p>
              <p style={{ color: "#0F7A5F", fontSize: "13px", margin: "0 0 4px" }}>{selectedListing.title}</p>
              <p style={{ color: "#1D9E75", fontSize: "12px", margin: "0" }}>{selectedListing.area}</p>
              <div style={{ marginTop: "8px", background: "#0F7A5F", color: "#7FEDD0", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", textAlign: "center" }}>
                View listing →
              </div>
            </Link>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  )
}
