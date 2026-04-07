import { Listing } from "@/types/listing"
import ListingCard from "./ListingCard"

export default function ListingsGrid({ listings }: { listings: Listing[] }) {
  if (listings.length === 0) {
    return (
      <div style={{ background: "#E8F8F3" }} className="flex flex-col items-center justify-center py-24 flex-1">
        <p style={{ color: "#0F7A5F" }} className="text-xl font-medium">No listings found</p>
        <p style={{ color: "#1D9E75" }} className="text-sm mt-1">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div style={{ background: "#E8F8F3" }} className="flex-1 px-4 py-6">
      <p style={{ color: "#1D9E75" }} className="text-sm mb-4">{listings.length} listings found</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {listings.map(l => <ListingCard key={l.id} listing={l} />)}
      </div>
    </div>
  )
}

