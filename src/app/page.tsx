"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLang } from "@/lib/language-context"
import { t } from "@/lib/translations"
import { createClient } from "@/lib/supabase-browser"
import { KUWAIT_AREAS } from "@/lib/constants"
import ListingCard from "@/components/ListingCard"
import { Listing } from "@/types/listing"

const GOVERNORATES = [
  { en: "All", ar: "الكل" },
  { en: "Capital", ar: "العاصمة" },
  { en: "Hawalli", ar: "حولي" },
  { en: "Farwaniya", ar: "الفروانية" },
  { en: "Ahmadi", ar: "الأحمدي" },
  { en: "Jahra", ar: "الجهراء" },
  { en: "Mubarak", ar: "مبارك الكبير" },
]

const AREAS_BY_GOV: Record<string, { en: string; ar: string }[]> = {
  All: [
    { en: "Sharq", ar: "شرق" }, { en: "Mirqab", ar: "المرقاب" }, { en: "Salhiya", ar: "الصالحية" },
    { en: "Dasman", ar: "دسمان" }, { en: "Bneid Al-Gar", ar: "بنيد القار" }, { en: "Kaifan", ar: "كيفان" },
    { en: "Nuzha", ar: "النزهة" }, { en: "Yarmouk", ar: "اليرموك" }, { en: "Shuwaikh", ar: "الشويخ" },
    { en: "Doha", ar: "الدوحة" }, { en: "Qadsiya", ar: "القادسية" }, { en: "Faiha", ar: "الفيحاء" },
    { en: "Salmiya", ar: "السالمية" }, { en: "Jabriya", ar: "الجابرية" }, { en: "Mishref", ar: "مشرف" },
    { en: "Hawalli", ar: "حولي" }, { en: "Rumaithiya", ar: "الرميثية" }, { en: "Bayan", ar: "بيان" },
    { en: "Salwa", ar: "سلوى" }, { en: "Shaab", ar: "الشعب" }, { en: "Siddiq", ar: "الصديق" },
    { en: "Midan Hawalli", ar: "ميدان حولي" }, { en: "Farwaniya", ar: "الفروانية" }, { en: "Khaitan", ar: "خيطان" },
    { en: "Rehab", ar: "الرحاب" }, { en: "Ardiya", ar: "العارضية" }, { en: "Riggae", ar: "الرقعي" },
    { en: "Qurain", ar: "القرين" }, { en: "Omariya", ar: "العمرية" }, { en: "Ashbeliah", ar: "إشبيلية" },
    { en: "Sabah Al-Nasser", ar: "صباح الناصر" }, { en: "Abdullah Al-Mubarak", ar: "عبدالله المبارك" },
    { en: "Fahaheel", ar: "الفحيحيل" }, { en: "Fintas", ar: "الفنطاس" }, { en: "Mangaf", ar: "المنقف" },
    { en: "Mahboula", ar: "المهبولة" }, { en: "Abu Halifa", ar: "أبو حليفة" }, { en: "Ahmadi", ar: "الأحمدي" },
    { en: "Riqqa", ar: "الرقة" }, { en: "Sabahiya", ar: "الصباحية" }, { en: "Funaitis", ar: "الفنيطيس" },
    { en: "Ali Sabah Al-Salem", ar: "علي صباح السالم" }, { en: "Zour", ar: "الزور" },
    { en: "Jahra", ar: "الجهراء" }, { en: "Qasr", ar: "القصر" }, { en: "Taima", ar: "تيماء" },
    { en: "Naseem", ar: "النسيم" }, { en: "Oyoun", ar: "العيون" }, { en: "Saad Al-Abdullah", ar: "سعد العبدالله" },
    { en: "Amghara", ar: "أمغرة" }, { en: "Mutlaa", ar: "المطلاع" }, { en: "Sulaibiya", ar: "الصليبية" },
    { en: "Mubarak Al-Kabeer", ar: "مبارك الكبير" }, { en: "Adan", ar: "عدان" },
    { en: "Sabah Al-Salem", ar: "صباح السالم" }, { en: "Fnaitees", ar: "الفنيطيس" },
    { en: "Messila", ar: "المسيلة" }, { en: "Abu Ftaira", ar: "أبو فطيرة" }, { en: "Qusour", ar: "القصور" },
  ],
  Capital: [
    { en: "Sharq", ar: "شرق" }, { en: "Mirqab", ar: "المرقاب" }, { en: "Salhiya", ar: "الصالحية" },
    { en: "Dasman", ar: "دسمان" }, { en: "Bneid Al-Gar", ar: "بنيد القار" }, { en: "Kaifan", ar: "كيفان" },
    { en: "Nuzha", ar: "النزهة" }, { en: "Yarmouk", ar: "اليرموك" }, { en: "Shuwaikh", ar: "الشويخ" },
    { en: "Doha", ar: "الدوحة" }, { en: "Qadsiya", ar: "القادسية" }, { en: "Faiha", ar: "الفيحاء" },
    { en: "Shamiya", ar: "الشامية" }, { en: "Sulaibikhat", ar: "الصليبخات" }, { en: "Rai", ar: "الري" },
    { en: "Nugra", ar: "النقرة" }, { en: "Rawda", ar: "الروضة" }, { en: "Adailiya", ar: "العدلية" },
    { en: "Khaldiya", ar: "الخالدية" }, { en: "Mansouriya", ar: "المنصورية" },
  ],
  Hawalli: [
    { en: "Salmiya", ar: "السالمية" }, { en: "Jabriya", ar: "الجابرية" }, { en: "Mishref", ar: "مشرف" },
    { en: "Hawalli", ar: "حولي" }, { en: "Rumaithiya", ar: "الرميثية" }, { en: "Bayan", ar: "بيان" },
    { en: "Salwa", ar: "سلوى" }, { en: "Shaab", ar: "الشعب" }, { en: "Siddiq", ar: "الصديق" },
    { en: "Midan Hawalli", ar: "ميدان حولي" }, { en: "Hittin", ar: "حطين" }, { en: "Shuhada", ar: "الشهداء" },
    { en: "Bidaa", ar: "البدع" }, { en: "Hateen", ar: "حطين" }, { en: "Zuhor", ar: "الزهور" },
  ],
  Farwaniya: [
    { en: "Farwaniya", ar: "الفروانية" }, { en: "Khaitan", ar: "خيطان" }, { en: "Rehab", ar: "الرحاب" },
    { en: "Ardiya", ar: "العارضية" }, { en: "Riggae", ar: "الرقعي" }, { en: "Qurain", ar: "القرين" },
    { en: "Omariya", ar: "العمرية" }, { en: "Ashbeliah", ar: "إشبيلية" }, { en: "Sabah Al-Nasser", ar: "صباح الناصر" },
    { en: "Abdullah Al-Mubarak", ar: "عبدالله المبارك" }, { en: "Andalus", ar: "الأندلس" },
    { en: "Abraq Khaitan", ar: "أبرق خيطان" }, { en: "Rai", ar: "الري" }, { en: "Dajeej", ar: "الدجيج" },
  ],
  Ahmadi: [
    { en: "Fahaheel", ar: "الفحيحيل" }, { en: "Fintas", ar: "الفنطاس" }, { en: "Mangaf", ar: "المنقف" },
    { en: "Mahboula", ar: "المهبولة" }, { en: "Abu Halifa", ar: "أبو حليفة" }, { en: "Ahmadi", ar: "الأحمدي" },
    { en: "Riqqa", ar: "الرقة" }, { en: "Sabahiya", ar: "الصباحية" }, { en: "Funaitis", ar: "الفنيطيس" },
    { en: "Ali Sabah Al-Salem", ar: "علي صباح السالم" }, { en: "Zour", ar: "الزور" },
    { en: "Wafra", ar: "الوفرة" }, { en: "Khiran", ar: "الخيران" }, { en: "Nuwaiseeb", ar: "النويصيب" },
    { en: "Shuaiba", ar: "الشعيبة" }, { en: "Hadiya", ar: "هدية" }, { en: "Bnaider", ar: "البنيدر" },
  ],
  Jahra: [
    { en: "Jahra", ar: "الجهراء" }, { en: "Qasr", ar: "القصر" }, { en: "Taima", ar: "تيماء" },
    { en: "Naseem", ar: "النسيم" }, { en: "Oyoun", ar: "العيون" }, { en: "Saad Al-Abdullah", ar: "سعد العبدالله" },
    { en: "Amghara", ar: "أمغرة" }, { en: "Mutlaa", ar: "المطلاع" }, { en: "Sulaibiya", ar: "الصليبية" },
    { en: "Jahra Industrial", ar: "الجهراء الصناعية" }, { en: "Naeem", ar: "النعيم" },
    { en: "Qairawan", ar: "القيروان" },
  ],
  Mubarak: [
    { en: "Mubarak Al-Kabeer", ar: "مبارك الكبير" }, { en: "Adan", ar: "عدان" },
    { en: "Sabah Al-Salem", ar: "صباح السالم" }, { en: "Fnaitees", ar: "الفنيطيس" },
    { en: "Messila", ar: "المسيلة" }, { en: "Abu Ftaira", ar: "أبو فطيرة" },
    { en: "Qurain", ar: "القرين" }, { en: "Qusour", ar: "القصور" }, { en: "Mishrif", ar: "مشرف" },
  ],
}

export default function HomePage() {
  const router = useRouter()
  const { lang, setLang } = useLang()
  const tr = t[lang]
  const isAr = lang === "ar"

  const [activeGov, setActiveGov] = useState("All")
  const [areaFilter, setAreaFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [propertyFilter, setPropertyFilter] = useState("")
  const [user, setUser] = useState<{ name: string } | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [listings, setListings] = useState<Listing[]>([])
  const [listingTab, setListingTab] = useState<"all" | "rent" | "sale" | "short_stay">("all")
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUser({ name: data.session.user.email?.split("@")[0] ?? "" })
      }
    })
  }, [])

  useEffect(() => {
    supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(12)
      .then(({ data }) => { if (data) setListings(data as Listing[]) })
  }, [])

  // Nav scroll blur
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  // Scroll-triggered fade-in
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("_vis") }),
      { threshold: 0.12 }
    )
    document.querySelectorAll("[data-fade]").forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [activeGov, listings, listingTab])

  function handleSearch() {
    const params = new URLSearchParams()
    if (areaFilter) params.set("area", areaFilter)
    if (typeFilter) params.set("listing_type", typeFilter)
    if (propertyFilter) params.set("property_type", propertyFilter)
    router.push(`/listings?${params.toString()}`)
  }

  function handleAreaClick(area: string) {
    router.push(`/listings?area=${area}`)
  }

  const areas = AREAS_BY_GOV[activeGov] || AREAS_BY_GOV["All"]

  return (
    <>
      <style>{`
        @keyframes _fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-1 { animation: _fadeUp 0.9s cubic-bezier(.22,.68,0,1.2) both; }
        .hero-2 { animation: _fadeUp 0.9s 0.12s cubic-bezier(.22,.68,0,1.2) both; }
        .hero-3 { animation: _fadeUp 0.9s 0.24s cubic-bezier(.22,.68,0,1.2) both; }

        [data-fade] {
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }
        [data-fade]._vis { opacity: 1; transform: translateY(0); }
        [data-fade][data-d="1"] { transition-delay: 0.08s; }
        [data-fade][data-d="2"] { transition-delay: 0.16s; }
        [data-fade][data-d="3"] { transition-delay: 0.24s; }
        [data-fade][data-d="4"] { transition-delay: 0.32s; }
        [data-fade][data-d="5"] { transition-delay: 0.40s; }
        [data-fade][data-d="6"] { transition-delay: 0.48s; }
        [data-fade][data-d="7"] { transition-delay: 0.56s; }
        [data-fade][data-d="8"] { transition-delay: 0.64s; }

        .area-card:hover { background: #f7f7f7 !important; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.07) !important; }
        .area-card { transition: background 0.2s, transform 0.2s, box-shadow 0.2s; }

        .feature-card:hover { transform: translateY(-4px); box-shadow: 0 20px 48px rgba(0,0,0,0.08) !important; }
        .feature-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }

        .search-select:focus { outline: none; }
        .search-field:focus-within { background: #fafafa; }

        .gov-btn:hover { background: #f7f7f7 !important; }
      `}</style>

      <div style={{ fontFamily: isAr ? "'Segoe UI', Tahoma, Arial, sans-serif" : "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif", background: "white", color: "#1d1d1f" }}>

        {/* Sticky nav */}
        <nav style={{
          position: "sticky", top: 0, zIndex: 100,
          background: scrolled ? "rgba(255,255,255,0.85)" : "white",
          backdropFilter: scrolled ? "saturate(180%) blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "saturate(180%) blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(0,0,0,0.08)" : "1px solid #EBEBEB",
          transition: "background 0.3s, border-color 0.3s, backdrop-filter 0.3s",
        }} className="flex items-center justify-between px-6 sm:px-10 py-4">
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#FF385C", letterSpacing: "-0.5px", userSelect: "none" }}>aqari</div>
          <div className="flex items-center gap-2">
            <Link href="/listings" style={{ fontSize: "14px", color: "#1d1d1f", padding: "8px 14px", fontWeight: 500 }} className="hidden sm:block">{tr.browse}</Link>
            <button
              onClick={() => setLang(isAr ? "en" : "ar")}
              style={{ fontSize: "13px", color: "#1d1d1f", border: "1px solid #DDDDDD", padding: "7px 14px", borderRadius: "24px", background: "white", fontWeight: 600, cursor: "pointer", transition: "background 0.15s" }}
            >
              {isAr ? "English" : "العربية"}
            </button>
            {user ? (
              <>
                <span style={{ fontSize: "14px", color: "#1d1d1f", fontWeight: 500 }}>👋 {user.name}</span>
                <Link href="/dashboard" style={{ fontSize: "14px", color: "white", background: "#FF385C", padding: "8px 20px", borderRadius: "24px", fontWeight: 600 }}>
                  {isAr ? "لوحتي" : "Dashboard"}
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" style={{ fontSize: "14px", color: "#1d1d1f", border: "1px solid #DDDDDD", padding: "8px 20px", borderRadius: "24px", background: "white", fontWeight: 500 }}>{tr.login}</Link>
                <Link href="/signup" style={{ fontSize: "14px", color: "white", background: "#FF385C", padding: "8px 20px", borderRadius: "24px", fontWeight: 600 }}>{tr.signup}</Link>
              </>
            )}
          </div>
        </nav>

        {/* Hero */}
        <section style={{ minHeight: "88vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px 64px", textAlign: "center", background: "white" }}>

          {/* Eyebrow label */}
          <div className="hero-1" style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#FFF0F2", color: "#C4001B", fontSize: "12px", padding: "6px 16px", borderRadius: "20px", marginBottom: "28px", fontWeight: 700, letterSpacing: "0.6px", textTransform: "uppercase" }}>
            <svg width="10" height="10" fill="#C4001B" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
            {tr.badge}
          </div>

          {/* Headline */}
          <h1 className="hero-2" style={{ fontSize: "clamp(40px, 7vw, 72px)", fontWeight: 800, color: "#1d1d1f", lineHeight: 1.05, marginBottom: "20px", letterSpacing: "-2px", maxWidth: "820px" }}>
            {tr.heroTitle}<br />
            <span style={{ color: "#FF385C" }}>{tr.heroTitleRed}</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-2" style={{ fontSize: "clamp(15px, 2vw, 19px)", color: "#6e6e73", lineHeight: 1.6, marginBottom: "48px", maxWidth: "480px" }}>
            {tr.heroDesc}
          </p>

          {/* Search bar */}
          <div className="hero-3" style={{ width: "100%", maxWidth: "860px" }}>
            <div style={{ background: "white", borderRadius: "20px", border: "1px solid #DDDDDD", display: "flex", overflow: "hidden", boxShadow: "0 4px 32px rgba(0,0,0,0.10)", flexWrap: "wrap" }}>
              {[
                { label: tr.area, value: areaFilter, options: [tr.anywhere, ...KUWAIT_AREAS], onChange: setAreaFilter },
                { label: tr.type, value: typeFilter, options: [tr.forRentOrSale, tr.forRent, tr.forSale, tr.shortStay], onChange: setTypeFilter },
                { label: tr.property, value: propertyFilter, options: [tr.anyType, tr.apartment, tr.villa, tr.floor, tr.chalet, tr.office, tr.shop], onChange: setPropertyFilter },
              ].map((f, i) => (
                <div key={f.label} className="search-field" style={{ flex: 1, minWidth: "140px", padding: "18px 22px", borderRight: "1px solid #EBEBEB", cursor: "text", transition: "background 0.15s" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#1d1d1f", marginBottom: "5px", letterSpacing: "0.4px" }}>{f.label}</div>
                  <select className="search-select" value={f.value} onChange={e => f.onChange(e.target.value)} style={{ background: "transparent", border: "none", color: "#6e6e73", fontSize: "14px", width: "100%", cursor: "pointer" }}>
                    {f.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div style={{ padding: "10px", display: "flex", alignItems: "center" }}>
                <button onClick={handleSearch} style={{ background: "#FF385C", color: "white", border: "none", borderRadius: "14px", width: "52px", height: "52px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 16px rgba(255,56,92,0.35)", transition: "transform 0.15s, box-shadow 0.15s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.06)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(255,56,92,0.45)" }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(255,56,92,0.35)" }}
                >
                  <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/></svg>
                </button>
              </div>
            </div>

            {/* Quick links */}
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "20px", flexWrap: "wrap" }}>
              {[
                { label: isAr ? "شقق للإيجار" : "Apartments for rent", params: "listing_type=rent&property_type=apartment" },
                { label: isAr ? "فلل للبيع" : "Villas for sale", params: "listing_type=sale&property_type=villa" },
                { label: isAr ? "إقامة قصيرة" : "Short stays", params: "listing_type=short_stay" },
              ].map(q => (
                <button key={q.label} onClick={() => router.push(`/listings?${q.params}`)}
                  style={{ fontSize: "13px", color: "#6e6e73", border: "1px solid #E5E5EA", padding: "7px 16px", borderRadius: "20px", background: "white", cursor: "pointer", transition: "border-color 0.15s, color 0.15s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#FF385C"; (e.currentTarget as HTMLButtonElement).style.color = "#FF385C" }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#E5E5EA"; (e.currentTarget as HTMLButtonElement).style.color = "#6e6e73" }}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Stat strip */}
        <section style={{ background: "#F5F5F7", padding: "48px 40px" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0", textAlign: "center" }}>
            {[
              { num: isAr ? "مجاني" : "Free", label: isAr ? "نشر إعلانك بالكامل" : "To post your listing" },
              { num: isAr ? "مباشر" : "Direct", label: isAr ? "تواصل مع المالك مباشرة" : "Contact the owner directly" },
              { num: isAr ? "موثّق" : "Verified", label: isAr ? "إعلانات مراجعة يدوياً" : "Listings reviewed by us" },
            ].map((s, i) => (
              <div key={s.label} data-fade data-d={String(i + 1)} style={{ padding: "8px 24px", borderRight: i < 2 ? "1px solid #DADADD" : "none" }}>
                <div style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, color: "#1d1d1f", letterSpacing: "-1px" }}>{s.num}</div>
                <div style={{ fontSize: "14px", color: "#6e6e73", marginTop: "4px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent listings */}
        <section style={{ padding: "96px 40px", background: "white" }}>
          <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
            <div data-fade style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "36px" }}>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "#FF385C", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "12px" }}>{isAr ? "أحدث الإعلانات" : "Latest listings"}</p>
                <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "#1d1d1f", letterSpacing: "-1px" }}>
                  {isAr ? "إعلانات حديثة" : "Recently listed"}
                </h2>
              </div>
              <Link href="/listings" style={{ fontSize: "15px", color: "#FF385C", fontWeight: 600, border: "1.5px solid #FFD6DF", padding: "10px 24px", borderRadius: "24px", whiteSpace: "nowrap" }}>
                {isAr ? "عرض الكل →" : "View all →"}
              </Link>
            </div>

            {/* Type filter tabs */}
            <div data-fade data-d="1" className="flex gap-2 flex-wrap mb-8">
              {([
                { key: "all",        en: "All",        ar: "الكل" },
                { key: "rent",       en: "For Rent",   ar: "للإيجار" },
                { key: "sale",       en: "For Sale",   ar: "للبيع" },
                { key: "short_stay", en: "Short Stay", ar: "إقامة قصيرة" },
              ] as const).map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setListingTab(tab.key)}
                  style={{
                    padding: "9px 20px", borderRadius: "24px",
                    border: listingTab === tab.key ? "1.5px solid #FF385C" : "1.5px solid #E5E5EA",
                    background: listingTab === tab.key ? "#FFF0F2" : "white",
                    color: listingTab === tab.key ? "#FF385C" : "#1d1d1f",
                    fontSize: "14px", fontWeight: 500, cursor: "pointer",
                    transition: "border-color 0.2s, background 0.2s, color 0.2s",
                  }}
                >
                  {isAr ? tab.ar : tab.en}
                </button>
              ))}
            </div>

            {/* Cards grid */}
            {listings.length === 0 ? (
              <div data-fade style={{ textAlign: "center", padding: "64px 0", color: "#AEAEB2", fontSize: "15px" }}>
                {isAr ? "جاري التحميل..." : "Loading..."}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" }}>
                {listings
                  .filter(l => listingTab === "all" || l.listing_type === listingTab)
                  .slice(0, 8)
                  .map((l, i) => (
                    <div key={l.id} data-fade data-d={String(Math.min(i + 1, 8))}>
                      <ListingCard listing={l} />
                    </div>
                  ))}
              </div>
            )}
          </div>
        </section>

        {/* Browse by area */}
        <section style={{ padding: "96px 40px", background: "white" }}>
          <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
            <div data-fade style={{ marginBottom: "40px" }}>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#FF385C", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "12px" }}>{isAr ? "استكشف" : "Explore"}</p>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "#1d1d1f", marginBottom: "8px", letterSpacing: "-1px" }}>{tr.browseByArea}</h2>
              <p style={{ fontSize: "16px", color: "#6e6e73" }}>{tr.browseByAreaSub}</p>
            </div>

            {/* Governorate tabs */}
            <div data-fade data-d="1" className="flex gap-2 flex-wrap mb-8">
              {GOVERNORATES.map(g => (
                <button
                  key={g.en}
                  onClick={() => setActiveGov(g.en)}
                  className="gov-btn"
                  style={{
                    padding: "9px 20px", borderRadius: "24px",
                    border: activeGov === g.en ? "1.5px solid #FF385C" : "1.5px solid #E5E5EA",
                    background: activeGov === g.en ? "#FFF0F2" : "white",
                    color: activeGov === g.en ? "#FF385C" : "#1d1d1f",
                    fontSize: "14px", fontWeight: 500, cursor: "pointer",
                    transition: "border-color 0.2s, background 0.2s, color 0.2s",
                  }}
                >
                  {isAr ? g.ar : g.en}
                </button>
              ))}
            </div>

            {/* Area cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px" }}>
              {areas.slice(0, 8).map((area, i) => (
                <button
                  key={area.en}
                  data-fade
                  data-d={String(Math.min(i + 1, 8))}
                  onClick={() => handleAreaClick(area.en)}
                  className="area-card"
                  style={{ background: "white", borderRadius: "16px", padding: "22px 18px", textAlign: isAr ? "right" : "left", cursor: "pointer", border: "1px solid #E5E5EA", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                >
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#FFF0F2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                    <svg width="16" height="16" fill="none" stroke="#FF385C" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "#1d1d1f" }}>{isAr ? area.ar : area.en}</div>
                  <div style={{ fontSize: "12px", color: "#AEAEB2", marginTop: "3px" }}>{isAr ? area.en : area.ar}</div>
                </button>
              ))}
            </div>

            <div data-fade style={{ textAlign: "center", marginTop: "36px" }}>
              <Link href="/listings" style={{ fontSize: "15px", color: "#FF385C", fontWeight: 600, textDecoration: "none", border: "1.5px solid #FFD6DF", padding: "12px 28px", borderRadius: "24px", transition: "background 0.15s", display: "inline-block" }}>
                {isAr ? "عرض جميع المناطق ←" : "View all areas →"}
              </Link>
            </div>
          </div>
        </section>

        {/* Why Aqari */}
        <section style={{ padding: "96px 40px", background: "#F5F5F7" }}>
          <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
            <div data-fade style={{ marginBottom: "56px", textAlign: "center" }}>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#FF385C", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "12px" }}>{isAr ? "لماذا عقاري" : "Why Aqari"}</p>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "#1d1d1f", letterSpacing: "-1px" }}>{tr.whyAqari}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                {
                  icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                  title: tr.verified1, desc: tr.verified1Desc,
                },
                {
                  icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
                  title: tr.whatsapp, desc: tr.whatsappDesc,
                },
                {
                  icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
                  title: tr.map, desc: tr.mapDesc,
                },
              ].map((f, i) => (
                <div key={f.title} data-fade data-d={String(i + 1)} className="feature-card" style={{ background: "white", borderRadius: "20px", padding: "36px 32px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                  <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "#FFF0F2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                    <svg width="26" height="26" fill="none" stroke="#FF385C" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                    </svg>
                  </div>
                  <h3 style={{ fontSize: "19px", fontWeight: 700, color: "#1d1d1f", marginBottom: "12px", letterSpacing: "-0.3px" }}>{f.title}</h3>
                  <p style={{ fontSize: "15px", color: "#6e6e73", lineHeight: 1.65 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section style={{ padding: "96px 40px", background: "white" }}>
          <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
            <div data-fade style={{ marginBottom: "64px", textAlign: "center" }}>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#FF385C", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "12px" }}>{isAr ? "كيف يعمل" : "How it works"}</p>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "#1d1d1f", letterSpacing: "-1px" }}>{tr.howItWorks}</h2>
              <p style={{ fontSize: "16px", color: "#6e6e73", marginTop: "10px" }}>{tr.howItWorksSub}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { num: "01", title: tr.step1, desc: tr.step1Desc },
                { num: "02", title: tr.step2, desc: tr.step2Desc },
                { num: "03", title: tr.step3, desc: tr.step3Desc },
              ].map((s, i) => (
                <div key={s.num} data-fade data-d={String(i + 1)}>
                  <div style={{ fontSize: "clamp(48px, 6vw, 72px)", fontWeight: 800, color: "#FF385C", lineHeight: 1, marginBottom: "20px", letterSpacing: "-2px", opacity: 0.18 }}>
                    {s.num}
                  </div>
                  <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#1d1d1f", marginBottom: "12px", letterSpacing: "-0.3px" }}>{s.title}</h3>
                  <p style={{ fontSize: "15px", color: "#6e6e73", lineHeight: 1.65 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section data-fade style={{ margin: "0 24px 24px", borderRadius: "28px", background: "linear-gradient(135deg, #FF385C 0%, #C4001B 100%)", padding: "80px 48px", textAlign: "center", overflow: "hidden", position: "relative" }}>
          {/* Decorative circles */}
          <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "260px", height: "260px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-80px", left: "-40px", width: "320px", height: "320px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

          <h2 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, color: "white", marginBottom: "12px", letterSpacing: "-1px", position: "relative" }}>
            {tr.ctaTitle}
          </h2>
          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.75)", marginBottom: "40px", position: "relative" }}>
            {isAr ? "ابدأ اليوم — مجانًا تمامًا" : "Get started today — completely free"}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center" style={{ position: "relative" }}>
            <Link href="/listings" style={{ background: "white", color: "#FF385C", borderRadius: "14px", padding: "16px 36px", fontSize: "15px", fontWeight: 700, textAlign: "center", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
              {tr.ctaBtn1}
            </Link>
            <Link href="/listings/new" style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: "14px", padding: "16px 36px", fontSize: "15px", fontWeight: 600, textAlign: "center", backdropFilter: "blur(8px)" }}>
              {tr.ctaBtn2}
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ padding: "40px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ fontSize: "20px", fontWeight: 800, color: "#FF385C" }}>aqari</div>
          <div className="flex gap-6">
            {([[tr.browseListing, "/listings"], [tr.postListing, "/listings/new"], [tr.myListings, "/dashboard"]] as [string, string][]).map(([label, href]) => (
              <Link key={label} href={href} style={{ fontSize: "13px", color: "#AEAEB2", transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#1d1d1f")}
                onMouseLeave={e => (e.currentTarget.style.color = "#AEAEB2")}
              >{label}</Link>
            ))}
          </div>
          <div style={{ fontSize: "12px", color: "#C7C7CC" }}>© 2026 Aqari · Kuwait</div>
        </footer>

      </div>
    </>
  )
}
