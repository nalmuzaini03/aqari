"use client"
import { useRouter, usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"

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
  const [areaOpen, setAreaOpen] = useState(false)
  const [priceOpen, setPriceOpen] = useState(false)
  const [localAreas, setLocalAreas] = useState<string[]>(selectedAreas)
  const [sliderValue, setSliderValue] = useState(currentMaxPrice ? Number(currentMaxPrice) : 5000)
  const areaRef = useRef<HTMLDivElement>(null)
  const priceRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent | TouchEvent) {
      if (areaRef.current && !areaRef.current.contains(e.target as Node)) setAreaOpen(false)
      if (priceRef.current && !priceRef.current.contains(e.target as Node)) setPriceOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    document.addEventListener("touchstart", handleClick)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("touchstart", handleClick)
    }
  }, [])

  function buildParams(overrides: Record<string, string | string[]>) {
    const params = new URLSearchParams()
    const all: Record<string, string | string[]> = {
      listing_type: currentListingType,
      property_type: currentPropertyType,
      bedrooms: currentBedrooms,
      max_price: currentMaxPrice,
      area: localAreas,
      ...(showMap ? { view: "map" } : {}),
      ...overrides,
    }
    Object.entries(all).forEach(([k, v]) => {
      if (!v || v.length === 0) return
      if (Array.isArray(v)) v.forEach(val => params.append(k, val))
      else params.set(k, v)
    })
    return params.toString()
  }

  function updateSingle(key: string, value: string) {
    router.push(`${pathname}?${buildParams({ [key]: value })}`)
  }

  function toggleArea(area: string) {
    const next = localAreas.includes(area) ? localAreas.filter(a => a !== area) : [...localAreas, area]
    setLocalAreas(next)
    const params = new URLSearchParams()
    if (currentListingType) params.set("listing_type", currentListingType)
    if (currentPropertyType) params.set("property_type", currentPropertyType)
    if (currentBedrooms) params.set("bedrooms", currentBedrooms)
    if (currentMaxPrice) params.set("max_price", currentMaxPrice)
    if (showMap) params.set("view", "map")
    next.forEach(a => params.append("area", a))
    router.push(`${pathname}?${params.toString()}`)
  }

  function clearAreas() {
    setLocalAreas([])
    const params = new URLSearchParams()
    if (currentListingType) params.set("listing_type", currentListingType)
    if (currentPropertyType) params.set("property_type", currentPropertyType)
    if (currentBedrooms) params.set("bedrooms", currentBedrooms)
    if (currentMaxPrice) params.set("max_price", currentMaxPrice)
    if (showMap) params.set("view", "map")
    router.push(`${pathname}?${params.toString()}`)
  }

  function applyPrice() {
    router.push(`${pathname}?${buildParams({ max_price: String(sliderValue) })}`)
    setPriceOpen(false)
  }

  function clearPrice() {
    setSliderValue(5000)
    router.push(`${pathname}?${buildParams({ max_price: "" })}`)
    setPriceOpen(false)
  }

  function toggleMap() {
    const params = new URLSearchParams()
    if (currentListingType) params.set("listing_type", currentListingType)
    if (currentPropertyType) params.set("property_type", currentPropertyType)
    if (currentBedrooms) params.set("bedrooms", currentBedrooms)
    if (currentMaxPrice) params.set("max_price", currentMaxPrice)
    localAreas.forEach(a => params.append("area", a))
    if (!showMap) params.set("view", "map")
    router.push(`${pathname}?${params.toString()}`)
  }

  const priceLabel = currentMaxPrice ? `Up to ${Number(currentMaxPrice).toLocaleString()} KWD` : "Max price"
  const btnStyle = { background: "#1C3829", color: "#A8D5B5", border: "1px solid #2D6A4F", fontSize: "12px", letterSpacing: "0.3px", borderRadius: "4px", padding: "7px 14px", cursor: "pointer", whiteSpace: "nowrap" as const }
  const selectStyle = { background: "#1C3829", color: "#A8D5B5", border: "1px solid #2D6A4F", fontSize: "12px", letterSpacing: "0.3px", borderRadius: "4px", padding: "7px 12px", cursor: "pointer", width: "100%" }

  return (
    <div style={{ background: "#1C3829", borderBottom: "1px solid #2D6A4F" }} className="sticky top-0 z-10 px-4 py-3">
      <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2">

        <select value={currentListingType} onChange={e => updateSingle("listing_type", e.target.value)} style={selectStyle}>
          <option value="">All types</option>
          <option value="rent">For rent</option>
          <option value="sale">For sale</option>
        </select>

        <select value={currentPropertyType} onChange={e => updateSingle("property_type", e.target.value)} style={selectStyle}>
          <option value="">Property type</option>
          {propertyTypes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
        </select>

        <select value={currentBedrooms} onChange={e => updateSingle("bedrooms", e.target.value)} style={selectStyle}>
          <option value="">Bedrooms</option>
          <option value="0">Studio</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4+</option>
        </select>

        {/* Areas */}
        <div ref={areaRef} className="relative">
          <button onClick={() => { setAreaOpen(!areaOpen); setPriceOpen(false) }} style={{ ...btnStyle, width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
            <span className="truncate">{localAreas.length === 0 ? "All areas" : localAreas.length === 1 ? localAreas[0] : `${localAreas.length} areas`}</span>
            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {areaOpen && (
            <div style={{ background: "#1C3829", border: "1px solid #2D6A4F", borderRadius: "6px" }} className="absolute top-full mt-1 left-0 shadow-xl z-50 w-56 max-h-64 overflow-y-auto">
              {localAreas.length > 0 && (
                <button onClick={clearAreas} style={{ color: "#A8D5B5", borderBottom: "1px solid #2D6A4F", fontSize: "12px" }} className="w-full text-left px-4 py-2">
                  Clear all areas
                </button>
              )}
              {areas.map(area => (
                <label key={area} style={{ color: "#A8D5B5", fontSize: "13px" }} className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:opacity-80">
                  <input type="checkbox" checked={localAreas.includes(area)} onChange={() => toggleArea(area)} />
                  {area}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price */}
        <div ref={priceRef} className="relative">
          <button onClick={() => { setPriceOpen(!priceOpen); setAreaOpen(false) }} style={{ ...btnStyle, width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
            <span className="truncate">{priceLabel}</span>
            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {priceOpen && (
            <div style={{ background: "#1C3829", border: "1px solid #2D6A4F", borderRadius: "6px" }} className="absolute top-full mt-1 left-0 shadow-xl z-50 w-72 p-5">
              <p style={{ color: "#A8D5B5", fontSize: "12px", letterSpacing: "0.5px" }} className="mb-1">MAX PRICE</p>
              <p style={{ fontFamily: "Georgia, serif", color: "#FAF8F4", fontSize: "24px" }} className="mb-4">{sliderValue.toLocaleString()} KWD</p>
              <input type="range" min={50} max={10000} step={50} value={sliderValue} onChange={e => setSliderValue(Number(e.target.value))} className="w-full" style={{ accentColor: "#A8D5B5" }} />
              <div className="flex justify-between mt-1 mb-4">
                <span style={{ color: "#6BA882", fontSize: "11px" }}>50 KWD</span>
                <span style={{ color: "#6BA882", fontSize: "11px" }}>10,000 KWD</span>
              </div>
              <div className="flex gap-2">
                <button onClick={clearPrice} style={{ color: "#A8D5B5", border: "1px solid #2D6A4F", borderRadius: "4px", fontSize: "12px" }} className="flex-1 py-2">Clear</button>
                <button onClick={applyPrice} style={{ background: "#2D6A4F", color: "#FAF8F4", borderRadius: "4px", fontSize: "12px", border: "none" }} className="flex-1 py-2 font-medium">Apply</button>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 col-span-3 sm:col-span-1">
          <button onClick={toggleMap} style={{ ...btnStyle, flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
            {showMap ? (
              <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg> List</>
            ) : (
              <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg> Map</>
            )}
          </button>
          <a href="/dashboard" style={{ ...btnStyle, flex: 1, textAlign: "center" as const }}>Dashboard</a>
          <a href="/login" style={{ background: "#FAF8F4", color: "#1C3829", border: "none", fontSize: "12px", letterSpacing: "0.3px", borderRadius: "4px", padding: "7px 14px", fontWeight: "500", whiteSpace: "nowrap" as const, flex: 1, textAlign: "center" as const }}>+ Post</a>
        </div>

      </div>
    </div>
  )
}
