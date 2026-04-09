"use client"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"
import FiltersModal from "./FiltersModal"
import { useLang } from "@/lib/language-context"
import { t } from "@/lib/translations"

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
  const { lang, setLang } = useLang()
  const tr = t[lang]
  const isAr = lang === "ar"

  const activeFilterCount = [
    currentListingType, currentPropertyType, currentBedrooms, currentMaxPrice, ...selectedAreas,
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

  const chipStyle = {
    background: "#FFF0F2", color: "#FF385C", border: "1.5px solid #FFD6DF",
    fontSize: "12px", borderRadius: "24px", padding: "5px 12px",
    whiteSpace: "nowrap" as const, fontWeight: 500,
  }

  const btnStyle = {
    background: "white", color: "#222", border: "1px solid #DDDDDD",
    fontSize: "13px", borderRadius: "24px", padding: "7px 16px",
    cursor: "pointer", whiteSpace: "nowrap" as const,
    display: "flex", alignItems: "center", gap: "6px", fontWeight: 500,
  }

  const listingTypeLabel = (type: string) => {
    if (type === "rent") return isAr ? "للإيجار" : "For rent"
    if (type === "sale") return isAr ? "للبيع" : "For sale"
    if (type === "short_stay") return isAr ? "إقامة قصيرة" : "Short stay"
    return type
  }

  return (
    <>
      <div style={{ background: "white", borderBottom: "1px solid #EBEBEB" }} className="sticky top-0 z-10 px-4 sm:px-6 py-3">
        <div className="flex items-center gap-2 flex-wrap">

          {/* Logo */}
          <a href="/" style={{ fontSize: "18px", fontWeight: 800, color: "#FF385C", letterSpacing: "-0.5px", marginRight: "8px", textDecoration: "none" }}>aqari</a>

          {/* Filters button */}
          <button onClick={() => setModalOpen(true)} style={{ ...btnStyle, position: "relative" }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M11 12h2M9 16h6"/>
            </svg>
            {tr.filters}
            {activeFilterCount > 0 && (
              <span style={{ background: "#FF385C", color: "white", borderRadius: "50%", width: "18px", height: "18px", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Active filter chips */}
          {currentListingType && <span style={chipStyle}>{listingTypeLabel(currentListingType)}</span>}
          {currentPropertyType && <span style={chipStyle}>{currentPropertyType.charAt(0).toUpperCase() + currentPropertyType.slice(1)}</span>}
          {selectedAreas.length > 0 && (
            <span style={chipStyle}>
              {selectedAreas.length === 1 ? selectedAreas[0] : `${selectedAreas.length} ${isAr ? "مناطق" : "areas"}`}
            </span>
          )}
          {currentMaxPrice && (
            <span style={chipStyle}>
              {isAr ? `حتى ${Number(currentMaxPrice).toLocaleString()} د.ك` : `Up to ${Number(currentMaxPrice).toLocaleString()} KWD`}
            </span>
          )}

          {/* Right side */}
          <div className="flex gap-2 ml-auto">

            {/* Language toggle */}
            <button
              onClick={() => setLang(isAr ? "en" : "ar")}
              style={btnStyle}
            >
              {isAr ? "English" : "العربية"}
            </button>

            <button onClick={toggleMap} style={btnStyle}>
              {showMap ? (
                <><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>{isAr ? "قائمة" : "List"}</>
              ) : (
                <><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>{isAr ? "خريطة" : "Map"}</>
              )}
            </button>

            <a href="/dashboard" style={btnStyle}>
              {isAr ? "لوحتي" : "Dashboard"}
            </a>

            <a href="/admin" style={btnStyle}>
              {isAr ? "الإدارة" : "Admin"}
            </a>

            <a href="/listings/new" style={{ background: "#FF385C", color: "white", border: "none", fontSize: "13px", borderRadius: "24px", padding: "7px 16px", fontWeight: 600, whiteSpace: "nowrap" as const, textDecoration: "none" }}>
              {isAr ? "+ نشر" : "+ Post"}
            </a>
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
