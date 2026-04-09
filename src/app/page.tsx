"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLang } from "@/lib/language-context"
import { t } from "@/lib/translations"
import { createClient } from "@/lib/supabase-browser"

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
  const [govFilter, setGovFilter] = useState("")
  const [areaFilter, setAreaFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [propertyFilter, setPropertyFilter] = useState("")
  const [user, setUser] = useState<{ name: string } | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUser({ name: data.session.user.email?.split("@")[0] ?? "" })
      }
    })
  }, [])

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
    <div style={{ fontFamily: isAr ? "'Segoe UI', Tahoma, Arial, sans-serif" : "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "white" }}>

      {/* Nav */}
      <nav style={{ background: "white", borderBottom: "1px solid #EBEBEB" }} className="flex items-center justify-between px-6 sm:px-10 py-4">
        <div style={{ fontSize: "24px", fontWeight: 800, color: "#FF385C", letterSpacing: "-0.5px" }}>aqari</div>
        <div className="flex items-center gap-2">
          <Link href="/listings" style={{ fontSize: "14px", color: "#222", padding: "8px 14px", fontWeight: 500 }} className="hidden sm:block">{tr.browse}</Link>
          <button
            onClick={() => setLang(isAr ? "en" : "ar")}
            style={{ fontSize: "13px", color: "#222", border: "1px solid #DDDDDD", padding: "7px 14px", borderRadius: "24px", background: "white", fontWeight: 600, cursor: "pointer" }}
          >
            {isAr ? "English" : "العربية"}
          </button>
          {user ? (
            <>
              <span style={{ fontSize: "14px", color: "#222", fontWeight: 500 }}>
                👋 {user.name}
              </span>
              <Link href="/dashboard" style={{ fontSize: "14px", color: "white", background: "#FF385C", padding: "8px 20px", borderRadius: "24px", fontWeight: 600 }}>
                {isAr ? "لوحتي" : "Dashboard"}
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" style={{ fontSize: "14px", color: "#222", border: "1px solid #DDDDDD", padding: "8px 20px", borderRadius: "24px", background: "white", fontWeight: 500 }}>{tr.login}</Link>
              <Link href="/signup" style={{ fontSize: "14px", color: "white", background: "#FF385C", padding: "8px 20px", borderRadius: "24px", fontWeight: 600 }}>{tr.signup}</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: "linear-gradient(180deg, #FFF0F2 0%, #FFFFFF 100%)", padding: "72px 40px 56px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#FFE0E6", color: "#C4001B", fontSize: "12px", padding: "6px 14px", borderRadius: "20px", marginBottom: "24px", fontWeight: 600, letterSpacing: "0.5px" }}>
          <svg width="12" height="12" fill="#C4001B" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
          {tr.badge}
        </div>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 54px)", fontWeight: 800, color: "#222222", lineHeight: 1.1, marginBottom: "16px", letterSpacing: "-1.5px" }}>
          {tr.heroTitle}<br /><span style={{ color: "#FF385C" }}>{tr.heroTitleRed}</span>
        </h1>
        <p style={{ fontSize: "17px", color: "#717171", lineHeight: 1.6, marginBottom: "36px", maxWidth: "520px", margin: "0 auto 36px" }}>
          {tr.heroDesc}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link href="/listings" style={{ background: "linear-gradient(to right, #FF385C, #E00B41)", color: "white", borderRadius: "12px", padding: "16px 32px", fontSize: "16px", fontWeight: 700, textAlign: "center" }}>
            {tr.browseBtn}
          </Link>
          <Link href="/listings/new" style={{ background: "white", color: "#222", border: "2px solid #DDDDDD", borderRadius: "12px", padding: "16px 32px", fontSize: "16px", fontWeight: 600, textAlign: "center" }}>
            {tr.postBtn}
          </Link>
        </div>

        {/* Search bar */}
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #DDDDDD", display: "flex", overflow: "hidden", maxWidth: "900px", margin: "0 auto 48px", boxShadow: "0 2px 16px rgba(0,0,0,0.08)", flexWrap: "wrap" }}>
          {[
            { label: tr.governorate, value: govFilter, options: [tr.allGovernorates, ...GOVERNORATES.filter(g => g.en !== "All").map(g => isAr ? g.ar : g.en)], onChange: setGovFilter },
            { label: tr.area, value: areaFilter, options: [tr.anywhere, ...AREAS_BY_GOV["All"].map(a => isAr ? a.ar : a.en)], onChange: setAreaFilter },
            { label: tr.type, value: typeFilter, options: [tr.forRentOrSale, tr.forRent, tr.forSale, tr.shortStay], onChange: setTypeFilter },
            { label: tr.property, value: propertyFilter, options: [tr.anyType, tr.apartment, tr.villa, tr.floor, tr.chalet, tr.office, tr.shop], onChange: setPropertyFilter },
          ].map((f) => (
            <div key={f.label} style={{ flex: 1, minWidth: "140px", padding: "16px 20px", borderRight: "1px solid #EBEBEB" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#222", marginBottom: "4px", letterSpacing: "0.3px" }}>{f.label}</div>
              <select value={f.value} onChange={e => f.onChange(e.target.value)} style={{ background: "transparent", border: "none", color: "#717171", fontSize: "14px", width: "100%", outline: "none" }}>
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
      </section>

      {/* Browse by area */}
      <section style={{ padding: "64px 40px", background: "white" }}>
        <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#222", marginBottom: "6px", letterSpacing: "-0.5px" }}>{tr.browseByArea}</h2>
            <p style={{ fontSize: "15px", color: "#717171" }}>{tr.browseByAreaSub}</p>
          </div>

          <div className="flex gap-2 flex-wrap mb-6">
            {GOVERNORATES.map(g => (
              <button
                key={g.en}
                onClick={() => setActiveGov(g.en)}
                style={{
                  padding: "8px 18px", borderRadius: "24px",
                  border: activeGov === g.en ? "1.5px solid #FF385C" : "1.5px solid #EBEBEB",
                  background: activeGov === g.en ? "#FFF0F2" : "white",
                  color: activeGov === g.en ? "#FF385C" : "#222",
                  fontSize: "14px", fontWeight: 500, cursor: "pointer",
                }}
              >
                {isAr ? g.ar : g.en}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {areas.slice(0, 8).map(area => (
              <button
                key={area.en}
                onClick={() => handleAreaClick(area.en)}
                style={{ background: "#FFF0F2", borderRadius: "14px", padding: "20px 16px", textAlign: "center", cursor: "pointer", border: "1.5px solid #FFD6DF" }}
              >
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#222" }}>{isAr ? area.ar : area.en}</div>
                <div style={{ fontSize: "13px", color: "#FF385C", marginTop: "4px", fontWeight: 500 }}>{isAr ? area.en : area.ar}</div>
              </button>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <Link href="/listings" style={{ fontSize: "14px", color: "#FF385C", fontWeight: 600, textDecoration: "none", border: "1.5px solid #FFD6DF", padding: "10px 24px", borderRadius: "24px" }}>
              {isAr ? "عرض جميع المناطق ←" : "View all areas →"}
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "64px 40px", background: "#F7F7F7" }}>
        <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
          <div style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#222", marginBottom: "6px", letterSpacing: "-0.5px" }}>{tr.whyAqari}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", title: tr.verified1, desc: tr.verified1Desc },
              { icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", title: tr.whatsapp, desc: tr.whatsappDesc },
              { icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7", title: tr.map, desc: tr.mapDesc },
            ].map(f => (
              <div key={f.title} style={{ background: "white", borderRadius: "16px", padding: "28px" }}>
                <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "#FFE0E6", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px" }}>
                  <svg width="24" height="24" fill="none" stroke="#FF385C" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                  </svg>
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#222", marginBottom: "10px" }}>{f.title}</h3>
                <p style={{ fontSize: "14px", color: "#717171", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "64px 40px", background: "white" }}>
        <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
          <div style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#222", marginBottom: "6px", letterSpacing: "-0.5px" }}>{tr.howItWorks}</h2>
            <p style={{ fontSize: "15px", color: "#717171" }}>{tr.howItWorksSub}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { num: "01", title: tr.step1, desc: tr.step1Desc },
              { num: "02", title: tr.step2, desc: tr.step2Desc },
              { num: "03", title: tr.step3, desc: tr.step3Desc },
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

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg, #FF385C 0%, #C4001B 100%)", padding: "80px 40px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 800, color: "white", marginBottom: "32px", letterSpacing: "-0.5px" }}>
          {tr.ctaTitle}
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/listings" style={{ background: "white", color: "#FF385C", borderRadius: "12px", padding: "16px 32px", fontSize: "15px", fontWeight: 700, textAlign: "center" }}>
            {tr.ctaBtn1}
          </Link>
          <Link href="/listings/new" style={{ background: "transparent", color: "white", border: "2px solid rgba(255,255,255,0.5)", borderRadius: "12px", padding: "16px 32px", fontSize: "15px", fontWeight: 600, textAlign: "center" }}>
            {tr.ctaBtn2}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#222", padding: "28px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ fontSize: "20px", fontWeight: 800, color: "#FF385C" }}>aqari</div>
        <div className="flex gap-6">
          {([[tr.browseListing, "/listings"], [tr.postListing, "/listings/new"], [tr.myListings, "/dashboard"]] as [string, string][]).map(([label, href]) => (
            <Link key={label} href={href} style={{ fontSize: "13px", color: "#717171" }}>{label}</Link>
          ))}
        </div>
        <div style={{ fontSize: "12px", color: "#555" }}>© 2026 Aqari · Kuwait</div>
      </footer>

    </div>
  )
}
