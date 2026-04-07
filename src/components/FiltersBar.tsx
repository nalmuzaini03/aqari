"use client"
import { useRouter, usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"

type Props = {
  areas: string[]
  propertyTypes: string[]
  current: Record<string, string | string[]>
}

export default function FiltersBar({ areas, propertyTypes, current }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [areaOpen, setAreaOpen] = useState(false)
  const areaRef = useRef<HTMLDivElement>(null)

  const selectedAreas: string[] = Array.isArray(current.area)
    ? current.area
    : current.area
    ? [current.area as string]
    : []

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (areaRef.current && !areaRef.current.contains(e.target as Node)) {
        setAreaOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  function updateSingle(key: string, value: string) {
    const params = new URLSearchParams()
    Object.entries(current).forEach(([k, v]) => {
      if (k === key) return
      if (Array.isArray(v)) v.forEach(val => params.append(k, val))
      else if (v) params.set(k, v)
    })
    if (value) params.set(key, value)
    router.push(`${pathname}?${params.toString()}`)
  }

  function toggleArea(area: string) {
    const params = new URLSearchParams()
    Object.entries(current).forEach(([k, v]) => {
      if (k === "area") return
      if (Array.isArray(v)) v.forEach(val => params.append(k, val))
      else if (v) params.set(k, v)
    })
    const next = selectedAreas.includes(area)
      ? selectedAreas.filter(a => a !== area)
      : [...selectedAreas, area]
    next.forEach(a => params.append("area", a))
    router.push(`${pathname}?${params.toString()}`)
  }

  const selectClass = "text-sm border rounded-full px-3 py-1.5 font-medium cursor-pointer focus:outline-none"
  const selectStyle = { background: "#0D6B52", color: "#7FEDD0", borderColor: "#1D9E75" }

  return (
    <div style={{ background: "#0F7A5F" }} className="flex flex-wrap gap-2 p-4 sticky top-0 z-10 items-center justify-between">
      <div className="flex flex-wrap gap-2 items-center">

        {/* Listing type */}
        <select
          defaultValue={typeof current.listing_type === "string" ? current.listing_type : ""}
          onChange={e => updateSingle("listing_type", e.target.value)}
          style={selectStyle}
          className={selectClass}
        >
          <option value="">All types</option>
          <option value="rent">For rent</option>
          <option value="sale">For sale</option>
        </select>

        {/* Areas multi-select */}
        <div ref={areaRef} className="relative">
          <button
            onClick={() => setAreaOpen(!areaOpen)}
            style={selectStyle}
            className={`${selectClass} flex items-center gap-1.5`}
          >
            {selectedAreas.length === 0
              ? "All areas"
              : selectedAreas.length === 1
              ? selectedAreas[0]
              : `${selectedAreas.length} areas`}
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {areaOpen && (
            <div style={{ background: "#0D6B52", border: "1px solid #1D9E75" }} className="absolute top-full mt-1 left-0 rounded-xl shadow-lg z-50 w-56 max-h-64 overflow-y-auto">
              {selectedAreas.length > 0 && (
                <button
                  onClick={() => {
                    const params = new URLSearchParams()
                    Object.entries(current).forEach(([k, v]) => {
                      if (k === "area") return
                      if (Array.isArray(v)) v.forEach(val => params.append(k, val))
                      else if (v) params.set(k, v)
                    })
                    router.push(`${pathname}?${params.toString()}`)
                  }}
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
                    checked={selectedAreas.includes(area)}
                    onChange={() => toggleArea(area)}
                    className="accent-emerald-400"
                  />
                  {area}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Property type */}
        <select
          defaultValue={typeof current.property_type === "string" ? current.property_type : ""}
          onChange={e => updateSingle("property_type", e.target.value)}
          style={selectStyle}
          className={selectClass}
        >
          <option value="">Property type</option>
          {propertyTypes.map(t => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>

        {/* Bedrooms */}
        <select
          defaultValue={typeof current.bedrooms === "string" ? current.bedrooms : ""}
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

        {/* Max price */}
        <select
          defaultValue={typeof current.max_price === "string" ? current.max_price : ""}
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
