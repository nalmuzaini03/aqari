import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import ViewTracker from "@/components/ViewTracker"
import ListingDetail from "@/components/ListingDetail"

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: listing, error } = await supabase.from("property_listings").select("*").eq("id", id).single()
  if (error || !listing) return notFound()

  return (
    <>
      <ViewTracker listingId={listing.id} />
      <ListingDetail listing={listing} />
    </>
  )
}
