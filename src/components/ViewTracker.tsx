"use client"
import { useEffect } from "react"
import { createClient } from "@/lib/supabase-browser"

export default function ViewTracker({ listingId }: { listingId: string }) {
  const supabase = createClient()

  useEffect(() => {
    supabase.from("listing_views").insert({ listing_id: listingId })
  }, [])

  return null
}
