import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FAF8F4", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* Nav */}
      <nav style={{ background: "#FAF8F4", borderBottom: "1px solid #E8E0D0" }} className="flex items-center justify-between px-6 sm:px-12 py-5">
        <div style={{ fontFamily: "Georgia, serif", fontSize: "22px", color: "#1C3829", letterSpacing: "3px", fontWeight: "400" }}>
          AQ<span style={{ color: "#2D6A4F" }}>A</span>RI
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/listings" style={{ color: "#5C5240", fontSize: "13px", letterSpacing: "0.3px" }} className="hidden sm:block px-3 py-2">Browse</Link>
          <Link href="/login" style={{ color: "#2D6A4F", border: "1.5px solid #2D6A4F", fontSize: "13px", letterSpacing: "0.3px" }} className="px-4 py-2 rounded">
            Log in
          </Link>
          <Link href="/signup" style={{ background: "#1C3829", color: "#FAF8F4", fontSize: "13px", letterSpacing: "0.3px" }} className="px-4 py-2 rounded font-medium">
            Sign up free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: "#1C3829" }} className="px-6 sm:px-12 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <div style={{ color: "#A8D5B5", fontSize: "11px", letterSpacing: "2.5px" }} className="mb-6 uppercase">
            Kuwait's Property Marketplace
          </div>
          <h1 style={{ fontFamily: "Georgia, serif", color: "#FAF8F4", fontSize: "clamp(36px, 5vw, 54px)", lineHeight: "1.08", letterSpacing: "-1px", fontWeight: "400" }} className="mb-4">
            Find your perfect<br /><em style={{ color: "#A8D5B5" }}>home in Kuwait</em>
          </h1>
          <p style={{ color: "#6BA882", fontSize: "20px", direction: "rtl", fontFamily: "-apple-system, sans-serif" }} className="mb-5">
            ابحث عن منزلك المثالي في الكويت
          </p>
          <p style={{ color: "#8FB89A", fontSize: "16px", lineHeight: "1.7" }} className="mb-8 max-w-md">
            Browse verified properties across all governorates. Connect directly with owners via WhatsApp — no hidden fees.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/listings" style={{ background: "#FAF8F4", color: "#1C3829", fontSize: "14px", letterSpacing: "0.3px" }} className="px-7 py-3.5 rounded font-medium text-center">
              Browse listings
            </Link>
            <Link href="/login" style={{ color: "#A8D5B5", border: "1.5px solid #3D6B54", fontSize: "14px" }} className="px-7 py-3.5 rounded text-center">
              Post a listing — free
            </Link>
          </div>
        </div>

        {/* Search widget */}
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px" }} className="p-6 sm:p-8">
          <div style={{ color: "#6BA882", fontSize: "11px", letterSpacing: "2px" }} className="mb-5 uppercase">Find a property</div>
          {[
            { icon: "M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z", label: "All areas", options: ["All areas", "Salmiya", "Jabriya", "Mishref", "Hawalli", "Farwaniya", "Ahmadi"] },
            { icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z", label: "Listing type", options: ["For rent", "For sale"] },
            { icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", label: "Property type", options: ["Property type", "Apartment", "Villa", "Floor", "Chalet"] },
            { icon: "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4", label: "Bedrooms", options: ["Bedrooms", "Studio", "1", "2", "3", "4+"] },
          ].map((field, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px" }} className="flex items-center gap-3 px-4 py-3.5 mb-2.5">
              <svg className="w-4 h-4 flex-shrink-0" style={{ color: "#6BA882" }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={field.icon} />
              </svg>
              <select style={{ background: "transparent", border: "none", color: "#A8D5B5", fontSize: "14px", width: "100%", outline: "none" }}>
                {field.options.map(o => <option key={o} style={{ background: "#1C3829" }}>{o}</option>)}
              </select>
            </div>
          ))}
          <Link href="/listings" style={{ background: "#2D6A4F", color: "#FAF8F4", fontSize: "14px", letterSpacing: "0.5px", display: "block", textAlign: "center" }} className="w-full py-3.5 rounded font-medium mt-1">
            Search properties →
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: "#F2EDE4", borderBottom: "1px solid #E8E0D0" }} className="flex divide-x divide-[#D4C9B5]">
        {[
          { num: "6", label: "Governorates" },
          { num: "Free", label: "To list your property" },
          { num: "Direct", label: "WhatsApp contact" },
          { num: "Verified", label: "Listings only" },
        ].map(s => (
          <div key={s.label} className="flex-1 text-center py-6 px-2">
            <p style={{ fontFamily: "Georgia, serif", fontSize: "24px", color: "#1C3829" }}>{s.num}</p>
            <p style={{ fontSize: "11px", color: "#8C7B65", letterSpacing: "0.5px", marginTop: "4px" }}>{s.label}</p>
          </div>
        ))}
      </section>

      {/* Features */}
      <section style={{ background: "#FAF8F4" }} className="px-6 sm:px-12 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px, 4vw, 36px)", color: "#1C3829", fontWeight: "400", letterSpacing: "-0.5px" }} className="mb-2">
              Why Aqari?
            </h2>
            <p style={{ fontSize: "14px", color: "#8C7B65" }}>لماذا تختار عقاري؟ — The smarter way to find property in Kuwait</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { num: "01", title: "Verified listings", ar: "إعلانات موثقة", desc: "Every listing is reviewed before going live. No fake listings, no scams, no wasted time." },
              { num: "02", title: "Direct WhatsApp contact", ar: "تواصل مباشر عبر واتساب", desc: "One tap to message the owner or agent directly. No forms, no waiting, no hidden fees." },
              { num: "03", title: "Interactive map search", ar: "بحث على الخريطة", desc: "Browse listings on a live Kuwait map. See prices and locations at a glance." },
            ].map(f => (
              <div key={f.num} style={{ background: "#FAF8F4", border: "1px solid #E8E0D0", borderRadius: "8px" }} className="p-8">
                <div style={{ fontFamily: "Georgia, serif", fontSize: "36px", color: "#D4C9B5", lineHeight: "1" }} className="mb-5">{f.num}</div>
                <h3 style={{ fontSize: "16px", fontWeight: "500", color: "#1C3829" }} className="mb-1">{f.title}</h3>
                <p style={{ fontSize: "13px", color: "#2D6A4F", direction: "rtl" }} className="mb-3">{f.ar}</p>
                <p style={{ fontSize: "14px", color: "#6B5F50", lineHeight: "1.6" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: "#F2EDE4" }} className="px-6 sm:px-12 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px, 4vw, 36px)", color: "#1C3829", fontWeight: "400", letterSpacing: "-0.5px" }} className="mb-2">
              How it works
            </h2>
            <p style={{ fontSize: "14px", color: "#8C7B65" }}>كيف يعمل عقاري؟</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0.5" style={{ background: "#E8E0D0", borderRadius: "8px", overflow: "hidden" }}>
            {[
              { num: "01", title: "Browse & filter", desc: "Search by area, price, bedrooms, and property type across all governorates of Kuwait." },
              { num: "02", title: "Contact directly", desc: "Tap once to open WhatsApp and message the owner or agency directly — no waiting." },
              { num: "03", title: "Move in", desc: "Agree on terms and move into your new home. Simple, fast, transparent." },
            ].map(s => (
              <div key={s.num} style={{ background: "#F2EDE4" }} className="p-8 sm:p-10">
                <div style={{ fontFamily: "Georgia, serif", fontSize: "48px", color: "#D4C9B5", lineHeight: "1" }} className="mb-5">{s.num}</div>
                <h3 style={{ fontSize: "16px", fontWeight: "500", color: "#1C3829" }} className="mb-3">{s.title}</h3>
                <p style={{ fontSize: "14px", color: "#6B5F50", lineHeight: "1.6" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#2D6A4F" }} className="px-6 sm:px-12 py-16 sm:py-20 text-center">
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px, 4vw, 40px)", color: "#FAF8F4", fontWeight: "400", letterSpacing: "-0.5px" }} className="mb-2">
          Ready to find your home?
        </h2>
        <p style={{ color: "#A8D5B5", fontSize: "20px", direction: "rtl" }} className="mb-10">
          هل أنت مستعد للعثور على منزلك؟
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/listings" style={{ background: "#FAF8F4", color: "#1C3829", fontSize: "14px" }} className="px-8 py-3.5 rounded font-medium text-center">
            Browse listings
          </Link>
          <Link href="/login" style={{ color: "#A8D5B5", border: "1.5px solid #3D6B54", fontSize: "14px" }} className="px-8 py-3.5 rounded text-center">
            Post a listing — free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#111D16" }} className="px-6 sm:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div style={{ fontFamily: "Georgia, serif", fontSize: "16px", color: "#A8D5B5", letterSpacing: "3px" }}>AQARI</div>
        <div className="flex gap-6">
          {[["Browse", "/listings"], ["Post a listing", "/login"], ["Dashboard", "/dashboard"]].map(([label, href]) => (
            <Link key={label} href={href} style={{ fontSize: "12px", color: "#4A6B55", letterSpacing: "0.5px" }}>{label}</Link>
          ))}
        </div>
        <div style={{ fontSize: "12px", color: "#3D5445" }}>© 2026 Aqari · Kuwait</div>
      </footer>

    </div>
  )
}
