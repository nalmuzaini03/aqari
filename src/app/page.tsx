import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Nav */}
      <nav style={{ background: "#0F7A5F" }} className="flex items-center justify-between px-10 py-5">
        <div className="text-2xl font-semibold tracking-tight" style={{ color: "white" }}>
          aq<span style={{ color: "#7FEDD0" }}>a</span>ri
        </div>
        <div className="flex items-center gap-6">
          <Link href="/listings" style={{ color: "#B2F0DC" }} className="text-base">Browse listings</Link>
          <Link href="/login" style={{ background: "#7FEDD0", color: "#0A5C46" }} className="text-sm font-medium px-5 py-2.5 rounded-full">
            Post a listing
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: "#0D6B52" }} className="px-10 py-20 text-center">
        <span style={{ background: "#0F7A5F", color: "#7FEDD0", border: "1px solid #1D9E75" }} className="inline-block text-sm px-4 py-1.5 rounded-full mb-6">
          Kuwait's property marketplace · سوق العقارات في الكويت
        </span>
        <h1 style={{ color: "#E8FFF8" }} className="text-5xl font-semibold leading-tight mb-4">
          Find your next<br />home in Kuwait
        </h1>
        <p style={{ color: "#7FEDD0" }} className="text-3xl mb-5" dir="rtl">
          ابحث عن منزلك القادم في الكويت
        </p>
        <p style={{ color: "#B2F0DC" }} className="text-lg mb-10 max-w-lg mx-auto leading-relaxed">
          Browse apartments, villas, and more — for rent or sale across all governorates.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/listings" style={{ background: "#7FEDD0", color: "#0A5C46" }} className="px-8 py-4 rounded-xl text-base font-medium">
            Browse listings
          </Link>
          <Link href="/login" style={{ color: "#7FEDD0", border: "2px solid #1D9E75" }} className="px-8 py-4 rounded-xl text-base">
            Post a listing
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "#1D9E75" }} className="flex justify-center">
        {[
          { num: "500+", label: "Active listings" },
          { num: "6", label: "Governorates" },
          { num: "Free", label: "To list your property" },
        ].map((s, i) => (
          <div key={s.num} style={{ borderRight: i < 2 ? "1px solid rgba(255,255,255,0.2)" : "none" }} className="text-center px-16 py-7">
            <p className="text-3xl font-semibold text-white">{s.num}</p>
            <p style={{ color: "#B2F0DC" }} className="text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Features */}
      <section style={{ background: "#E8F8F3" }} className="px-10 py-16">
        <h2 style={{ color: "#0A5C46" }} className="text-4xl font-semibold text-center mb-2">Why Aqari?</h2>
        <p style={{ color: "#1D9E75" }} className="text-xl text-center mb-12" dir="rtl">لماذا عقاري؟</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {[
            { title: "Verified listings", ar: "إعلانات موثقة", desc: "Every listing is reviewed to ensure accuracy and legitimacy before going live." },
            { title: "WhatsApp contact", ar: "تواصل عبر واتساب", desc: "Connect directly with landlords via WhatsApp instantly with one tap." },
            { title: "All of Kuwait", ar: "كل الكويت", desc: "Listings across all 6 governorates and the most popular areas." },
          ].map((f) => (
            <div key={f.title} style={{ background: "#C8F5E8", border: "1px solid #9FE1CB" }} className="rounded-2xl p-7">
              <div style={{ background: "#1D9E75" }} className="w-12 h-12 rounded-xl mb-4" />
              <h3 style={{ color: "#0A5C46" }} className="text-lg font-medium mb-1">{f.title}</h3>
              <p style={{ color: "#0F7A5F" }} className="text-sm mb-2" dir="rtl">{f.ar}</p>
              <p style={{ color: "#2D7A5F" }} className="text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: "#D0F5E8" }} className="px-10 py-16">
        <h2 style={{ color: "#0A5C46" }} className="text-4xl font-semibold text-center mb-2">How it works</h2>
        <p style={{ color: "#1D9E75" }} className="text-xl text-center mb-12" dir="rtl">كيف يعمل؟</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {[
            { num: "1", title: "Browse listings", desc: "Filter by area, type, price and bedrooms to find your perfect match." },
            { num: "2", title: "Contact the landlord", desc: "Reach out directly via WhatsApp with one tap — no middleman." },
            { num: "3", title: "Move in", desc: "Agree on terms directly and move into your new home." },
          ].map((s) => (
            <div key={s.num} style={{ background: "#B2F0DC", border: "1px solid #7FEDD0" }} className="rounded-2xl p-8 text-center">
              <div style={{ background: "#0F7A5F", color: "white" }} className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-medium mx-auto mb-4">
                {s.num}
              </div>
              <h3 style={{ color: "#0A5C46" }} className="text-lg font-medium mb-2">{s.title}</h3>
              <p style={{ color: "#2D7A5F" }} className="text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#0A5C46" }} className="px-10 py-16 text-center">
        <h2 style={{ color: "#E8FFF8" }} className="text-4xl font-semibold mb-2">Ready to list your property?</h2>
        <p style={{ color: "#7FEDD0" }} className="text-2xl mb-10" dir="rtl">هل أنت مستعد لنشر عقارك؟</p>
        <div className="flex gap-4 justify-center">
          <Link href="/login" style={{ background: "#7FEDD0", color: "#0A5C46" }} className="px-8 py-4 rounded-xl text-base font-medium">
            Post a listing — it's free
          </Link>
          <Link href="/listings" style={{ color: "#7FEDD0", border: "2px solid #1D9E75" }} className="px-8 py-4 rounded-xl text-base">
            Browse listings
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#073D2E", color: "#7FEDD0" }} className="py-6 text-center text-sm">
        © 2026 Aqari · getaqari.com · Kuwait
      </footer>

    </div>
  )
}
