"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-browser"

const ADMIN_ID = "b71f1761-8d5c-47a5-a549-7ebea09b25e6"

export default function DeleteButton({ listingId }: { listingId: string }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user.id === ADMIN_ID) setIsAdmin(true)
    })
  }, [])

  if (!isAdmin) return null

  async function handleDelete() {
    if (!confirm("Delete this listing?")) return
    setDeleting(true)
    await supabase.from("property_listings").delete().eq("id", listingId)
    router.push("/listings")
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      style={{ background: "#F2EDE4", color: "#6B5F50", border: "1px solid #E8E0D0", borderRadius: "4px", fontSize: "13px" }}
      className="px-4 py-1.5 disabled:opacity-50"
    >
      {deleting ? "Deleting..." : "Delete listing"}
    </button>
  )
}
