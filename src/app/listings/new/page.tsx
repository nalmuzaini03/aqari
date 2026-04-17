"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { createClient } from "@/lib/supabase-browser"
import { KUWAIT_AREAS, PROPERTY_TYPES } from "@/lib/constants"
import Link from "next/link"
import { useLang } from "@/lib/language-context"
import { t } from "@/lib/translations"

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

const PROPERTY_TYPE_LABELS: Record<string, { en: string; ar: string }> = {
  apartment: { en: "Apartment", ar: "شقة" },
  villa: { en: "Villa", ar: "فيلا" },
  floor: { en: "Floor", ar: "طابق" },
  building: { en: "Building", ar: "عمارة" },
  chalet: { en: "Chalet", ar: "شاليه" },
  office: { en: "Office", ar: "مكتب" },
  shop: { en: "Shop", ar: "محل" },
  land: { en: "Land", ar: "أرض" },
}

export default function NewListingPage() {
  const router = useRouter()
  const supabaseBrowser = createClient()
  const { lang, setLang } = useLang()
  const tr = t[lang]
  const isAr = lang === "ar"

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [photos, setPhotos] = useState<File[]>([])
  const [listingType, setListingType] = useState("rent")
  const [authed, setAuthed] = useState(false)
  const [blockNumber, setBlockNumber] = useState("")
  const [streetNumber, setStreetNumber] = useState("")
  const [floorNumber, setFloorNumber] = useState("")
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [geocoding, setGeocoding] = useState(false)

  const LISTING_TYPES = [
    { value: "rent", label: isAr ? "للإيجار" : "For rent", desc: isAr ? "إيجار شهري" : "Monthly rental" },
    { value: "short_stay", label: isAr ? "إقامة قصيرة" : "Short stay", desc: isAr ? "ليلي / عطلة نهاية الأسبوع" : "Nightly / weekend" },
    { value: "sale", label: isAr ? "للبيع" : "For sale", desc: isAr ? "شراء عقار" : "Property purchase" },
  ]

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(({ data }) => {
      if (!data.session) router.push("/login")
      else setAuthed(true)
    })
  }, [])

  async function geocodeAddress(area: string) {
    if (!area) return
    setGeocoding(true)
    try {
      const res = await fetch("/api/geocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ area, block: blockNumber, street: streetNumber }),
      })
      const data = await res.json()
      if (data.lat) setCoords({ lat: data.lat, lng: data.lng })
    } catch {}
    setGeocoding(false)
  }

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

    const title = data.get("title") as string
    const description = data.get("description") as string
    const pricePerNight = listingType === "short_stay" ? Number(data.get("price_per_night")) : null
    const price = listingType === "short_stay" ? (pricePerNight ?? 0) : Number(data.get("price"))

    // Auto-translate title and description
    const detectedLang = isAr ? "ar" : "en"
    const targetLang = isAr ? "en" : "ar"

    let title_ar = "", title_en = "", description_ar = "", description_en = ""

    try {
      const [titleRes, descRes] = await Promise.all([
        fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: title, targetLang }),
        }),
        description ? fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: description, targetLang }),
        }) : Promise.resolve(null),
      ])

      const titleData = await titleRes.json()
      const descData = descRes ? await descRes.json() : { translated: "" }

      if (detectedLang === "ar") {
        title_ar = title
        title_en = titleData.translated
        description_ar = description
        description_en = descData.translated
      } else {
        title_en = title
        title_ar = titleData.translated
        description_en = description
        description_ar = descData.translated
      }
    } catch {
      // If translation fails, just use original for both
      title_ar = title
      title_en = title
      description_ar = description
      description_en = description
    }

    const { error } = await supabase.from("property_listings").insert({
      id: listingId,
      title,
      title_ar,
      title_en,
      description,
      description_ar,
      description_en,
      price,
      price_per_night: pricePerNight,
      area: data.get("area"),
      block_number: blockNumber || null,
      street_number: streetNumber || null,
      floor_number: floorNumber || null,
      latitude: coords?.lat ?? null,
      longitude: coords?.lng ?? null,
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
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(isAr ? "en" : "ar")}
            style={{ fontSize: "13px", color: "#222", border: "1px solid #DDDDDD", padding: "7px 14px", borderRadius: "24px", background: "white", fontWeight: 600, cursor: "pointer" }}
          >
            {isAr ? "English" : "العربية"}
          </button>
          <Link href="/listings" style={{ fontSize: "14px", color: "#222", border: "1px solid #DDDDDD", padding: "8px 20px", borderRadius: "24px", fontWeight: 500 }}>
            {tr.browseListing}
          </Link>
        </div>
      </nav>

      {authed && (
        <div className="max-w-2xl mx-auto px-4 py-10">

          <Link href="/listings" style={{ color: "#717171", fontSize: "14px", textDecoration: "none" }} className="flex items-center gap-1 mb-8">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {tr.backToListings}
          </Link>

          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#222", letterSpacing: "-0.5px" }} className="mb-1">{tr.postTitle}</h1>
          <p style={{ fontSize: "15px", color: "#717171" }} className="mb-8">{tr.postSub}</p>

          {error && (
            <div style={{ background: "#FFF0F2", border: "1px solid #FFD6DF", borderRadius: "8px", color: "#C4001B", fontSize: "13px" }} className="mb-6 p-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Listing type */}
            <div>
              <label style={labelStyle}>{tr.listingType}</label>
              <div className="grid grid-cols-3 gap-3">
                {LISTING_TYPES.map(lt => (
                  <button
                    key={lt.value}
                    type="button"
                    onClick={() => setListingType(lt.value)}
                    style={{
                      border: listingType === lt.value ? "2px solid #FF385C" : "1px solid #DDDDDD",
                      borderRadius: "12px", padding: "14px 10px",
                      background: listingType === lt.value ? "#FFF0F2" : "white",
                      cursor: "pointer", textAlign: "center",
                    }}
                  >
                    <p style={{ fontSize: "14px", fontWeight: 700, color: listingType === lt.value ? "#FF385C" : "#222", marginBottom: "2px" }}>{lt.label}</p>
                    <p style={{ fontSize: "11px", color: "#717171" }}>{lt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label style={labelStyle}>{tr.titleLabel}</label>
              <input name="title" required
                placeholder={listingType === "short_stay"
                  ? (isAr ? "مثال: شاليه خاص مع مسبح في المسيلة" : "e.g. Private chalet with pool in Messila")
                  : (isAr ? "مثال: شقة واسعة ٢ غرف في السالمية" : "e.g. Spacious 2BR apartment in Salmiya")}
                style={inputStyle} className="focus:outline-none" />
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>{tr.descLabel}</label>
              <textarea name="description" rows={4}
                placeholder={listingType === "short_stay"
                  ? (isAr ? "صف الشاليه — مسبح، شواء، سعة، مرافق..." : "Describe the chalet — pool, BBQ, capacity, amenities...")
                  : (isAr ? "صف العقار — الطابق، الأثاث، المواقف..." : "Describe the property — floor, furnishing, parking...")}
                style={{ ...inputStyle, resize: "none" }} className="focus:outline-none" />
            </div>

            {/* Price */}
            {listingType === "short_stay" ? (
              <div>
                <label style={labelStyle}>{tr.priceNight}</label>
                <input name="price_per_night" type="number" required min={0}
                  placeholder={isAr ? "مثال: ٨٠" : "e.g. 80"} style={inputStyle} className="focus:outline-none" />
              </div>
            ) : (
              <div>
                <label style={labelStyle}>{listingType === "rent" ? tr.priceMonth : tr.priceLabel}</label>
                <input name="price" type="number" required min={0}
                  placeholder={listingType === "rent" ? (isAr ? "مثال: ٣٥٠" : "e.g. 350") : (isAr ? "مثال: ٩٥٠٠٠" : "e.g. 95000")}
                  style={inputStyle} className="focus:outline-none" />
              </div>
            )}

            {/* Area */}
            <div>
              <label style={labelStyle}>{tr.areaLabel}</label>
              <select name="area" required style={inputStyle} className="focus:outline-none">
                <option value="">{tr.selectArea}</option>
                {KUWAIT_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            {/* Block + Street + Floor */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label style={labelStyle}>{isAr ? "رقم القطعة" : "BLOCK"}</label>
                <input
                  value={blockNumber}
                  onChange={e => setBlockNumber(e.target.value)}
                  placeholder={isAr ? "مثال: 5" : "e.g. 5"}
                  style={inputStyle} className="focus:outline-none"
                />
              </div>
              <div>
                <label style={labelStyle}>{isAr ? "رقم الشارع" : "STREET"}</label>
                <input
                  value={streetNumber}
                  onChange={e => setStreetNumber(e.target.value)}
                  placeholder={isAr ? "مثال: 12" : "e.g. 12"}
                  style={inputStyle} className="focus:outline-none"
                />
              </div>
              <div>
                <label style={labelStyle}>{isAr ? "الطابق" : "FLOOR"}</label>
                <input
                  value={floorNumber}
                  onChange={e => setFloorNumber(e.target.value)}
                  placeholder={isAr ? "مثال: 3" : "e.g. 3"}
                  style={inputStyle} className="focus:outline-none"
                />
              </div>
            </div>

            {/* Map preview */}
            {coords && (
              <div style={{ border: "1px solid #EBEBEB", borderRadius: "12px", overflow: "hidden", height: "200px" }}>
                <iframe
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps?q=${coords.lat},${coords.lng}&z=16&output=embed`}
                />
              </div>
            )}

            {/* Locate button */}
            <button
              type="button"
              onClick={() => {
                const areaSelect = document.querySelector('select[name="area"]') as HTMLSelectElement
                geocodeAddress(areaSelect?.value || "")
              }}
              disabled={geocoding}
              style={{ background: geocoding ? "#DDDDDD" : "white", color: "#222", border: "1px solid #DDDDDD", borderRadius: "8px", padding: "12px", fontSize: "14px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
              className="w-full"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"/>
              </svg>
              {geocoding ? (isAr ? "جاري تحديد الموقع..." : "Locating...") : (isAr ? "تحديد الموقع على الخريطة" : "Preview location on map")}
            </button>

            {/* Property type */}
            <div>
              <label style={labelStyle}>{tr.propertyType}</label>
              <select name="property_type" required style={inputStyle} className="focus:outline-none">
                <option value="">{tr.selectType}</option>
                {PROPERTY_TYPES.map(pt => (
                  <option key={pt} value={pt}>
                    {isAr ? (PROPERTY_TYPE_LABELS[pt]?.ar ?? pt) : (PROPERTY_TYPE_LABELS[pt]?.en ?? pt)}
                  </option>
                ))}
              </select>
            </div>

            {/* Bedrooms + Bathrooms */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>{tr.bedroomsLabel}</label>
                <select name="bedrooms" style={inputStyle} className="focus:outline-none">
                  <option value="">-</option>
                  <option value="0">{isAr ? "استوديو" : "Studio"}</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">{isAr ? "+5" : "5+"}</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>{tr.bathroomsLabel}</label>
                <select name="bathrooms" style={inputStyle} className="focus:outline-none">
                  <option value="">-</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">{isAr ? "+4" : "4+"}</option>
                </select>
              </div>
            </div>

            {/* Max guests for short stay */}
            {listingType === "short_stay" && (
              <div>
                <label style={labelStyle}>{tr.maxGuests}</label>
                <select name="max_guests" style={inputStyle} className="focus:outline-none">
                  <option value="">-</option>
                  {[2,4,6,8,10,12,15,20,25,30].map(n => (
                    <option key={n} value={n}>{isAr ? `حتى ${n} ضيف` : `Up to ${n} guests`}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Phone */}
            <div>
              <label style={labelStyle}>{tr.phoneLabel}</label>
              <input name="phone_number" required placeholder="+965 9999 9999" style={inputStyle} className="focus:outline-none" />
            </div>

            {/* Photos */}
            <div>
              <label style={labelStyle}>
                {tr.photosLabel} <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>({tr.photosNote})</span>
              </label>
              <div style={{ border: "1px dashed #DDDDDD", borderRadius: "8px", padding: "20px", textAlign: "center" }}>
                <input type="file" accept="image/*" multiple onChange={handlePhotoChange} style={{ fontSize: "13px", color: "#717171" }} className="w-full" />
                <p style={{ fontSize: "12px", color: "#717171", marginTop: "8px" }}>
                  {isAr ? "اختر صوراً متعددة. سيتم ضغط كل صورة تلقائياً." : "Select multiple photos. Each will be compressed automatically."}
                </p>
              </div>
              {photos.length > 0 && (
                <div className="mt-3">
                  <p style={{ fontSize: "12px", color: "#717171" }} className="mb-2">
                    {isAr ? `${photos.length} صورة مختارة` : `${photos.length} photo${photos.length > 1 ? "s" : ""} selected`}
                  </p>
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
              {loading ? (isAr ? "جاري الترجمة والنشر..." : "Translating & posting...") : tr.postBtn2}
            </button>

          </form>
        </div>
      )}
    </div>
  )
}
