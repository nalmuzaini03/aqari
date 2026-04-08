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

const LISTING_TYPES = [
  { value: "rent", label: "For rent", desc: "Monthly rental" },
  { value: "short_stay", label: "Short stay", desc: "Nightly / weekend" },
  { value: "sale", label: "For sale", desc: "Property purchase" },
]

export default function NewListingPage() {
  const router = useRouter()
  const supabaseBrowser = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [photos, setPhotos] = useState<File[]>([])
  const [listingType, setListingType] = useState("rent")

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

    const pricePerNight = listingType === "short_stay" ? Number(data.get("price_per_night")) : null
    const price = listingType === "short_stay"
      ? (pricePerNight ?? 0)
      : Number(data.get("price"))

    const { error } = await supabase.from("property_listings").insert({
      id: listingId,
      title: data.get("title"),
      description: data.get("description"),
      price,
      price_per_night: pricePerNight,
      area: data.get("area"),
      bedrooms: data.get("bedrooms") ? Number(data.get("bedrooms")) : null,
      bathrooms: data.get("bathrooms") ? Number(data.get("bathrooms")) : null,
      property_type: data.get("property_type"),
      phone_number: data.get("phone_number"),
      listing_type: listingType,
      photos: photoUrls,
      is_verified: false,
      user_id: session?.user.id ?? null,
    })
    if (error) { setError(error.message); setLoading(false); return }
    router.push("/my-listings")
  }

  const inputStyle = {
    background: "white", border: "1px solid #DDDDDD", color: "#222",
    borderRadius: "8px", fontSize: "14px", width: "100%", padding: "12px 16px",
  }
  const labelStyle = {
    fontSize: "12px", color: "#717171", letterSpacing: "0.5px",
    fontWeight: 600, display: "block" as const, marginBottom: "6px",
  }

  return (
    <div style={{ background: "white", minHeight: "100vh" }}>

      {/* Nav */}
      <nav style={{ background: "white", borderBottom: "1px solid #EBEBEB" }} className="flex items-center justify-between px-6 sm:px-10 py-4">
        <Link href="/" style={{ fontSize: "22px", fontWeight: 800, color: "#FF385C", letterSpacing: "-0.5px", textDecoration: "none" }}>aqari</Link>
        <Link href="/listings" style={{ fontSize: "14px", color: "#222", border: "1px solid #DDDDDD", padding: "8px 20px", borderRadius: "24px", fontWeight: 500 }}>Browse listings</Link>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">

        <Link href="/listings" style={{ color: "#717171", fontSize: "14px", textDecoration: "none" }} className="flex items-center gap-1 mb-8">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to listings
        </Link>

        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#222", letterSpacing: "-0.5px" }} className="mb-1">Post a listing</h1>
        <p style={{ fontSize: "15px", color: "#717171" }} className="mb-8">Fill in the details below to list your property on Aqari. It's free.</p>

        {error && (
          <div style={{ background: "#FFF0F2", border: "1px solid #FFD6DF", borderRadius: "8px", color: "#C4001B", fontSize: "13px" }} className="mb-6 p-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Listing type */}
          <div>
            <label style={labelStyle}>LISTING TYPE</label>
            <div className="grid grid-cols-3 gap-3">
              {LISTING_TYPES.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setListingType(t.value)}
                  style={{
                    border: listingType === t.value ? "2px solid #FF385C" : "1px solid #DDDDDD",
                    borderRadius: "12px", padding: "14px 10px", background: listingType === t.value ? "#FFF0F2" : "white",
                    cursor: "pointer", textAlign: "center",
                  }}
                >
                  <p style={{ fontSize: "14px", fontWeight: 700, color: listingType === t.value ? "#FF385C" : "#222", marginBottom: "2px" }}>{t.label}</p>
                  <p style={{ fontSize: "11px", color: "#717171" }}>{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label style={labelStyle}>TITLE</label>
            <input name="title" required
              placeholder={listingType === "short_stay" ? "e.g. Private chalet with pool in Messila" : "e.g. Spacious 2BR apartment in Salmiya"}
              style={inputStyle} className="focus:outline-none" />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>DESCRIPTION</label>
            <textarea name="description" rows={4}
              placeholder={listingType === "short_stay" ? "Describe the chalet — pool, BBQ, capacity, amenities..." : "Describe the property — floor, furnishing, parking..."}
              style={{ ...inputStyle, resize: "none" }} className="focus:outline-none" />
          </div>

          {/* Price — changes based on listing type */}
          {listingType === "short_stay" ? (
            <div>
              <label style={labelStyle}>PRICE PER NIGHT (KWD)</label>
              <input name="price_per_night" type="number" required min={0} placeholder="e.g. 80" style={inputStyle} className="focus:outline-none" />
            </div>
          ) : (
            <div>
              <label style={labelStyle}>{listingType === "rent" ? "PRICE PER MONTH (KWD)" : "PRICE (KWD)"}</label>
              <input name="price" type="number" required min={0} placeholder={listingType === "rent" ? "e.g. 350" : "e.g. 95000"} style={inputStyle} className="focus:outline-none" />
            </div>
          )}

          {/* Area */}
          <div>
            <label style={labelStyle}>AREA</label>
            <select name="area" required style={inputStyle} className="focus:outline-none">
              <option value="">Select an area</option>
              {KUWAIT_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          {/* Property type */}
          <div>
            <label style={labelStyle}>PROPERTY TYPE</label>
            <select name="property_type" required style={inputStyle} className="focus:outline-none">
              <option value="">Select a type</option>
              {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>

          {/* Bedrooms + Bathrooms */}
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

          {/* Short stay capacity */}
          {listingType === "short_stay" && (
            <div>
              <label style={labelStyle}>MAX GUESTS</label>
              <select name="max_guests" style={inputStyle} className="focus:outline-none">
                <option value="">-</option>
                {[2,4,6,8,10,12,15,20,25,30].map(n => (
                  <option key={n} value={n}>Up to {n} guests</option>
                ))}
              </select>
            </div>
          )}

          {/* Phone */}
          <div>
            <label style={labelStyle}>PHONE NUMBER</label>
            <input name="phone_number" required placeholder="+965 9999 9999" style={inputStyle} className="focus:outline-none" />
          </div>

          {/* Photos */}
          <div>
            <label style={labelStyle}>PHOTOS <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional — auto compressed)</span></label>
            <div style={{ border: "1px dashed #DDDDDD", borderRadius: "8px", padding: "20px", textAlign: "center" }}>
              <input type="file" accept="image/*" multiple onChange={handlePhotoChange} style={{ fontSize: "13px", color: "#717171" }} className="w-full" />
              <p style={{ fontSize: "12px", color: "#717171", marginTop: "8px" }}>Select multiple photos. Each will be compressed automatically.</p>
            </div>
            {photos.length > 0 && (
              <div className="mt-3">
                <p style={{ fontSize: "12px", color: "#717171" }} className="mb-2">{photos.length} photo{photos.length > 1 ? "s" : ""} selected</p>
                <div className="grid grid-cols-3 gap-2">
                  {photos.map((file, i) => (
                    <div key={i} className="relative">
                      <img src={URL.createObjectURL(file)} alt={`preview ${i}`} className="w-full h-24 object-cover" style={{ borderRadius: "8px" }} />
                      <button type="button" onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                        style={{ background: "#222", color: "white", fontSize: "14px", position: "absolute", top: "4px", right: "4px", width: "22px", height: "22px", borderRadius: "50%", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}
            style={{ background: loading ? "#DDDDDD" : "#FF385C", color: "white", borderRadius: "8px", fontSize: "15px", border: "none", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", padding: "14px" }}
            className="w-full mt-2">
            {loading ? "Posting..." : "Post listing →"}
          </button>

        </form>
      </div>
    </div>
  )
}
