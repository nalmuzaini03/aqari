"use client"
import { useState } from "react"
import { useLang } from "@/lib/language-context"
import { t } from "@/lib/translations"

type Props = {
  listingId: string
  phoneNumber: string
  title: string
  pricePerNight: number
}

export default function ShortStayBooking({ phoneNumber, title, pricePerNight }: Props) {
  const { lang } = useLang()
  const tr = t[lang]
  const isAr = lang === "ar"

  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")

  const nights = checkIn && checkOut
    ? Math.max(0, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
    : 0

  const total = nights * pricePerNight
  const today = new Date().toISOString().split("T")[0]
  const currency = isAr ? "د.ك" : "KWD"
  const nightLabel = isAr ? "ليلة" : nights !== 1 ? "nights" : "night"

  function handleWhatsApp() {
    const number = phoneNumber.replace(/\D/g, "")
    const message = checkIn && checkOut
      ? isAr
        ? `مرحباً، أود حجز "${title}" من ${checkIn} إلى ${checkOut} (${nights} ${nightLabel}). هل هو متاح؟`
        : `Hi, I'd like to book "${title}" from ${checkIn} to ${checkOut} (${nights} ${nightLabel}). Is it available?`
      : isAr
        ? `مرحباً، أنا مهتم بإعلانك: ${title}`
        : `Hi, I'm interested in your listing: ${title}`
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank")
  }

  return (
    <div style={{ border: "1px solid #EBEBEB", borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
      <p style={{ fontSize: "13px", color: "#717171", fontWeight: 600, letterSpacing: "0.5px", marginBottom: "16px" }}>
        {tr.selectDates}
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div style={{ border: "1px solid #DDDDDD", borderRadius: "8px", padding: "12px 16px" }}>
          <p style={{ fontSize: "10px", fontWeight: 700, color: "#222", letterSpacing: "0.5px", marginBottom: "4px" }}>{tr.checkIn}</p>
          <input
            type="date"
            value={checkIn}
            min={today}
            onChange={e => {
              setCheckIn(e.target.value)
              if (checkOut && e.target.value >= checkOut) setCheckOut("")
            }}
            style={{ border: "none", outline: "none", fontSize: "14px", color: "#222", width: "100%", background: "transparent" }}
          />
        </div>
        <div style={{ border: "1px solid #DDDDDD", borderRadius: "8px", padding: "12px 16px" }}>
          <p style={{ fontSize: "10px", fontWeight: 700, color: "#222", letterSpacing: "0.5px", marginBottom: "4px" }}>{tr.checkOut}</p>
          <input
            type="date"
            value={checkOut}
            min={checkIn || today}
            onChange={e => setCheckOut(e.target.value)}
            style={{ border: "none", outline: "none", fontSize: "14px", color: "#222", width: "100%", background: "transparent" }}
          />
        </div>
      </div>

      {/* Price breakdown */}
      {nights > 0 && (
        <div style={{ background: "#F7F7F7", borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
          <div className="flex justify-between mb-2">
            <p style={{ fontSize: "14px", color: "#222" }}>
              {isAr
                ? `${pricePerNight} ${currency} × ${nights} ${nightLabel}`
                : `${pricePerNight} ${currency} × ${nights} ${nightLabel}`}
            </p>
            <p style={{ fontSize: "14px", color: "#222" }}>{total.toLocaleString()} {currency}</p>
          </div>
          <div style={{ borderTop: "1px solid #EBEBEB", paddingTop: "12px", marginTop: "8px" }} className="flex justify-between">
            <p style={{ fontSize: "15px", fontWeight: 700, color: "#222" }}>{tr.total}</p>
            <p style={{ fontSize: "15px", fontWeight: 700, color: "#222" }}>{total.toLocaleString()} {currency}</p>
          </div>
        </div>
      )}

      {/* WhatsApp button */}
      <button
        onClick={handleWhatsApp}
        style={{ background: "#25D366", color: "white", border: "none", borderRadius: "12px", width: "100%", padding: "16px", fontSize: "15px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
      >
        <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
        </svg>
        {checkIn && checkOut ? tr.requestBooking : tr.contactWhatsApp}
      </button>

      {checkIn && checkOut && (
        <p style={{ fontSize: "12px", color: "#717171", textAlign: "center", marginTop: "10px" }}>
          {tr.datesNote}
        </p>
      )}
    </div>
  )
}
