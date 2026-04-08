"use client"
import { useEffect } from "react"
import { createClient } from "@/lib/supabase-browser"

export default function ViewTracker({ listingId }: { listingId: string }) {
  useEffect(() => {
    const supabase = createClient()
    supabase.from("listing_views").insert({ listing_id: listingId }).then(({ error }) => {
      if (error) console.error("View tracking error:", error)
      else console.log("View tracked for:", listingId)
    })
  }, [listingId])

  return null
}
