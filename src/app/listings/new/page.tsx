"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { createClient } from "@/lib/supabase-browser"
import { KUWAIT_AREAS, PROPERTY_TYPES } from "@/lib/constants"

export default function NewListingPage() {
  const router = useRouter()
  const supabaseBrowser = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [photos, setPhotos] = useState<File[]>([])

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(({ data }) => {
      if (!data.session) router.push("/login")
    })
  }, [])

  async function uploadPhotos(listingId: string): Promise<string[]> {
    const urls: string[] = []
    for (const file of photos) {
      const ext = file.name.split(".").pop()
      const path = `${listingId}/${Date.now()}.${ext}`
      const { error } = await supabase.storage
        .from("listing-photos")
        .upload(path, file)
      if (error) continue
      const { data } = supabase.storage
        .from("listing-photos")
        .getPublicUrl(path)
      urls.push(data.publicUrl)
    }
    return urls
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget
    const data = new FormData(form)

    const listingId = crypto.randomUUID()
    const photoUrls = await uploadPhotos(listingId)

    const { error } = await supabase.from("property_listings").insert({
      id: listingId,
      title: data.get("title"),
      description: data.get("description"),
      price: Number(data.get("price")),
      area: data.get("area"),
      bedrooms: data.get("bedrooms") ? Number(data.get("bedrooms")) : null,
      bathrooms: data.get("bathrooms") ? Number(data.get("bathrooms")) : null,
      property_type: data.get("property_type"),
      phone_number: data.get("phone_number"),
      listing_type: data.get("listing_type"),
      photos: photoUrls,
      is_verified: false,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push("/listings")
  }

  return (
    <div style={{ background: "#E8F8F3", minHeight: "100vh" }}>
      <div className="max-w-2xl mx-auto px-4 py-10">

        <a href="/listings" style={{ color: "#1D9E75" }} className="text-sm flex items-center gap-1 mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to listings
        </a>

        <h1 style={{ color: "#0A5C46" }} className="text-2xl font-semibold mb-1">Post a listing</h1>
        <p style={{ color: "#1D9E75" }} className="text-sm mb-8">Fill in the details below to list your property on Aqari.</p>

        {error && (
          <div className="mb-6 p-3 rounded-lg text-sm" style={{ background: "#B2F0DC", color: "#0A5C46" }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Listing type */}
          <div>
            <label style={{ color: "#0F7A5F" }} className="block text-sm font-medium mb-1">Listing type</label>
            <div className="flex gap-3">
              {["rent", "sale"].map(type => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="listing_type" value={type} defaultChecked={type === "rent"} className="accent-emerald-600" />
                  <span style={{ color: "#0A5C46" }} className="text-sm capitalize">For {type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label style={{ color: "#0F7A5F" }} className="block text-sm font-medium mb-1">Title</label>
            <input
              name="title"
              required
              placeholder="e.g. Spacious 2BR apartment in Salmiya"
              style={{ background: "#B2F0DC", border: "1px solid #7FEDD0", color: "#0A5C46" }}
              className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ color: "#0F7A5F" }} className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Describe the property..."
              style={{ background: "#B2F0DC", border: "1px solid #7FEDD0", color: "#0A5C46" }}
              className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
            />
          </div>

          {/* Price */}
          <div>
            <label style={{ color: "#0F7A5F" }} className="block text-sm font-medium mb-1">Price (KWD)</label>
            <input
              name="price"
              type="number"
              required
              min={0}
              placeholder="e.g. 350"
              style={{ background: "#B2F0DC", border: "1px solid #7FEDD0", color: "#0A5C46" }}
              className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
            />
          </div>

          {/* Area */}
          <div>
            <label style={{ color: "#0F7A5F" }} className="block text-sm font-medium mb-1">Area</label>
            <select
              name="area"
              required
              style={{ background: "#B2F0DC", border: "1px solid #7FEDD0", color: "#0A5C46" }}
              className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
            >
              <option value="">Select an area</option>
              {KUWAIT_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          {/* Property type */}
          <div>
            <label style={{ color: "#0F7A5F" }} className="block text-sm font-medium mb-1">Property type</label>
            <select
              name="property_type"
              required
              style={{ background: "#B2F0DC", border: "1px solid #7FEDD0", color: "#0A5C46" }}
              className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
            >
              <option value="">Select a type</option>
              {PROPERTY_TYPES.map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Bedrooms & Bathrooms */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={{ color: "#0F7A5F" }} className="block text-sm font-medium mb-1">Bedrooms</label>
              <select
                name="bedrooms"
                style={{ background: "#B2F0DC", border: "1px solid #7FEDD0", color: "#0A5C46" }}
                className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
              >
                <option value="">-</option>
                <option value="0">Studio</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5+</option>
              </select>
            </div>
            <div>
              <label style={{ color: "#0F7A5F" }} className="block text-sm font-medium mb-1">Bathrooms</label>
              <select
                name="bathrooms"
                style={{ background: "#B2F0DC", border: "1px solid #7FEDD0", color: "#0A5C46" }}
                className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
              >
                <option value="">-</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4+</option>
              </select>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label style={{ color: "#0F7A5F" }} className="block text-sm font-medium mb-1">Phone number</label>
            <input
              name="phone_number"
              required
              placeholder="e.g. +965 9999 9999"
              style={{ background: "#B2F0DC", border: "1px solid #7FEDD0", color: "#0A5C46" }}
              className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
            />
          </div>

          {/* Photos */}
          <div>
            <label style={{ color: "#0F7A5F" }} className="block text-sm font-medium mb-1">
              Photos <span style={{ color: "#1D9E75" }} className="font-normal text-xs">(select multiple)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={e => setPhotos(Array.from(e.target.files ?? []))}
              className="w-full text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-medium"
              style={{ color: "#1D9E75" }}
            />
            {photos.length > 0 && (
              <div className="mt-2">
                <p className="text-xs mb-2" style={{ color: "#1D9E75" }}>{photos.length} photo{photos.length > 1 ? "s" : ""} selected</p>
                <div className="grid grid-cols-3 gap-2">
                  {photos.map((file, i) => (
                    <div key={i} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`preview ${i}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: "#0A5C46", color: "#7FEDD0" }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{ background: "#0F7A5F", color: "#7FEDD0" }}
            className="w-full rounded-lg py-3 text-sm font-medium disabled:opacity-50 mt-2"
          >
            {loading ? "Posting..." : "Post listing"}
          </button>

        </form>
      </div>
    </div>
  )
}
