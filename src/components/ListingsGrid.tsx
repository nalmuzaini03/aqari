import { Listing } from "@/types/listing"
import ListingCard from "./ListingCard"

export default function ListingsGrid({ listings }: { listings: Listing[] }) {
  if (listings.length === 0) {
    return (
      <div style={{ background: "#FAF8F4" }} className="flex flex-col items-center justify-center py-24 flex-1">
        <p style={{ fontFamily: "Georgia, serif", fontSize: "22px", color: "#1C3829" }}>No listings found</p>
        <p style={{ fontSize: "14px", color: "#8C7B65", marginTop: "8px" }}>Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div style={{ background: "#FAF8F4" }} className="flex-1 px-4 py-6">
      <p style={{ fontSize: "13px", color: "#8C7B65", letterSpacing: "0.3px" }} className="mb-4">{listings.length} listings found</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {listings.map(l => <ListingCard key={l.id} listing={l} />)}
      </div>
    </div>
  )
}
