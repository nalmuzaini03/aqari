"use client"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { createClient } from "@/lib/supabase-browser"
import { KUWAIT_AREAS, PROPERTY_TYPES } from "@/lib/constants"
import Link from "next/link"
import { useLang } from "@/lib/language-context"
import { t } from "@/lib/translations"

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

export default function EditListingPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const supabaseBrowser = createClient()
  const { lang, setLang } = useLang()
  const tr = t[lang]
  const isAr = lang === "ar"

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [listingType, setListingType] = useState("rent")

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    price_per_night: "",
    area: "",
    property_type: "",
    bedrooms: "",
    bathrooms: "",
    phone_number: "",
  })

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.push("/login"); return }

      const { data: listing } = await supabaseBrowser
        .from("property_listings")
        .select("*")
        .eq("id", id)
        .eq("user_id", data.session.user.id)
        .single()

      if (!listing) { router.push("/my-listings"); return }

      setListingType(listing.listing_type ?? "rent")
      setForm({
        title: listing.title ?? "",
        description: listing.description ?? "",
        price: listing.price?.toString() ?? "",
        price_per_night: listing.price_per_night?.toString() ?? "",
        area: listing.area ?? "",
        property_type: listing.property_type ?? "",
        bedrooms: listing.bedrooms?.toString() ?? "",
        bathrooms: listing.bathrooms?.toString() ?? "",
        phone_number: listing.phone_number ?? "",
      })
      setFetching(false)
    })
  }, [id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const pricePerNight = listingType === "short_stay" ? Number(form.price_per_night) : null
    const price = listingType === "short_stay" ? (pricePerNight ?? 0) : Number(form.price)

    const { error, data } = await supabaseBrowser.from("property_listings").update({
      title: form.title,
      description: form.description,
      price,
      price_per_night: pricePerNight,
      area: form.area,
      property_type: form.property_type,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
      phone_number: form.phone_number,
      listing_type: listingType,
    }).eq("id", id).select()

    console.log("Update result:", { error, data })

    if (error) { setError(error.message); setLoading(false); return }
    router.push("/my-listings")
  }

  const LISTING_TYPES = [
    { value: "rent", label: isAr ? "للإيجار" : "For rent", desc: isAr ? "إيجار شهري" : "Monthly rental" },
    { value: "short_stay", label: isAr ? "إقامة قصيرة" : "Short stay", desc: isAr ? "ليلي / عطلة" : "Nightly / weekend" },
    { value: "sale", label: isAr ? "للبيع" : "For sale", desc: isAr ? "شراء عقار" : "Property purchase" },
  ]

  const inputStyle = {
    background: "white", border: "1px solid #DDDDDD", color: "#222",
    borderRadius: "8px", fontSize: "14px", width: "100%", padding: "12px 16px",
  }
  const labelStyle = {
    fontSize: "12px", color: "#717171", letterSpacing: "0.5px",
    fontWeight: 600, display: "block" as const, marginBottom: "6px",
  }

  if (fetching) return (
    <div style={{ background: "white", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#717171" }}>{tr.loading}</p>
    </div>
  )

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
          <Link href="/my-listings" style={{ fontSize: "14px", color: "#222", border: "1px solid #DDDDDD", padding: "8px 20px", borderRadius: "24px", fontWeight: 500 }}>
            {isAr ? "إعلاناتي" : "My listings"}
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">

        <Link href="/my-listings" style={{ color: "#717171", fontSize: "14px", textDecoration: "none" }} className="flex items-center gap-1 mb-8">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {isAr ? "إعلاناتي" : "My listings"}
        </Link>

        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#222", letterSpacing: "-0.5px" }} className="mb-1">
          {isAr ? "تعديل الإعلان" : "Edit listing"}
        </h1>
        <p style={{ fontSize: "15px", color: "#717171" }} className="mb-8">
          {isAr ? "عدّل تفاصيل إعلانك أدناه." : "Update your listing details below."}
        </p>

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
                <button key={lt.value} type="button" onClick={() => setListingType(lt.value)}
                  style={{ border: listingType === lt.value ? "2px solid #FF385C" : "1px solid #DDDDDD", borderRadius: "12px", padding: "14px 10px", background: listingType === lt.value ? "#FFF0F2" : "white", cursor: "pointer", textAlign: "center" }}>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: listingType === lt.value ? "#FF385C" : "#222", marginBottom: "2px" }}>{lt.label}</p>
                  <p style={{ fontSize: "11px", color: "#717171" }}>{lt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label style={labelStyle}>{tr.titleLabel}</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              required style={inputStyle} className="focus:outline-none" />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>{tr.descLabel}</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              rows={4} style={{ ...inputStyle, resize: "none" }} className="focus:outline-none" />
          </div>

          {/* Price */}
          {listingType === "short_stay" ? (
            <div>
              <label style={labelStyle}>{tr.priceNight}</label>
              <input type="number" min={0} value={form.price_per_night}
                onChange={e => setForm({ ...form, price_per_night: e.target.value })}
                required style={inputStyle} className="focus:outline-none" />
            </div>
          ) : (
            <div>
              <label style={labelStyle}>{listingType === "rent" ? tr.priceMonth : tr.priceLabel}</label>
              <input type="number" min={0} value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                required style={inputStyle} className="focus:outline-none" />
            </div>
          )}

          {/* Area */}
          <div>
            <label style={labelStyle}>{tr.areaLabel}</label>
            <select value={form.area} onChange={e => setForm({ ...form, area: e.target.value })}
              required style={inputStyle} className="focus:outline-none">
              <option value="">{tr.selectArea}</option>
              {KUWAIT_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          {/* Property type */}
          <div>
            <label style={labelStyle}>{tr.propertyType}</label>
            <select value={form.property_type} onChange={e => setForm({ ...form, property_type: e.target.value })}
              required style={inputStyle} className="focus:outline-none">
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
              <select value={form.bedrooms} onChange={e => setForm({ ...form, bedrooms: e.target.value })}
                style={inputStyle} className="focus:outline-none">
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
              <select value={form.bathrooms} onChange={e => setForm({ ...form, bathrooms: e.target.value })}
                style={inputStyle} className="focus:outline-none">
                <option value="">-</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">{isAr ? "+4" : "4+"}</option>
              </select>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label style={labelStyle}>{tr.phoneLabel}</label>
            <input value={form.phone_number} onChange={e => setForm({ ...form, phone_number: e.target.value })}
              required placeholder="+965 9999 9999" style={inputStyle} className="focus:outline-none" />
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}
            style={{ background: loading ? "#DDDDDD" : "#FF385C", color: "white", borderRadius: "8px", fontSize: "15px", border: "none", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", padding: "14px" }}
            className="w-full mt-2">
            {loading ? (isAr ? "جاري الحفظ..." : "Saving...") : (isAr ? "حفظ التغييرات →" : "Save changes →")}
          </button>

        </form>
      </div>
    </div>
  )
}
