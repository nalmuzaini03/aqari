"use client"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"
import FiltersModal from "./FiltersModal"

type Props = {
  areas: string[]
  propertyTypes: string[]
  selectedAreas: string[]
  currentListingType: string
  currentPropertyType: string
  currentBedrooms: string
  currentMaxPrice: string
  showMap: boolean
}

export default function FiltersBar({
  areas, propertyTypes, selectedAreas,
  currentListingType, currentPropertyType, currentBedrooms, currentMaxPrice, showMap,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [modalOpen, setModalOpen] = useState(false)

  const activeFilterCount = [
    currentListingType,
    currentPropertyType,
    currentBedrooms,
    currentMaxPrice,
    ...selectedAreas,
  ].filter(Boolean).length

  function toggleMap() {
    const params = new URLSearchParams()
    if (currentListingType) params.set("listing_type", currentListingType)
    if (currentPropertyType) params.set("property_type", currentPropertyType)
    if (currentBedrooms) params.set("bedrooms", currentBedrooms)
    if (currentMaxPrice) params.set("max_price", currentMaxPrice)
    selectedAreas.forEach(a => params.append("area", a))
    if (!showMap) params.set("view", "map")
    router.push(`${pathname}?${params.toString()}`)
  }

  const btnStyle = {
    background: "#1C3829",
    color: "#A8D5B5",
    border: "1px solid #2D6A4F",
    fontSize: "12px",
    letterSpacing: "0.3px",
    borderRadius: "4px",
    padding: "7px 14px",
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
    display: "flex",
    alignItems: "center",
    gap: "6px",
  }

  return (
    <>
      <div style={{ background: "#1C3829", borderBottom: "1px solid #2D6A4F" }} className="sticky top-0 z-10 px-4 py-3">
        <div className="flex items-center gap-2 flex-wrap">

          {/* Filters button */}
          <button onClick={() => setModalOpen(true)} style={{ ...btnStyle, position: "relative" }}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M11 12h2M9 16h6"/>
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span style={{ background: "#FAF8F4", color: "#1C3829", borderRadius: "50%", width: "18px", height: "18px", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600" }}>
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Active filter chips */}
          {currentListingType && (
            <span style={{ ...btnStyle, background: "#FAF8F4", color: "#1C3829", border: "1px solid #FAF8F4" }}>
              {currentListingType === "rent" ? "For rent" : "For sale"}
            </span>
          )}
          {currentPropertyType && (
            <span style={{ ...btnStyle, background: "#FAF8F4", color: "#1C3829", border: "1px solid #FAF8F4" }}>
              {currentPropertyType.charAt(0).toUpperCase() + currentPropertyType.slice(1)}
            </span>
          )}
          {selectedAreas.length > 0 && (
            <span style={{ ...btnStyle, background: "#FAF8F4", color: "#1C3829", border: "1px solid #FAF8F4" }}>
              {selectedAreas.length === 1 ? selectedAreas[0] : `${selectedAreas.length} areas`}
            </span>
          )}
          {currentMaxPrice && (
            <span style={{ ...btnStyle, background: "#FAF8F4", color: "#1C3829", border: "1px solid #FAF8F4" }}>
              Up to {Number(currentMaxPrice).toLocaleString()} KWD
            </span>
          )}

          {/* Right side buttons */}
          <div className="flex gap-2 ml-auto">
            <button onClick={toggleMap} style={btnStyle}>
              {showMap ? (
                <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>List</>
              ) : (
                <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>Map</>
              )}
            </button>
            <a href="/dashboard" style={btnStyle}>Dashboard</a>
            <a href="/login" style={{ background: "#FAF8F4", color: "#1C3829", border: "none", fontSize: "12px", letterSpacing: "0.3px", borderRadius: "4px", padding: "7px 14px", fontWeight: "500", whiteSpace: "nowrap" as const }}>+ Post</a>
          </div>

        </div>
      </div>

      {modalOpen && (
        <FiltersModal
          areas={areas}
          propertyTypes={propertyTypes}
          selectedAreas={selectedAreas}
          currentListingType={currentListingType}
          currentPropertyType={currentPropertyType}
          currentBedrooms={currentBedrooms}
          currentMaxPrice={currentMaxPrice}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  )
}
