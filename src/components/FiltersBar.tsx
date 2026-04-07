"use client"
import { useRouter, usePathname } from "next/navigation"

type Props = {
  areas: string[]
  propertyTypes: string[]
  current: { [key: string]: string | undefined }
}

export default function FiltersBar({ areas, propertyTypes, current }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  function update(key: string, value: string) {
    const params = new URLSearchParams(current as Record<string, string>)
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-white border-b border-gray-100 sticky top-0 z-10 items-center justify-between">
      <div className="flex flex-wrap gap-2">
        <select
          defaultValue={current.listing_type ?? ""}
          onChange={e => update("listing_type", e.target.value)}
          className="text-sm border rounded-full px-3 py-1.5 bg-gray-50"
        >
          <option value="">All types</option>
          <option value="rent">For rent</option>
          <option value="sale">For sale</option>
        </select>

        <select
          defaultValue={current.area ?? ""}
          onChange={e => update("area", e.target.value)}
          className="text-sm border rounded-full px-3 py-1.5 bg-gray-50"
        >
          <option value="">All areas</option>
          {areas.map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>

        <select
          defaultValue={current.property_type ?? ""}
          onChange={e => update("property_type", e.target.value)}
          className="text-sm border rounded-full px-3 py-1.5 bg-gray-50"
        >
          <option value="">Property type</option>
          {propertyTypes.map(t => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>

        <select
          defaultValue={current.bedrooms ?? ""}
          onChange={e => update("bedrooms", e.target.value)}
          className="text-sm border rounded-full px-3 py-1.5 bg-gray-50"
        >
          <option value="">Bedrooms</option>
          <option value="0">Studio</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4+</option>
        </select>

        <select
          defaultValue={current.max_price ?? ""}
          onChange={e => update("max_price", e.target.value)}
          className="text-sm border rounded-full px-3 py-1.5 bg-gray-50"
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
        className="text-sm bg-emerald-600 text-white px-4 py-1.5 rounded-full hover:bg-emerald-700 transition-colors"
      >
        + Post a listing
      </a>
    </div>
    
  )
}
