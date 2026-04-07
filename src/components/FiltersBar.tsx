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
}

export default function FiltersBar({
  areas,
  propertyTypes,
  selectedAreas,
  currentListingType,
  currentPropertyType,
  currentBedrooms,
  currentMaxPrice,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [areaOpen, setAreaOpen] = useState(false)
  const [localAreas, setLocalAreas] = useState<string[]>(selectedAreas)
  const areaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (areaRef.current && !areaRef.current.contains(e.target as Node)) {
        setAreaOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  function buildParams(overrides: Record<string, string | string[]>) {
    const params = new URLSearchParams()
    const all: Record<string, string | string[]> = {
      listing_type: currentListingType,
      property_type: currentPropertyType,
      bedrooms: currentBedrooms,
      max_price: currentMaxPrice,
      area: localAreas,
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
    const next = localAreas.includes(area)
      ? localAreas.filter(a => a !== area)
      : [...localAreas, area]
    setLocalAreas(next)
    const params = new URLSearchParams()
    if (currentListingType) params.set("listing_type", currentListingType)
    if (currentPropertyType) params.set("property_type", currentPropertyType)
    if (currentBedrooms) params.set("bedrooms", currentBedrooms)
    if (currentMaxPrice) params.set("max_price", currentMaxPrice)
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
    router.push(`${pathname}?${params.toString()}`)
  }

  const selectStyle = { background: "#0D6B52", color: "#7FEDD0", borderColor: "#1D9E75" }
  const selectClass = "text-sm border rounded-full px-3 py-1.5 font-medium cursor-pointer focus:outline-none"

  return (
    <div style={{ background: "#0F7A5F" }} className="flex flex-wrap gap-2 p-4 sticky top-0 z-10 items-center justify-between">
      <div className="flex flex-wrap gap-2 items-center">

        <select
          value={currentListingType}
          onChange={e => updateSingle("listing_type", e.target.value)}
          style={selectStyle}
          className={selectClass}
        >
          <option value="">All types</option>
          <option value="rent">For rent</option>
          <option value="sale">For sale</option>
        </select>

        <div ref={areaRef} className="relative">
          <button
            onClick={() => setAreaOpen(!areaOpen)}
            style={selectStyle}
            className={`${selectClass} flex items-center gap-1.5`}
          >
            {localAreas.length === 0
              ? "All areas"
              : localAreas.length === 1
              ? localAreas[0]
              : `${localAreas.length} areas`}
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {areaOpen && (
            <div style={{ background: "#0D6B52", border: "1px solid #1D9E75" }} className="absolute top-full mt-1 left-0 rounded-xl shadow-lg z-50 w-56 max-h-64 overflow-y-auto">
              {localAreas.length > 0 && (
                <button
                  onClick={clearAreas}
                  style={{ color: "#7FEDD0", borderBottom: "1px solid #1D9E75" }}
                  className="w-full text-left px-4 py-2 text-xs"
                >
                  Clear all areas
                </button>
              )}
              {areas.map(area => (
                <label
                  key={area}
                  style={{ color: "#7FEDD0" }}
                  className="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer hover:opacity-80"
                >
                  <input
                    type="checkbox"
                    checked={localAreas.includes(area)}
                    onChange={() => toggleArea(area)}
                    className="accent-emerald-400"
                  />
                  {area}
                </label>
              ))}
            </div>
          )}
        </div>

        <select
          value={currentPropertyType}
          onChange={e => updateSingle("property_type", e.target.value)}
          style={selectStyle}
          className={selectClass}
        >
          <option value="">Property type</option>
          {propertyTypes.map(t => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>

        <select
          value={currentBedrooms}
          onChange={e => updateSingle("bedrooms", e.target.value)}
          style={selectStyle}
          className={selectClass}
        >
          <option value="">Bedrooms</option>
          <option value="0">Studio</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4+</option>
        </select>

        <select
          value={currentMaxPrice}
          onChange={e => updateSingle("max_price", e.target.value)}
          style={selectStyle}
          className={selectClass}
        >
          <option value="">Max price</option>
          <option value="200">200 KWD</option>
          <option value="400">400 KWD</option>
          <option value="700">700 KWD</option>
          <option value="1000">1,000 KWD</option>
          <option value="5000">5,000 KWD</option>
          <option value="50000">50,000 KWD</option>
        </select>

      </div>

      <a
        href="/login"
        style={{ background: "#7FEDD0", color: "#0A5C46" }}
        className="text-sm font-medium px-4 py-1.5 rounded-full"
      >
        + Post a listing
      </a>
    </div>
  )
}