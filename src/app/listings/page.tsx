import { supabase } from "@/lib/supabase"
import ListingsGrid from "@/components/ListingsGrid"
import FiltersBar from "@/components/FiltersBar"
import { KUWAIT_AREAS, PROPERTY_TYPES } from "@/lib/constants"

export const revalidate = 60


export default async function ListingsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const { listing_type, area, property_type, bedrooms, max_price } = searchParams

  let query = supabase
    .from("property_listings")
    .select("*")
    .order("created_at", { ascending: false })

  if (listing_type) query = query.eq("listing_type", listing_type)
  if (area)         query = query.eq("area", area)
  if (property_type) query = query.eq("property_type", property_type)
  if (bedrooms)     query = query.eq("bedrooms", Number(bedrooms))
  if (max_price)    query = query.lte("price", Number(max_price))

  const { data: listings, error } = await query

  return (
    <main>
      <FiltersBar
        areas={KUWAIT_AREAS}
        propertyTypes={PROPERTY_TYPES}
        current={searchParams}
      />
      {error ? (
        <p className="p-8 text-red-500">Failed to load listings.</p>
      ) : (
        <ListingsGrid listings={listings ?? []} />
      )}
    </main>
  )
}
