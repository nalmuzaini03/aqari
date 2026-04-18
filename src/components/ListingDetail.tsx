"use client"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useLang } from "@/lib/language-context"
import { t } from "@/lib/translations"
import DeleteButton from "@/components/DeleteButton"
import WhatsAppButton from "@/components/WhatsAppButton"
import ShortStayBooking from "@/components/ShortStayBooking"

type Listing = {
  id: string
  title: string
  title_ar: string | null
  title_en: string | null
  area: string
  price: number
  price_per_night: number | null
  listing_type: string
  is_verified: boolean
  bedrooms: number | null
  bathrooms: number | null
  property_type: string
  description: string | null
  description_ar: string | null
  description_en: string | null
  photos: string[]
  amenities: string[]
  size_sqm: number | null
  phone_number: string
}

const AMENITIES = [
  { key: "furnished", en: "Furnished", ar: "مفروش" },
  { key: "parking", en: "Parking", ar: "موقف سيارة" },
  { key: "pool", en: "Pool", ar: "مسبح" },
  { key: "gym", en: "Gym", ar: "صالة رياضية" },
  { key: "balcony", en: "Balcony", ar: "شرفة" },
  { key: "elevator", en: "Elevator", ar: "مصعد" },
  { key: "security", en: "Security", ar: "حراسة" },
  { key: "maid_room", en: "Maid's Room", ar: "غرفة خادمة" },
  { key: "storage", en: "Storage", ar: "مستودع" },
  { key: "central_ac", en: "Central A/C", ar: "تكييف مركزي" },
  { key: "sea_view", en: "Sea View", ar: "إطلالة بحرية" },
  { key: "bbq", en: "BBQ Area", ar: "منطقة شواء" },
  { key: "garden", en: "Garden", ar: "حديقة" },
  { key: "driver_room", en: "Driver's Room", ar: "غرفة سائق" },
  { key: "internet", en: "Internet", ar: "إنترنت" },
  { key: "solar", en: "Solar Panels", ar: "ألواح شمسية" },
]

const AREA_AR: Record<string, string> = {
  "Abdulla Al-Salem": "عبدالله السالم", "Adailiya": "العدلية", "Bnaid Al-Qar": "بنيد القار",
  "Daiya": "الدعية", "Dasma": "الدسمة", "Doha": "الدوحة",
  "Faiha": "الفيحاء", "Granada": "غرناطة", "Jibla": "جبلة",
  "Kaifan": "كيفان", "Khaldiya": "الخالدية", "Mansouriya": "المنصورية",
  "Mirqab": "المرقاب", "Nahdha": "النهضة", "Nuzha": "النزهة",
  "Qadsiya": "القادسية", "Qortuba": "قرطبة", "Rawda": "الروضة",
  "Shamiya": "الشامية", "Sharq": "شرق", "Shuwaikh": "الشويخ",
  "Sulaibikhat": "الصليبخات", "Qairawan": "القيروان", "Surra": "السرة",
  "Yarmouk": "اليرموك", "Anjafa": "العنجفة", "Bayan": "بيان", "Bidaa": "البدع",
  "Hawalli": "حولي", "Hitteen": "حطين", "Jabriya": "الجابرية",
  "Mishrif": "مشرف", "Mubarak Al-Abdullah": "مبارك العبدالله", "Rumaithiya": "الرميثية",
  "Salam": "السلام", "Salmiya": "السالمية", "Salwa": "سلوى",
  "Shaab": "الشعب", "Shuhada": "الشهداء", "Siddiq": "الصديق", "Zahra": "الزهراء",
  "Abdullah Al-Mubarak": "عبدالله المبارك", "Abraq Khaitan": "أبرق خيطان",
  "Andalus": "الأندلس", "Ardiya": "العارضية", "Ashbeliah": "إشبيلية",
  "Dajeej": "الدجيج", "Farwaniya": "الفروانية", "Jleeb Al-Shuyoukh": "جليب الشيوخ",
  "Khaitan": "خيطان", "Omariya": "العمرية", "Qurain": "القرين",
  "Rai": "الري", "Rehab": "الرحاب", "Riggae": "الرقعي", "Sabah Al-Nasser": "صباح الناصر",
  "Abu Halifa": "أبو حليفة", "Ahmadi": "الأحمدي", "Ali Sabah Al-Salem": "علي صباح السالم",
  "Bnaider": "البنيدر", "Fahaheel": "الفحيحيل", "Fintas": "الفنطاس",
  "Funaitis": "الفنيطيس", "Hadiya": "هدية", "Khiran": "الخيران",
  "Mahboula": "المهبولة", "Mangaf": "المنقف", "Nuwaiseeb": "النويصيب",
  "Riqqa": "الرقة", "Sabahiya": "الصباحية", "Sabah Al-Ahmed Sea City": "مدينة صباح الأحمد البحرية",
  "Shuaiba": "الشعيبة", "Wafra": "الوفرة", "Zour": "الزور",
  "Amghara": "أمغرة", "Jahra": "الجهراء", "Mutlaa": "المطلاع",
  "Naeem": "النعيم", "Naseem": "النسيم", "Oyoun": "العيون",
  "Qasr": "القصر", "Saad Al-Abdullah": "سعد العبدالله", "Sulaibiya": "الصليبية", "Taima": "تيماء",
  "Abu Al Hasaniya": "أبو الحصانية", "Abu Ftaira": "أبو فطيرة", "Adan": "عدان",
  "Fnaitees": "الفنيطيس", "Masayel": "المسايل", "Messila": "المسيلة",
  "Mubarak Al-Kabeer": "مبارك الكبير", "Qusour": "القصور", "Sabah Al-Salem": "صباح السالم",
}

function PhotoGallery({ photos, title }: { photos: string[], title: string }) {
  const [current, setCurrent] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lbZoom, setLbZoom] = useState(1)
  const [panX, setPanX] = useState(0)
  const [panY, setPanY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const lightboxRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null)
  const swipeTouchStartRef = useRef<number | null>(null)
  const pinchStartDistRef = useRef<number | null>(null)
  const pinchStartZoomRef = useRef(1)

  function prev() { setCurrent(i => (i - 1 + photos.length) % photos.length) }
  function next() { setCurrent(i => (i + 1) % photos.length) }

  function onTouchStart(e: React.TouchEvent) {
    setTouchStart(e.touches[0].clientX)
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStart === null) return
    const diff = touchStart - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev()
    setTouchStart(null)
  }

  const resetView = () => { setLbZoom(1); setPanX(0); setPanY(0) }

  const openLightbox = () => { setLightboxOpen(true); resetView() }
  const closeLightbox = () => { setLightboxOpen(false); resetView() }

  const lbNext = () => { setCurrent(i => (i + 1) % photos.length); resetView() }
  const lbPrev = () => { setCurrent(i => (i - 1 + photos.length) % photos.length); resetView() }

  // Keyboard + body scroll lock
  useEffect(() => {
    if (!lightboxOpen) return
    document.body.style.overflow = "hidden"
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox()
      else if (e.key === "ArrowRight") { setCurrent(i => (i + 1) % photos.length); resetView() }
      else if (e.key === "ArrowLeft") { setCurrent(i => (i - 1 + photos.length) % photos.length); resetView() }
    }
    window.addEventListener("keydown", handler)
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handler) }
  }, [lightboxOpen, photos.length])

  // Non-passive wheel + touchmove to prevent page scroll inside lightbox
  useEffect(() => {
    const el = lightboxRef.current
    if (!el) return
    const stopWheel = (e: WheelEvent) => {
      e.preventDefault()
      setLbZoom(z => {
        const next = Math.min(5, Math.max(1, z * (1 - e.deltaY * 0.002)))
        if (next <= 1) { setPanX(0); setPanY(0) }
        return next
      })
    }
    const stopTouchMove = (e: TouchEvent) => e.preventDefault()
    el.addEventListener("wheel", stopWheel, { passive: false })
    el.addEventListener("touchmove", stopTouchMove, { passive: false })
    return () => { el.removeEventListener("wheel", stopWheel); el.removeEventListener("touchmove", stopTouchMove) }
  }, [lightboxOpen])

  // Mouse drag handlers
  const onLbMouseDown = (e: React.MouseEvent) => {
    if (lbZoom <= 1) return
    setIsDragging(true)
    dragStartRef.current = { x: e.clientX, y: e.clientY, panX, panY }
  }
  const onLbMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStartRef.current) return
    setPanX(dragStartRef.current.panX + (e.clientX - dragStartRef.current.x))
    setPanY(dragStartRef.current.panY + (e.clientY - dragStartRef.current.y))
  }
  const onLbMouseUp = () => { setIsDragging(false); dragStartRef.current = null }

  // Double click to toggle zoom
  const onLbDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (lbZoom > 1) { resetView() } else { setLbZoom(2.5) }
  }

  // Touch: pinch zoom + swipe navigation
  const onLbTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      pinchStartDistRef.current = Math.sqrt(dx * dx + dy * dy)
      pinchStartZoomRef.current = lbZoom
    } else if (e.touches.length === 1) {
      swipeTouchStartRef.current = e.touches[0].clientX
      if (lbZoom > 1) dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, panX, panY }
    }
  }
  const onLbTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStartDistRef.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const newZoom = Math.min(5, Math.max(1, pinchStartZoomRef.current * (dist / pinchStartDistRef.current)))
      setLbZoom(newZoom)
      if (newZoom <= 1) { setPanX(0); setPanY(0) }
    } else if (e.touches.length === 1 && dragStartRef.current && lbZoom > 1) {
      setPanX(dragStartRef.current.panX + (e.touches[0].clientX - dragStartRef.current.x))
      setPanY(dragStartRef.current.panY + (e.touches[0].clientY - dragStartRef.current.y))
    }
  }
  const onLbTouchEnd = (e: React.TouchEvent) => {
    pinchStartDistRef.current = null
    if (lbZoom <= 1 && swipeTouchStartRef.current !== null && e.changedTouches.length > 0) {
      const dx = e.changedTouches[0].clientX - swipeTouchStartRef.current
      if (Math.abs(dx) > 50) { if (dx < 0) lbNext(); else lbPrev() }
    }
    swipeTouchStartRef.current = null
    dragStartRef.current = null
  }

  if (photos.length === 1) {
    return (
      <>
        <div style={{ borderRadius: "16px", overflow: "hidden", marginBottom: "24px", cursor: "zoom-in" }} onClick={openLightbox}>
          <img src={photos[0]} alt={title} className="w-full object-cover" style={{ height: "320px" }} />
        </div>

        {lightboxOpen && (
          <div ref={lightboxRef} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.96)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <button onClick={closeLightbox} style={{ position: "absolute", top: "16px", right: "16px", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: "44px", height: "44px", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            <div
              style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", cursor: lbZoom > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in" }}
              onMouseDown={onLbMouseDown} onMouseMove={onLbMouseMove} onMouseUp={onLbMouseUp} onMouseLeave={onLbMouseUp}
              onTouchStart={onLbTouchStart} onTouchMove={onLbTouchMove} onTouchEnd={onLbTouchEnd}
              onDoubleClick={onLbDoubleClick}
            >
              <img src={photos[0]} alt={title} draggable={false} style={{ maxWidth: "92vw", maxHeight: "92vh", objectFit: "contain", transform: `translate(${panX}px, ${panY}px) scale(${lbZoom})`, transition: isDragging ? "none" : "transform 0.15s ease", userSelect: "none", pointerEvents: "none", display: "block" }} />
            </div>
            {lbZoom > 1 && <div style={{ position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.8)", fontSize: "12px", background: "rgba(0,0,0,0.5)", padding: "4px 12px", borderRadius: "12px", userSelect: "none" }}>{Math.round(lbZoom * 100)}%</div>}
          </div>
        )}
      </>
    )
  }

  return (
    <>
      <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", marginBottom: "24px" }}>
        {/* Main image */}
        <div
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          style={{ position: "relative", height: "320px", background: "#F7F7F7", cursor: "zoom-in" }}
          onClick={openLightbox}
        >
          <img
            src={photos[current]}
            alt={`${title} ${current + 1}`}
            className="w-full h-full object-cover"
            style={{ transition: "opacity 0.2s", pointerEvents: "none" }}
          />

          {/* Counter */}
          <div style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(0,0,0,0.5)", color: "white", fontSize: "12px", fontWeight: 600, padding: "4px 10px", borderRadius: "20px" }}>
            {current + 1} / {photos.length}
          </div>

          {/* Left arrow */}
          <button
            onClick={e => { e.stopPropagation(); prev() }}
            style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", background: "white", border: "none", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
          >
            <svg width="16" height="16" fill="none" stroke="#222" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>

          {/* Right arrow */}
          <button
            onClick={e => { e.stopPropagation(); next() }}
            style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "white", border: "none", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
          >
            <svg width="16" height="16" fill="none" stroke="#222" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        {/* Dot indicators */}
        <div style={{ display: "flex", justifyContent: "center", gap: "6px", padding: "12px 0", background: "white" }}>
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{ width: i === current ? "20px" : "8px", height: "8px", borderRadius: "99px", background: i === current ? "#FF385C" : "#DDDDDD", border: "none", cursor: "pointer", transition: "all 0.2s", padding: 0 }}
            />
          ))}
        </div>

        {/* Thumbnail strip */}
        {photos.length > 1 && (
          <div style={{ display: "flex", gap: "6px", padding: "0 0 12px", overflowX: "auto", scrollbarWidth: "none" }}>
            {photos.map((url, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{ flexShrink: 0, width: "72px", height: "56px", borderRadius: "8px", overflow: "hidden", border: i === current ? "2px solid #FF385C" : "2px solid transparent", padding: 0, cursor: "pointer" }}
              >
                <img src={url} alt={`thumb ${i}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          ref={lightboxRef}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.96)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={e => { if (e.target === e.currentTarget) closeLightbox() }}
        >
          {/* Close */}
          <button onClick={closeLightbox} style={{ position: "absolute", top: "16px", right: "16px", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: "44px", height: "44px", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>

          {/* Counter */}
          <div style={{ position: "absolute", top: "16px", left: "50%", transform: "translateX(-50%)", color: "white", fontSize: "13px", fontWeight: 600, background: "rgba(0,0,0,0.5)", padding: "4px 14px", borderRadius: "20px", userSelect: "none", whiteSpace: "nowrap" }}>
            {current + 1} / {photos.length}
          </div>

          {/* Prev */}
          <button onClick={lbPrev} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: "48px", height: "48px", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          </button>

          {/* Next */}
          <button onClick={lbNext} style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: "48px", height: "48px", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
          </button>

          {/* Image area */}
          <div
            style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", cursor: lbZoom > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in" }}
            onMouseDown={onLbMouseDown} onMouseMove={onLbMouseMove} onMouseUp={onLbMouseUp} onMouseLeave={onLbMouseUp}
            onTouchStart={onLbTouchStart} onTouchMove={onLbTouchMove} onTouchEnd={onLbTouchEnd}
            onDoubleClick={onLbDoubleClick}
          >
            <img
              src={photos[current]}
              alt={`${title} ${current + 1}`}
              draggable={false}
              style={{
                maxWidth: "92vw",
                maxHeight: "92vh",
                objectFit: "contain",
                transform: `translate(${panX}px, ${panY}px) scale(${lbZoom})`,
                transition: isDragging ? "none" : "transform 0.15s ease",
                userSelect: "none",
                pointerEvents: "none",
                display: "block",
              }}
            />
          </div>

          {/* Zoom % + hint */}
          <div style={{ position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.6)", fontSize: "12px", background: "rgba(0,0,0,0.4)", padding: "5px 14px", borderRadius: "12px", userSelect: "none", whiteSpace: "nowrap" }}>
            {lbZoom > 1 ? `${Math.round(lbZoom * 100)}%` : "scroll or pinch to zoom · double-click to zoom"}
          </div>
        </div>
      )}
    </>
  )
}

export default function ListingDetail({ listing }: { listing: Listing }) {
  const { lang, setLang } = useLang()
  const tr = t[lang]
  const isAr = lang === "ar"

  const badgeBg = listing.listing_type === "rent" ? "#FF385C" : listing.listing_type === "short_stay" ? "#7C3AED" : "#222"
  const badgeLabel = listing.listing_type === "rent" ? tr.forRentBadge : listing.listing_type === "short_stay" ? tr.shortStayBadge : tr.forSaleBadge

  const whatsappNumber = listing.phone_number.replace(/\D/g, "")
  const listingUrl = `https://getaqari.com/listings/${listing.id}`

  const whatsappMessage = isAr
    ? `السلام عليكم 👋\n\nأنا مهتم بإعلانك على *عقاري*:\n\n🏠 *${listing.title_ar || listing.title}*\n📍 ${AREA_AR[listing.area] ?? listing.area}\n💰 ${listing.listing_type === "short_stay" ? `${(listing.price_per_night ?? listing.price).toLocaleString()} د.ك / ليلة` : `${listing.price.toLocaleString()} د.ك${listing.listing_type === "rent" ? " / شهر" : ""}`}\n\n🔗 ${listingUrl}`
    : `Hello 👋\n\nI'm interested in your listing on *Aqari*:\n\n🏠 *${listing.title_en || listing.title}*\n📍 ${listing.area}\n💰 ${listing.listing_type === "short_stay" ? `${(listing.price_per_night ?? listing.price).toLocaleString()} KWD / night` : `${listing.price.toLocaleString()} KWD${listing.listing_type === "rent" ? " / month" : ""}`}\n\n🔗 ${listingUrl}`

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <div style={{ background: "white", minHeight: "100vh" }}>

      {/* Nav */}
      <nav style={{ background: "white", borderBottom: "1px solid #EBEBEB" }} className="flex items-center justify-between px-6 sm:px-10 py-4">
        <Link href="/" style={{ fontSize: "22px", fontWeight: 800, color: "#FF385C", letterSpacing: "-0.5px", textDecoration: "none" }}>aqari</Link>
        <div className="flex items-center gap-2">
          <button onClick={() => setLang(isAr ? "en" : "ar")}
            style={{ fontSize: "13px", color: "#222", border: "1px solid #DDDDDD", padding: "7px 14px", borderRadius: "24px", background: "white", fontWeight: 600, cursor: "pointer" }}>
            {isAr ? "English" : "العربية"}
          </button>
          <Link href="/listings" style={{ fontSize: "14px", color: "#222", border: "1px solid #DDDDDD", padding: "8px 20px", borderRadius: "24px", fontWeight: 500 }}>
            {tr.browseListing}
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Back + Delete */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/listings" style={{ color: "#717171", fontSize: "14px", textDecoration: "none" }} className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {tr.backToListings}
          </Link>
          <DeleteButton listingId={listing.id} />
        </div>

        {/* Photo Gallery */}
        {listing.photos && listing.photos.length > 0 ? (
          <PhotoGallery photos={listing.photos} title={listing.title} />
        ) : (
          <div style={{ background: "#F7F7F7", border: "1px solid #EBEBEB", borderRadius: "16px" }} className="w-full h-56 flex items-center justify-center mb-6">
            <svg className="w-12 h-12" style={{ color: "#DDDDDD" }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            </svg>
          </div>
        )}

        {/* Main info card */}
        <div style={{ border: "1px solid #EBEBEB", borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span style={{ background: badgeBg, color: "white", fontSize: "11px", letterSpacing: "0.5px", fontWeight: 600 }} className="px-2 py-0.5 rounded-md uppercase">
                  {badgeLabel}
                </span>
                {listing.is_verified && (
                  <span style={{ background: "white", color: "#222", fontSize: "11px", fontWeight: 600, border: "1px solid #EBEBEB" }} className="px-2 py-0.5 rounded-md">
                    {tr.verifiedBadge}
                  </span>
                )}
              </div>
              <h1 style={{ fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 700, color: "#222", lineHeight: 1.2 }}>
                {isAr ? (listing.title_ar || listing.title) : (listing.title_en || listing.title)}
              </h1>
              <p style={{ fontSize: "14px", color: "#717171" }} className="mt-2 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"/>
                </svg>
                {isAr ? (AREA_AR[listing.area] ?? listing.area) : listing.area}
              </p>
            </div>
            <div className="text-right shrink-0">
              {listing.listing_type === "short_stay" ? (
                <>
                  <p style={{ fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 700, color: "#222" }}>{(listing.price_per_night ?? listing.price).toLocaleString()} {isAr ? "د.ك" : "KWD"}</p>
                  <p style={{ fontSize: "13px", color: "#717171" }}>{tr.perNight}</p>
                </>
              ) : (
                <>
                  <p style={{ fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 700, color: "#222" }}>{listing.price.toLocaleString()} {isAr ? "د.ك" : "KWD"}</p>
                  {listing.listing_type === "rent" && <p style={{ fontSize: "13px", color: "#717171" }}>{tr.perMonth}</p>}
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {listing.bedrooms !== null && (
              <div style={{ background: "#F7F7F7", borderRadius: "12px", border: "1px solid #EBEBEB", padding: "12px 8px", textAlign: "center" }}>
                <p style={{ fontSize: "18px", fontWeight: 700, color: "#222" }}>{listing.bedrooms === 0 ? tr.studio : listing.bedrooms}</p>
                <p style={{ fontSize: "10px", color: "#717171", letterSpacing: "0.3px", marginTop: "2px" }}>{tr.bedroomsLabel}</p>
              </div>
            )}
            {listing.bathrooms !== null && (
              <div style={{ background: "#F7F7F7", borderRadius: "12px", border: "1px solid #EBEBEB", padding: "12px 8px", textAlign: "center" }}>
                <p style={{ fontSize: "18px", fontWeight: 700, color: "#222" }}>{listing.bathrooms}</p>
                <p style={{ fontSize: "10px", color: "#717171", letterSpacing: "0.3px", marginTop: "2px" }}>{tr.bathroomsLabel}</p>
              </div>
            )}
            <div style={{ background: "#F7F7F7", borderRadius: "12px", border: "1px solid #EBEBEB", padding: "12px 8px", textAlign: "center" }}>
              <p style={{ fontSize: "14px", fontWeight: 700, color: "#222", wordBreak: "break-word" as const }}>
                {isAr ? ({
                  apartment: "شقة", villa: "فيلا", floor: "طابق", building: "عمارة",
                  chalet: "شاليه", office: "مكتب", shop: "محل", land: "أرض"
                }[listing.property_type] ?? listing.property_type) : listing.property_type.charAt(0).toUpperCase() + listing.property_type.slice(1)}
              </p>
              <p style={{ fontSize: "10px", color: "#717171", letterSpacing: "0.3px", marginTop: "2px" }}>{tr.typeLabel}</p>
            </div>
            {listing.size_sqm && (
              <div style={{ background: "#F7F7F7", borderRadius: "12px", border: "1px solid #EBEBEB", padding: "12px 8px", textAlign: "center" }}>
                <p style={{ fontSize: "18px", fontWeight: 700, color: "#222" }}>{listing.size_sqm}</p>
                <p style={{ fontSize: "10px", color: "#717171", letterSpacing: "0.3px", marginTop: "2px" }}>{isAr ? "م²" : "SQM"}</p>
              </div>
            )}
          </div>

          {/* Description */}
          {listing.description && (
            <div style={{ borderTop: "1px solid #EBEBEB" }} className="pt-5">
              <p style={{ fontSize: "11px", color: "#717171", letterSpacing: "0.5px", fontWeight: 600 }} className="mb-2">{tr.descriptionLabel}</p>
              <p style={{ fontSize: "15px", color: "#222", lineHeight: 1.7 }}>
                {isAr ? (listing.description_ar || listing.description) : (listing.description_en || listing.description)}
              </p>
            </div>
          )}

          {/* Amenities */}
          {listing.amenities && listing.amenities.length > 0 && (
            <div style={{ borderTop: "1px solid #EBEBEB" }} className="pt-5">
              <p style={{ fontSize: "11px", color: "#717171", letterSpacing: "0.5px", fontWeight: 600 }} className="mb-3">
                {isAr ? "المرافق والمميزات" : "AMENITIES"}
              </p>
              <div className="flex flex-wrap gap-2">
                {listing.amenities.map((key: string) => {
                  const amenity = AMENITIES.find(a => a.key === key)
                  if (!amenity) return null
                  return (
                    <span key={key} style={{ background: "#FFF0F2", color: "#FF385C", border: "1px solid #FFD6DF", borderRadius: "24px", padding: "6px 14px", fontSize: "13px", fontWeight: 500 }}>
                      {isAr ? amenity.ar : amenity.en}
                    </span>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Booking or WhatsApp */}
        {listing.listing_type === "short_stay" ? (
          <ShortStayBooking
            listingId={listing.id}
            phoneNumber={listing.phone_number}
            title={listing.title}
            pricePerNight={listing.price_per_night ?? listing.price}
          />
        ) : (
          <WhatsAppButton listingId={listing.id} whatsappLink={whatsappLink} phoneNumber={listing.phone_number} />
        )}
      </div>
    </div>
  )
}
