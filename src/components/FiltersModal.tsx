"use client"
import React, { useState } from "react"
import { useRouter, usePathname } from "next/navigation"

type Props = {
  areas: string[]
  propertyTypes: string[]
  selectedAreas: string[]
  currentListingType: string
  currentPropertyType: string
  currentBedrooms: string
  currentMaxPrice: string
  onClose: () => void
}

const PROPERTY_ICONS: Record<string, React.ReactElement> = {
  apartment: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10"/></svg>,
  villa: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M4 21V7l8-4 8 4v14M9 21v-6h6v6"/></svg>,
  floor: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path strokeLinecap="round" d="M3 9h18M3 15h18"/></svg>,
  building: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2M5 21H3"/></svg>,
  chalet: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>,
  office: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a1 1 0 00-1 1v10a1 1 0 001 1h16a1 1 0 001-1V8a1 1 0 00-1-1z"/><path strokeLinecap="round" strokeLinejoin="round" d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>,
  shop: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>,
  land: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>,
}

export default function FiltersModal({
  areas, propertyTypes, selectedAreas,
  currentListingType, currentPropertyType, currentBedrooms, currentMaxPrice,
  onClose,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [listingType, setListingType] = useState(currentListingType)
  const [propertyType, setPropertyType] = useState(currentPropertyType)
  const [localAreas, setLocalAreas] = useState<string[]>(selectedAreas)
  const [bedrooms, setBedrooms] = useState(currentBedrooms ? Number(currentBedrooms) : -1)
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice ? Number(currentMaxPrice) : -1)

  const isForSale = listingType === "sale"
  const priceMin = isForSale ? 10000 : 50
  const priceMax = isForSale ? 2000000 : 10000
  const priceStep = isForSale ? 10000 : 50
  const sliderValue = maxPrice === -1 ? priceMax : Math.min(maxPrice, priceMax)

  function toggleArea(area: string) {
    setLocalAreas(prev => prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area])
  }

  function clearAll() {
    setListingType("")
    setPropertyType("")
    setLocalAreas([])
    setBedrooms(-1)
    setMaxPrice(-1)
  }

  function apply() {
    const params = new URLSearchParams()
    if (listingType) params.set("listing_type", listingType)
    if (propertyType) params.set("property_type", propertyType)
    if (bedrooms >= 0) params.set("bedrooms", String(bedrooms))
    if (maxPrice !== -1 && maxPrice < priceMax) params.set("max_price", String(maxPrice))
    localAreas.forEach(a => params.append("area", a))
    router.push(`${pathname}?${params.toString()}`)
    onClose()
  }

  const formatPrice = (val: number) => {
    if (val >= priceMax) return isForSale ? "2,000,000+ KWD" : "10,000+ KWD"
    return `${val.toLocaleString()} KWD`
  }

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: "#FAF8F4", borderRadius: "12px 12px 0 0", width: "100%", maxWidth: "600px", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid #E8E0D0" }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "18px", color: "#1C3829" }}>Filters</span>
          <button onClick={onClose} style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#F2EDE4", border: "none", cursor: "pointer", fontSize: "18px", color: "#6B5F50", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>

        {/* Body */}
        <div style={{ overflowY: "auto", padding: "24px", flex: 1 }}>

          {/* Listing type */}
          <div style={{ marginBottom: "28px" }}>
            <p style={{ fontSize: "11px", color: "#8C7B65", letterSpacing: "1px", marginBottom: "12px" }}>LISTING TYPE</p>
            <div style={{ display: "flex", gap: "8px" }}>
              {[{ val: "", label: "All" }, { val: "rent", label: "For rent" }, { val: "sale", label: "For sale" }].map(t => (
                <button
                  key={t.val}
                  onClick={() => { setListingType(t.val); setMaxPrice(-1) }}
                  style={{ flex: 1, padding: "10px", borderRadius: "6px", border: listingType === t.val ? "1.5px solid #1C3829" : "1px solid #E8E0D0", background: listingType === t.val ? "#F2EDE4" : "#FAF8F4", color: "#1C3829", fontSize: "13px", cursor: "pointer", fontWeight: listingType === t.val ? "500" : "400" }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Property type */}
          <div style={{ marginBottom: "28px" }}>
            <p style={{ fontSize: "11px", color: "#8C7B65", letterSpacing: "1px", marginBottom: "12px" }}>PROPERTY TYPE</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
              {propertyTypes.map(t => (
                <button
                  key={t}
                  onClick={() => setPropertyType(propertyType === t ? "" : t)}
                  style={{ border: propertyType === t ? "1.5px solid #1C3829" : "1px solid #E8E0D0", borderRadius: "6px", padding: "12px 6px", background: propertyType === t ? "#F2EDE4" : "#FAF8F4", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", color: propertyType === t ? "#1C3829" : "#6B5F50" }}
                >
                  {PROPERTY_ICONS[t]}
                  <span style={{ fontSize: "11px" }}>{t.charAt(0).toUpperCase() + t.slice(1)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bedrooms */}
          <div style={{ marginBottom: "28px" }}>
            <p style={{ fontSize: "11px", color: "#8C7B65", letterSpacing: "1px", marginBottom: "12px" }}>BEDROOMS</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0" }}>
              <div>
                <p style={{ fontSize: "14px", color: "#1C3829" }}>Bedrooms</p>
                <p style={{ fontSize: "12px", color: "#8C7B65", marginTop: "2px" }}>Minimum number</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <button
                  onClick={() => setBedrooms(b => Math.max(-1, b - 1))}
                  style={{ width: "32px", height: "32px", borderRadius: "50%", border: `1.5px solid ${bedrooms <= -1 ? "#E8E0D0" : "#8C7B65"}`, background: "transparent", cursor: bedrooms <= -1 ? "default" : "pointer", color: bedrooms <= -1 ? "#D4C9B5" : "#6B5F50", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}
                >−</button>
                <span style={{ fontFamily: "Georgia, serif", fontSize: "16px", color: "#1C3829", minWidth: "32px", textAlign: "center" }}>
                  {bedrooms === -1 ? "Any" : bedrooms === 0 ? "Studio" : bedrooms}
                </span>
                <button
                  onClick={() => setBedrooms(b => Math.min(6, b + 1))}
                  style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1.5px solid #8C7B65", background: "transparent", cursor: "pointer", color: "#6B5F50", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}
                >+</button>
              </div>
            </div>
          </div>

          {/* Price */}
          <div style={{ marginBottom: "28px" }}>
            <p style={{ fontSize: "11px", color: "#8C7B65", letterSpacing: "1px", marginBottom: "12px" }}>MAX PRICE</p>
            <p style={{ fontFamily: "Georgia, serif", fontSize: "24px", color: "#1C3829", marginBottom: "12px" }}>
              {maxPrice === -1 ? "Any price" : formatPrice(sliderValue)}
            </p>
            <input
              type="range"
              min={priceMin}
              max={priceMax}
              step={priceStep}
              value={sliderValue}
              onChange={e => setMaxPrice(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#1C3829" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
              <span style={{ fontSize: "11px", color: "#8C7B65" }}>{priceMin.toLocaleString()} KWD</span>
              <span style={{ fontSize: "11px", color: "#8C7B65" }}>{isForSale ? "2,000,000+ KWD" : "10,000+ KWD"}</span>
            </div>
          </div>

          {/* Areas */}
          <div>
            <p style={{ fontSize: "11px", color: "#8C7B65", letterSpacing: "1px", marginBottom: "12px" }}>AREA</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {areas.map(area => (
                <button
                  key={area}
                  onClick={() => toggleArea(area)}
                  style={{ border: localAreas.includes(area) ? "1.5px solid #1C3829" : "1px solid #E8E0D0", borderRadius: "4px", padding: "6px 12px", fontSize: "12px", color: localAreas.includes(area) ? "#1C3829" : "#6B5F50", background: localAreas.includes(area) ? "#F2EDE4" : "#FAF8F4", cursor: "pointer", fontWeight: localAreas.includes(area) ? "500" : "400" }}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #E8E0D0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={clearAll} style={{ fontSize: "13px", color: "#8C7B65", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
            Clear all
          </button>
          <button onClick={apply} style={{ background: "#1C3829", color: "#FAF8F4", border: "none", borderRadius: "4px", padding: "10px 28px", fontSize: "13px", fontWeight: "500", cursor: "pointer", letterSpacing: "0.3px" }}>
            Show listings
          </button>
        </div>

      </div>
    </div>
  )
}
