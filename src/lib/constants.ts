export const KUWAIT_AREAS = [
  // Capital (العاصمة)
  "Sharq", "Mirqab", "Salhiya", "Dasman", "Bneid Al-Gar", "Kaifan",
  "Mansouriya", "Nuzha", "Faiha", "Rawda", "Adailiya", "Qadsiya",
  "Shamiya", "Shuwaikh", "Abdullah Al-Salem", "Yarmouk", "Sulaibikhat",
  "Doha", "Rai", "Qibla", "Jibla", "Murqab",

  // Hawalli (حولي)
  "Salmiya", "Jabriya", "Rumaithiya", "Bayan", "Mishref", "Hawalli",
  "Salwa", "Shaab", "Siddiq", "Maidan Hawalli", "Hittin", "Shuhada",
  "Qadsiya", "Nugra", "Anjafa", "Hateen",

  // Farwaniya (الفروانية)
  "Farwaniya", "Khaitan", "Ashbeliah", "Rehab", "Sabah Al-Nasser",
  "Ardiya", "Rai", "Riggae", "Abdullah Mubarak", "Omariya",
  "Firdous", "Andalous", "Ishbiliya", "Rihab", "Qurain", "Qusour",

  // Ahmadi (الأحمدي)
  "Fintas", "Mangaf", "Abu Halifa", "Fahaheel", "Mahboula", "Ahmadi",
  "Riqqa", "Ali Sabah Al-Salem", "Sabahiya", "Zour", "Wafra",
  "Hadiya", "Fahad Al-Ahmad", "Salim", "Miqwa", "Jaber Al-Ali",

  // Jahra (الجهراء)
  "Jahra", "Qasr", "Taima", "Naseem", "Oyoun",
  "Saad Al-Abdullah", "Amghara", "Kabd", "Mutlaa",

  // Mubarak Al-Kabeer (مبارك الكبير)
  "Mubarak Al-Kabeer", "Adan", "Sabah Al-Salem", "Fnaitees",
  "Messila", "Abu Ftaira", "Qurain", "Qusour",
]

export const PROPERTY_TYPES = [
  "apartment", "villa", "chalet", "floor", "building", "land", "office", "shop",
]

export const LISTING_TYPES = ["rent", "sale"] as const
export type ListingType = typeof LISTING_TYPES[number]
