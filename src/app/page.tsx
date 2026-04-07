import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <div className="text-xl font-semibold tracking-tight">
          aq<span className="text-emerald-600">a</span>ri
        </div>
        <div className="flex items-center gap-6">
          <Link href="/listings" className="text-sm text-gray-500 hover:text-gray-800">Browse listings</Link>
          <Link href="/login" className="text-sm bg-emerald-600 text-white px-4 py-1.5 rounded-full hover:bg-emerald-700 transition-colors">
            Post a listing
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-emerald-50 px-6 py-20 text-center">
        <span className="inline-block bg-white text-emerald-700 text-xs px-3 py-1 rounded-full border border-emerald-200 mb-6">
          Kuwait's property marketplace · سوق العقارات في الكويت
        </span>
        <h1 className="text-4xl font-semibold text-emerald-900 leading-tight mb-3">
          Find your next home in Kuwait
        </h1>
        <p className="text-xl text-emerald-700 mb-2" dir="rtl">
          ابحث عن منزلك القادم في الكويت
        </p>
        <p className="text-sm text-emerald-600 mb-8 max-w-md mx-auto">
          Browse apartments, villas, and more — for rent or sale across all governorates.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/listings" className="bg-emerald-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
            Browse listings
          </Link>
          <Link href="/login" className="bg-white text-emerald-700 border border-emerald-300 px-6 py-3 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-colors">
            Post a listing
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="flex justify-center gap-16 py-10 bg-white border-b border-gray-100">
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-900">500+</p>
          <p className="text-xs text-gray-400 mt-1">Active listings</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-900">6</p>
          <p className="text-xs text-gray-400 mt-1">Governorates</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-900">Free</p>
          <p className="text-xs text-gray-400 mt-1">To list your property</p>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 bg-white">
        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-1">Why Aqari?</h2>
        <p className="text-center text-emerald-600 mb-10 text-sm" dir="rtl">لماذا عقاري؟</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            {
              title: "Verified listings",
              ar: "إعلانات موثقة",
              desc: "Every listing is reviewed for accuracy and legitimacy.",
            },
            {
              title: "WhatsApp contact",
              ar: "تواصل عبر واتساب",
              desc: "Connect directly with landlords via WhatsApp instantly.",
            },
            {
              title: "All of Kuwait",
              ar: "كل الكويت",
              desc: "Listings across all 6 governorates and popular areas.",
            },
          ].map((f) => (
            <div key={f.title} className="bg-gray-50 rounded-xl p-5">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg mb-3" />
              <h3 className="text-sm font-medium text-gray-900 mb-0.5">{f.title}</h3>
              <p className="text-xs text-emerald-600 mb-2" dir="rtl">{f.ar}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 bg-gray-50">
        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-1">How it works</h2>
        <p className="text-center text-emerald-600 mb-10 text-sm" dir="rtl">كيف يعمل؟</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { num: "1", title: "Browse listings", desc: "Filter by area, type, price and bedrooms." },
            { num: "2", title: "Contact the landlord", desc: "Reach out directly via WhatsApp with one tap." },
            { num: "3", title: "Move in", desc: "Agree on terms and move into your new home." },
          ].map((s) => (
            <div key={s.num} className="text-center p-6">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-medium mx-auto mb-3">
                {s.num}
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">{s.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-900 px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold text-white mb-2">Ready to list your property?</h2>
        <p className="text-emerald-400 text-sm mb-8" dir="rtl">هل أنت مستعد لنشر عقارك؟</p>
        <div className="flex gap-3 justify-center">
          <Link href="/login" className="bg-white text-emerald-900 px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
            Post a listing — it's free
          </Link>
          <Link href="/listings" className="border border-emerald-500 text-white px-6 py-3 rounded-lg text-sm hover:bg-emerald-800 transition-colors">
            Browse listings
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-gray-400 border-t border-gray-100">
        © 2026 Aqari · getaqari.com · Kuwait
      </footer>

    </div>
  )
}
