import { supabase } from "@/lib/supabase"
import ListingsGrid from "@/components/ListingsGrid"
import FiltersBar from "@/components/FiltersBar"
import ListingsMap from "@/components/ListingsMap"
import { KUWAIT_AREAS, PROPERTY_TYPES } from "@/lib/constants"

export const revalidate = 0

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function ListingsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const { listing_type, area, property_type, bedrooms, max_price, min_price, view } = params

  let query = supabase
    .from("property_listings")
    .select("*")
    .order("created_at", { ascending: false })

  if (listing_type && typeof listing_type === "string")
    query = query.eq("listing_type", listing_type)
  if (area) {
    const areas = Array.isArray(area) ? area : [area]
    query = query.in("area", areas)
  }
  if (property_type && typeof property_type === "string")
    query = query.eq("property_type", property_type)
  if (bedrooms && typeof bedrooms === "string")
    query = query.eq("bedrooms", Number(bedrooms))
  if (min_price && typeof min_price === "string")
    query = query.gte("price", Number(min_price))
  if (max_price && typeof max_price === "string")
    query = query.lte("price", Number(max_price))

  const { data: listings, error } = await query

  const selectedAreas = area ? (Array.isArray(area) ? area : [area]) : []
  const showMap = view === "map"

  return (
    <main className="flex flex-col" style={{ height: "100dvh" }}>
      <FiltersBar
        areas={KUWAIT_AREAS}
        propertyTypes={PROPERTY_TYPES}
        selectedAreas={selectedAreas}
        currentListingType={typeof listing_type === "string" ? listing_type : ""}
        currentPropertyType={typeof property_type === "string" ? property_type : ""}
        currentBedrooms={typeof bedrooms === "string" ? bedrooms : ""}
        currentMaxPrice={typeof max_price === "string" ? max_price : ""}
        currentMinPrice={typeof min_price === "string" ? min_price : ""}
        showMap={showMap}
      />
      {error ? (
        <p className="p-8" style={{ color: "#717171" }}>Failed to load listings.</p>
      ) : showMap ? (
        <div style={{ flex: 1, position: "relative" }}>
          <ListingsMap listings={listings ?? []} />
        </div>
      ) : (
        <>
          {/* Desktop: split grid + map */}
          <div className="hidden lg:flex flex-1 overflow-hidden">
            <div className="w-1/2 overflow-y-auto">
              <ListingsGrid listings={listings ?? []} />
            </div>
            <div className="w-1/2" style={{ position: "sticky", top: 0, height: "calc(100dvh - 60px)" }}>
              <ListingsMap listings={listings ?? []} />
            </div>
          </div>
          {/* Mobile: grid only */}
          <div className="lg:hidden flex-1 overflow-y-auto">
            <ListingsGrid listings={listings ?? []} />
          </div>
        </>
      )}
    </main>
  )
}
