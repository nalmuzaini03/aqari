"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { createClient } from "@/lib/supabase-browser"
import { KUWAIT_AREAS, PROPERTY_TYPES } from "@/lib/constants"
import Link from "next/link"

async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement("canvas")
      const maxSize = 1200
      let { width, height } = img
      if (width > maxSize || height > maxSize) {
        if (width > height) { height = (height / width) * maxSize; width = maxSize }
        else { width = (width / height) * maxSize; height = maxSize }
      }
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(blob => {
        URL.revokeObjectURL(url)
        resolve(new File([blob!], file.name, { type: "image/jpeg" }))
      }, "image/jpeg", 0.75)
    }
    img.src = url
  })
}

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

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const compressed = await Promise.all(files.map(compressImage))
    setPhotos(prev => [...prev, ...compressed])
  }

  async function uploadPhotos(listingId: string): Promise<string[]> {
    const urls: string[] = []
    for (const file of photos) {
      const path = `${listingId}/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
      const { error } = await supabase.storage.from("listing-photos").upload(path, file)
      if (error) continue
      const { data } = supabase.storage.from("listing-photos").getPublicUrl(path)
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
    const { data: { session } } = await supabaseBrowser.auth.getSession()
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
      user_id: session?.user.id ?? null,
    })
    if (error) { setError(error.message); setLoading(false); return }
    router.push("/my-listings")
  }

  const inputStyle = { background: "#FAF8F4", border: "1px solid #E8E0D0", color: "#1C3829", borderRadius: "4px", fontSize: "14px", width: "100%", padding: "10px 14px" }
  const labelStyle = { fontSize: "12px", color: "#8C7B65", letterSpacing: "0.5px", display: "block" as const, marginBottom: "6px" }

  return (
    <div style={{ background: "#FAF8F4", minHeight: "100vh" }}>
      <nav style={{ background: "#FAF8F4", borderBottom: "1px solid #E8E0D0" }} className="flex items-center justify-between px-6 sm:px-12 py-5">
        <Link href="/" style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: "#1C3829", letterSpacing: "3px" }}>
          AQ<span style={{ color: "#2D6A4F" }}>A</span>RI
        </Link>
        <Link href="/listings" style={{ fontSize: "13px", color: "#6B5F50" }}>Browse listings</Link>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link href="/listings" style={{ color: "#8C7B65", fontSize: "13px" }} className="flex items-center gap-1 mb-8">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to listings
        </Link>

        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "32px", color: "#1C3829", fontWeight: "400" }} className="mb-1">Post a listing</h1>
        <p style={{ fontSize: "14px", color: "#8C7B65" }} className="mb-8">Fill in the details below to list your property on Aqari.</p>

        {error && <div style={{ background: "#F2EDE4", border: "1px solid #E8E0D0", borderRadius: "4px", color: "#6B5F50", fontSize: "13px" }} className="mb-6 p-3">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div>
            <label style={labelStyle}>LISTING TYPE</label>
            <div className="flex gap-4">
              {["rent", "sale"].map(type => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="listing_type" value={type} defaultChecked={type === "rent"} />
                  <span style={{ fontSize: "14px", color: "#1C3829" }} className="capitalize">For {type}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>TITLE</label>
            <input name="title" required placeholder="e.g. Spacious 2BR apartment in Salmiya" style={inputStyle} className="focus:outline-none" />
          </div>

          <div>
            <label style={labelStyle}>DESCRIPTION</label>
            <textarea name="description" rows={3} placeholder="Describe the property..." style={{ ...inputStyle, resize: "none" }} className="focus:outline-none" />
          </div>

          <div>
            <label style={labelStyle}>PRICE (KWD)</label>
            <input name="price" type="number" required min={0} placeholder="e.g. 350" style={inputStyle} className="focus:outline-none" />
          </div>

          <div>
            <label style={labelStyle}>AREA</label>
            <select name="area" required style={inputStyle} className="focus:outline-none">
              <option value="">Select an area</option>
              {KUWAIT_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>PROPERTY TYPE</label>
            <select name="property_type" required style={inputStyle} className="focus:outline-none">
              <option value="">Select a type</option>
              {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>BEDROOMS</label>
              <select name="bedrooms" style={inputStyle} className="focus:outline-none">
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
              <label style={labelStyle}>BATHROOMS</label>
              <select name="bathrooms" style={inputStyle} className="focus:outline-none">
                <option value="">-</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4+</option>
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>PHONE NUMBER</label>
            <input name="phone_number" required placeholder="e.g. +965 9999 9999" style={inputStyle} className="focus:outline-none" />
          </div>

          <div>
            <label style={labelStyle}>PHOTOS <span style={{ color: "#8C7B65", fontWeight: "400", textTransform: "none", letterSpacing: "0" }}>(select multiple — auto compressed)</span></label>
            <input type="file" accept="image/*" multiple onChange={handlePhotoChange} style={{ color: "#6B5F50", fontSize: "13px" }} className="w-full" />
            {photos.length > 0 && (
              <div className="mt-3">
                <p style={{ fontSize: "12px", color: "#8C7B65" }} className="mb-2">{photos.length} photo{photos.length > 1 ? "s" : ""} selected</p>
                <div className="grid grid-cols-3 gap-2">
                  {photos.map((file, i) => (
                    <div key={i} className="relative">
                      <img src={URL.createObjectURL(file)} alt={`preview ${i}`} className="w-full h-20 object-cover rounded" />
                      <button type="button" onClick={() => setPhotos(photos.filter((_, j) => j !== i))} style={{ background: "#1C3829", color: "#FAF8F4", fontSize: "12px" }} className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center">×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} style={{ background: "#1C3829", color: "#FAF8F4", borderRadius: "4px", fontSize: "14px", border: "none", letterSpacing: "0.3px" }} className="w-full py-3.5 font-medium disabled:opacity-50 mt-2">
            {loading ? "Posting..." : "Post listing →"}
          </button>

        </form>
      </div>
    </div>
  )
}
