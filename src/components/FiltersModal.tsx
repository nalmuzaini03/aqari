"use client"
import React, { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
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

const PROPERTY_LABELS: Record<string, { en: string; ar: string }> = {
  apartment: { en: "Apartment", ar: "شقة" },
  villa: { en: "Villa", ar: "فيلا" },
  floor: { en: "Floor", ar: "طابق" },
  building: { en: "Building", ar: "عمارة" },
  chalet: { en: "Chalet", ar: "شاليه" },
  office: { en: "Office", ar: "مكتب" },
  shop: { en: "Shop", ar: "محل" },
  land: { en: "Land", ar: "أرض" },
}

export default function FiltersModal({
  areas, propertyTypes, selectedAreas,
  currentListingType, currentPropertyType, currentBedrooms, currentMaxPrice, onClose,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const { lang } = useLang()
  const tr = t[lang]
  const isAr = lang === "ar"

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
    setListingType(""); setPropertyType(""); setLocalAreas([]); setBedrooms(-1); setMaxPrice(-1)
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
    if (val >= priceMax) return isForSale ? (isAr ? "+٢،٠٠٠،٠٠٠ د.ك" : "2,000,000+ KWD") : (isAr ? "+١٠،٠٠٠ د.ك" : "10,000+ KWD")
    return isAr ? `${val.toLocaleString()} د.ك` : `${val.toLocaleString()} KWD`
  }

  const sectionLabel = { fontSize: "11px", color: "#717171", letterSpacing: "1px", marginBottom: "12px", fontWeight: 600 }

  const listingTypes = [
    { val: "", label: isAr ? "الكل" : "All" },
    { val: "rent", label: isAr ? "للإيجار" : "For rent" },
    { val: "short_stay", label: isAr ? "إقامة قصيرة" : "Short stay" },
    { val: "sale", label: isAr ? "للبيع" : "For sale" },
  ]

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: "white", borderRadius: "16px 16px 0 0", width: "100%", maxWidth: "600px", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid #EBEBEB" }}>
          <span style={{ fontSize: "16px", fontWeight: 700, color: "#222" }}>{tr.filters}</span>
          <button onClick={onClose} style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#F7F7F7", border: "1px solid #EBEBEB", cursor: "pointer", fontSize: "18px", color: "#222", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>

        {/* Body */}
        <div style={{ overflowY: "auto", padding: "24px", flex: 1 }}>

          {/* Listing type */}
          <div style={{ marginBottom: "28px", paddingBottom: "28px", borderBottom: "1px solid #EBEBEB" }}>
            <p style={sectionLabel}>{tr.listingType}</p>
            <div style={{ display: "flex", gap: "8px" }}>
              {listingTypes.map(lt => (
                <button key={lt.val} onClick={() => { setListingType(lt.val); setMaxPrice(-1) }}
                  style={{ flex: 1, padding: "10px", borderRadius: "8px", border: listingType === lt.val ? "2px solid #222" : "1px solid #DDDDDD", background: "white", color: "#222", fontSize: "13px", cursor: "pointer", fontWeight: listingType === lt.val ? 700 : 400 }}>
                  {lt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Property type */}
          <div style={{ marginBottom: "28px", paddingBottom: "28px", borderBottom: "1px solid #EBEBEB" }}>
            <p style={sectionLabel}>{tr.propertyType}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
              {propertyTypes.map(pt => (
                <button key={pt} onClick={() => setPropertyType(propertyType === pt ? "" : pt)}
                  style={{ border: propertyType === pt ? "2px solid #222" : "1px solid #DDDDDD", borderRadius: "8px", padding: "12px 6px", background: "white", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", color: propertyType === pt ? "#222" : "#717171" }}>
                  {PROPERTY_ICONS[pt]}
                  <span style={{ fontSize: "11px", fontWeight: propertyType === pt ? 600 : 400 }}>
                    {isAr ? (PROPERTY_LABELS[pt]?.ar ?? pt) : (PROPERTY_LABELS[pt]?.en ?? pt)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Bedrooms */}
          <div style={{ marginBottom: "28px", paddingBottom: "28px", borderBottom: "1px solid #EBEBEB" }}>
            <p style={sectionLabel}>{tr.bedrooms}</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "14px", color: "#222", fontWeight: 500 }}>{tr.bedrooms}</p>
                <p style={{ fontSize: "12px", color: "#717171", marginTop: "2px" }}>{tr.minimum}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <button onClick={() => setBedrooms(b => Math.max(-1, b - 1))}
                  style={{ width: "32px", height: "32px", borderRadius: "50%", border: `1.5px solid ${bedrooms <= -1 ? "#DDDDDD" : "#222"}`, background: "transparent", cursor: bedrooms <= -1 ? "default" : "pointer", color: bedrooms <= -1 ? "#DDDDDD" : "#222", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                <span style={{ fontSize: "16px", fontWeight: 600, color: "#222", minWidth: "40px", textAlign: "center" }}>
                  {bedrooms === -1 ? (isAr ? "أي" : "Any") : bedrooms === 0 ? (isAr ? "استوديو" : "Studio") : bedrooms}
                </span>
                <button onClick={() => setBedrooms(b => Math.min(6, b + 1))}
                  style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1.5px solid #222", background: "transparent", cursor: "pointer", color: "#222", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
              </div>
            </div>
          </div>

          {/* Price */}
          <div style={{ marginBottom: "28px", paddingBottom: "28px", borderBottom: "1px solid #EBEBEB" }}>
            <p style={sectionLabel}>{tr.maxPrice}</p>
            <p style={{ fontSize: "22px", fontWeight: 700, color: "#222", marginBottom: "16px" }}>
              {maxPrice === -1 ? tr.anyPrice : formatPrice(sliderValue)}
            </p>
            <input type="range" min={priceMin} max={priceMax} step={priceStep} value={sliderValue}
              onChange={e => setMaxPrice(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#FF385C" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
              <span style={{ fontSize: "11px", color: "#717171" }}>{isAr ? `${priceMin.toLocaleString()} د.ك` : `${priceMin.toLocaleString()} KWD`}</span>
              <span style={{ fontSize: "11px", color: "#717171" }}>{isForSale ? (isAr ? "+٢،٠٠٠،٠٠٠ د.ك" : "2,000,000+ KWD") : (isAr ? "+١٠،٠٠٠ د.ك" : "10,000+ KWD")}</span>
            </div>
          </div>

          {/* Areas */}
          <div>
            <p style={sectionLabel}>{tr.areaLabel}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {areas.map(area => (
                <button key={area} onClick={() => toggleArea(area)}
                  style={{ border: localAreas.includes(area) ? "2px solid #222" : "1px solid #DDDDDD", borderRadius: "24px", padding: "6px 14px", fontSize: "13px", color: localAreas.includes(area) ? "#222" : "#717171", background: "white", cursor: "pointer", fontWeight: localAreas.includes(area) ? 600 : 400 }}>
                  {area}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #EBEBEB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={clearAll} style={{ fontSize: "13px", color: "#222", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontWeight: 600 }}>
            {tr.clearAll}
          </button>
          <button onClick={apply} style={{ background: "#FF385C", color: "white", border: "none", borderRadius: "8px", padding: "12px 28px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
            {tr.showListings}
          </button>
        </div>

      </div>
    </div>
  )
}
