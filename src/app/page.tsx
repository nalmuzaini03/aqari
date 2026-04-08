"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const GOVERNORATES = [
  { en: "All", ar: "" },
  { en: "Capital", ar: "العاصمة" },
  { en: "Hawalli", ar: "حولي" },
  { en: "Farwaniya", ar: "الفروانية" },
  { en: "Ahmadi", ar: "الأحمدي" },
  { en: "Jahra", ar: "الجهراء" },
  { en: "Mubarak", ar: "مبارك الكبير" },
]

const AREAS_BY_GOV: Record<string, { en: string; ar: string }[]> = {
  All: [
    { en: "Salmiya", ar: "السالمية" },
    { en: "Jabriya", ar: "الجابرية" },
    { en: "Mishref", ar: "مشرف" },
    { en: "Hawalli", ar: "حولي" },
    { en: "Rumaithiya", ar: "الرميثية" },
    { en: "Bayan", ar: "بيان" },
    { en: "Farwaniya", ar: "الفروانية" },
    { en: "Fahaheel", ar: "الفحيحيل" },
  ],
  Capital: [
    { en: "Sharq", ar: "شرق" },
    { en: "Mirqab", ar: "المرقاب" },
    { en: "Salhiya", ar: "السالحية" },
    { en: "Kaifan", ar: "كيفان" },
    { en: "Nuzha", ar: "النزهة" },
    { en: "Yarmouk", ar: "اليرموك" },
    { en: "Shuwaikh", ar: "الشويخ" },
    { en: "Doha", ar: "الدوحة" },
  ],
  Hawalli: [
    { en: "Salmiya", ar: "السالمية" },
    { en: "Jabriya", ar: "الجابرية" },
    { en: "Mishref", ar: "مشرف" },
    { en: "Hawalli", ar: "حولي" },
    { en: "Rumaithiya", ar: "الرميثية" },
    { en: "Bayan", ar: "بيان" },
    { en: "Salwa", ar: "سلوى" },
    { en: "Shaab", ar: "الشعب" },
  ],
  Farwaniya: [
    { en: "Farwaniya", ar: "الفروانية" },
    { en: "Khaitan", ar: "خيطان" },
    { en: "Rehab", ar: "الرحاب" },
    { en: "Ardiya", ar: "العارضية" },
    { en: "Riggae", ar: "الرقعي" },
    { en: "Qurain", ar: "القرين" },
    { en: "Omariya", ar: "العمرية" },
    { en: "Ashbeliah", ar: "إشبيلية" },
  ],
  Ahmadi: [
    { en: "Fahaheel", ar: "الفحيحيل" },
    { en: "Fintas", ar: "الفنطاس" },
    { en: "Mangaf", ar: "المنقف" },
    { en: "Mahboula", ar: "المهبولة" },
    { en: "Abu Halifa", ar: "أبو حليفة" },
    { en: "Ahmadi", ar: "الأحمدي" },
    { en: "Riqqa", ar: "الرقة" },
    { en: "Sabahiya", ar: "الصباحية" },
  ],
  Jahra: [
    { en: "Jahra", ar: "الجهراء" },
    { en: "Qasr", ar: "القصر" },
    { en: "Taima", ar: "تيماء" },
    { en: "Naseem", ar: "النسيم" },
    { en: "Oyoun", ar: "العيون" },
    { en: "Saad Al-Abdullah", ar: "سعد العبدالله" },
    { en: "Amghara", ar: "أمغرة" },
    { en: "Mutlaa", ar: "المطلاع" },
  ],
  Mubarak: [
    { en: "Mubarak Al-Kabeer", ar: "مبارك الكبير" },
    { en: "Adan", ar: "عدان" },
    { en: "Sabah Al-Salem", ar: "صباح السالم" },
    { en: "Fnaitees", ar: "الفنيطيس" },
    { en: "Messila", ar: "المسيلة" },
    { en: "Abu Ftaira", ar: "أبو فطيرة" },
    { en: "Qurain", ar: "القرين" },
    { en: "Qusour", ar: "القصور" },
  ],
}

export default function HomePage() {
  const router = useRouter()
  const [activeGov, setActiveGov] = useState("All")
  const [govFilter, setGovFilter] = useState("")
  const [areaFilter, setAreaFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [propertyFilter, setPropertyFilter] = useState("")

  function handleSearch() {
    const params = new URLSearchParams()
    if (areaFilter && areaFilter !== "Anywhere") params.set("area", areaFilter)
    if (typeFilter === "For rent") params.set("listing_type", "rent")
    if (typeFilter === "For sale") params.set("listing_type", "sale")
    if (propertyFilter && propertyFilter !== "Any type") params.set("property_type", propertyFilter.toLowerCase())
    router.push(`/listings?${params.toString()}`)
  }

  function handleAreaClick(area: string) {
    router.push(`/listings?area=${area}`)
  }

  const areas = AREAS_BY_GOV[activeGov] || AREAS_BY_GOV["All"]

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "white" }}>

      <nav style={{ background: "white", borderBottom: "1px solid #EBEBEB" }} className="flex items-center justify-between px-6 sm:px-10 py-4">
        <div style={{ fontSize: "24px", fontWeight: 800, color: "#FF385C", letterSpacing: "-0.5px" }}>aqari</div>
        <div className="flex items-center gap-2">
          <Link href="/listings" style={{ fontSize: "14px", color: "#222", padding: "8px 14px", fontWeight: 500 }} className="hidden sm:block">Browse</Link>
          <Link href="/login" style={{ fontSize: "14px", color: "#222", border: "1px solid #DDDDDD", padding: "8px 20px", borderRadius: "24px", background: "white", fontWeight: 500 }}>Log in</Link>
          <Link href="/signup" style={{ fontSize: "14px", color: "white", background: "#FF385C", padding: "8px 20px", borderRadius: "24px", fontWeight: 600 }}>Sign up</Link>
        </div>
      </nav>

      <section style={{ background: "linear-gradient(180deg, #FFF0F2 0%, #FFFFFF 100%)", padding: "72px 24px 56px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#FFE0E6", color: "#C4001B", fontSize: "12px", padding: "6px 14px", borderRadius: "20px", marginBottom: "24px", fontWeight: 600, letterSpacing: "0.5px" }}>
          <svg width="12" height="12" fill="#C4001B" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
          Kuwait's Property Marketplace
        </div>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 54px)", fontWeight: 800, color: "#222222", lineHeight: 1.1, marginBottom: "16px", letterSpacing: "-1.5px" }}>
          Find your perfect<br/><span style={{ color: "#FF385C" }}>home in Kuwait</span>
        </h1>
        <p style={{ fontSize: "26px", color: "#FF385C", marginBottom: "16px", direction: "rtl", fontWeight: 600 }}>
          ابحث عن منزلك المثالي في الكويت
        </p>
        <p style={{ fontSize: "17px", color: "#717171", lineHeight: 1.6, marginBottom: "36px", maxWidth: "520px", margin: "0 auto 36px" }}>
          Browse verified properties across all governorates. Connect directly with owners and agencies via WhatsApp.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link href="/listings" style={{ background: "linear-gradient(to right, #FF385C, #E00B41)", color: "white", borderRadius: "12px", padding: "16px 32px", fontSize: "16px", fontWeight: 700, textAlign: "center" }}>Browse listings</Link>
          <Link href="/login" style={{ background: "white", color: "#222", border: "2px solid #DDDDDD", borderRadius: "12px", padding: "16px 32px", fontSize: "16px", fontWeight: 600, textAlign: "center" }}>Post a listing — free</Link>
        </div>

        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #DDDDDD", display: "flex", overflow: "hidden", maxWidth: "900px", margin: "0 auto 48px", boxShadow: "0 2px 16px rgba(0,0,0,0.08)", flexWrap: "wrap" as const }}>
          {[
            { label: "GOVERNORATE", value: govFilter, options: ["All governorates", "Capital", "Hawalli", "Farwaniya", "Ahmadi", "Jahra", "Mubarak Al-Kabeer"], setter: setGovFilter },
            { label: "AREA", value: areaFilter, options: ["Anywhere", "Salmiya", "Jabriya", "Mishref", "Hawalli", "Farwaniya", "Fahaheel"], setter: setAreaFilter },
            { label: "TYPE", value: typeFilter, options: ["For rent or sale", "For rent", "For sale"], setter: setTypeFilter },
            { label: "PROPERTY", value: propertyFilter, options: ["Any type", "Apartment", "Villa", "Floor", "Chalet", "Office", "Shop"], setter: setPropertyFilter },
          ].map((f) => (
            <div key={f.label} style={{ flex: 1, minWidth: "140px", padding: "16px 20px", borderRight: "1px solid #EBEBEB" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#222", marginBottom: "4px", letterSpacing: "0.3px" }}>{f.label}</div>
              <select value={f.value} onChange={e => f.setter(e.target.value)} style={{ background: "transparent", border: "none", color: "#717171", fontSize: "14px", width: "100%", outline: "none" }}>
                {f.options.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div style={{ padding: "8px", display: "flex", alignItems: "center" }}>
            <button onClick={handleSearch} style={{ background: "#FF385C", color: "white", border: "none", borderRadius: "12px", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/></svg>
            </button>
          </div>
        </div>

        <div className="flex justify-center gap-8 sm:gap-12 flex-wrap">
          {[{ num: "6", label: "Governorates" }, { num: "Free", label: "To list" }, { num: "Direct", label: "WhatsApp" }, { num: "Verified", label: "Listings" }].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "26px", fontWeight: 800, color: "#222" }}>{s.num}</div>
              <div style={{ fontSize: "13px", color: "#717171", marginTop: "3px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "64px 24px", background: "white" }}>
        <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#222", marginBottom: "6px", letterSpacing: "-0.5px" }}>Browse by area</h2>
            <p style={{ fontSize: "15px", color: "#717171" }}>تصفح حسب المنطقة — Select a governorate then browse areas</p>
          </div>
          <div className="flex gap-2 flex-wrap mb-6">
            {GOVERNORATES.map(g => (
              <button key={g.en} onClick={() => setActiveGov(g.en)} style={{ padding: "8px 18px", borderRadius: "24px", border: activeGov === g.en ? "1.5px solid #FF385C" : "1.5px solid #EBEBEB", background: activeGov === g.en ? "#FFF0F2" : "white", color: activeGov === g.en ? "#FF385C" : "#222", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}>
                {g.en}{g.ar ? ` · ${g.ar}` : ""}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {areas.map(area => (
              <button key={area.en} onClick={() => handleAreaClick(area.en)} style={{ background: "#FFF0F2", borderRadius: "14px", padding: "20px 16px", textAlign: "center", cursor: "pointer", border: "1.5px solid #FFD6DF" }}>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#222" }}>{area.en}</div>
                <div style={{ fontSize: "13px", color: "#FF385C", direction: "rtl", marginTop: "4px", fontWeight: 500 }}>{area.ar}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "64px 24px", background: "#F7F7F7" }}>
        <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#222", marginBottom: "6px", letterSpacing: "-0.5px" }}>Why choose Aqari?</h2>
          <p style={{ fontSize: "15px", color: "#717171" }}>لماذا تختار عقاري؟</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", title: "Verified listings", ar: "إعلانات موثقة", desc: "Every listing is reviewed before going live. No fake listings, no scams." },
            { icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", title: "Direct WhatsApp contact", ar: "تواصل مباشر عبر واتساب", desc: "One tap to message the owner or agency directly. Fast and simple." },
            { icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7", title: "Interactive map search", ar: "بحث على الخريطة", desc: "Browse listings on a live Kuwait map. See prices and locations instantly." },
          ].map(f => (
            <div key={f.title} style={{ background: "white", borderRadius: "16px", padding: "28px" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "#FFE0E6", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px" }}>
                <svg width="24" height="24" fill="none" stroke="#FF385C" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={f.icon} /></svg>
              </div>
              <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#222", marginBottom: "4px" }}>{f.title}</h3>
              <p style={{ fontSize: "13px", color: "#FF385C", direction: "rtl", marginBottom: "10px", fontWeight: 500 }}>{f.ar}</p>
              <p style={{ fontSize: "14px", color: "#717171", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
        </div>
      </section>

      <section style={{ padding: "64px 24px", background: "white" }}>
        <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#222", marginBottom: "6px", letterSpacing: "-0.5px" }}>How it works</h2>
          <p style={{ fontSize: "15px", color: "#717171" }}>كيف يعمل عقاري؟ — Three simple steps</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { num: "01", title: "Browse & filter", desc: "Search by governorate, area, price, bedrooms and property type across all of Kuwait." },
            { num: "02", title: "Contact directly", desc: "Tap once to open WhatsApp and message the owner or agency directly." },
            { num: "03", title: "Move in", desc: "Agree on terms directly and move into your new home. Simple and fast." },
          ].map(s => (
            <div key={s.num} style={{ paddingTop: "32px", borderTop: "2px solid #FF385C" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#FF385C", marginBottom: "16px" }}>{s.num}</div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#222", marginBottom: "10px" }}>{s.title}</h3>
              <p style={{ fontSize: "15px", color: "#717171", lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
        </div>
      </section>

      <section style={{ background: "linear-gradient(135deg, #FF385C 0%, #C4001B 100%)", padding: "80px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 800, color: "white", marginBottom: "8px", letterSpacing: "-0.5px" }}>Ready to find your home?</h2>
        <p style={{ fontSize: "22px", color: "rgba(255,255,255,0.85)", marginBottom: "32px", direction: "rtl", fontWeight: 600 }}>هل أنت مستعد للعثور على منزلك؟</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/listings" style={{ background: "white", color: "#FF385C", borderRadius: "12px", padding: "16px 32px", fontSize: "15px", fontWeight: 700, textAlign: "center" }}>Browse listings</Link>
          <Link href="/login" style={{ background: "transparent", color: "white", border: "2px solid rgba(255,255,255,0.5)", borderRadius: "12px", padding: "16px 32px", fontSize: "15px", fontWeight: 600, textAlign: "center" }}>Post a listing — free</Link>
        </div>
      </section>

      <footer style={{ background: "#222", padding: "28px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: "16px" }}>
        <div style={{ fontSize: "20px", fontWeight: 800, color: "#FF385C" }}>aqari</div>
        <div className="flex gap-6">
          {[["Listings", "/listings"], ["Post a listing", "/login"], ["Dashboard", "/dashboard"]].map(([label, href]) => (
            <Link key={label} href={href} style={{ fontSize: "13px", color: "#717171" }}>{label}</Link>
          ))}
        </div>
        <div style={{ fontSize: "12px", color: "#555" }}>© 2026 Aqari · Kuwait</div>
      </footer>

    </div>
  )
}
