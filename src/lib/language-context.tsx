"use client"
import { createContext, useContext, useEffect, useState } from "react"

type Lang = "en" | "ar"

const LanguageContext = createContext<{
  lang: Lang
  setLang: (l: Lang) => void
}>({ lang: "en", setLang: () => {} })

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en")

  useEffect(() => {
    const saved = localStorage.getItem("aqari-lang") as Lang
    if (saved === "ar" || saved === "en") setLangState(saved)
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem("aqari-lang", l)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      <div dir={lang === "ar" ? "rtl" : "ltr"} style={{ fontFamily: lang === "ar" ? "'Segoe UI', Tahoma, Arial, sans-serif" : "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        {children}
      </div>
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
