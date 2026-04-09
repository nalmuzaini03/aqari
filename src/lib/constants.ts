export const KUWAIT_AREAS = [
  // Capital
  "Sharq", "Mirqab", "Salhiya", "Dasman", "Bneid Al-Gar", "Kaifan", "Nuzha", "Yarmouk",
  "Shuwaikh", "Doha", "Qadsiya", "Faiha", "Shamiya", "Sulaibikhat", "Rawda", "Adailiya",
  "Khaldiya", "Mansouriya",
  // Hawalli
  "Salmiya", "Jabriya", "Mishref", "Hawalli", "Rumaithiya", "Bayan", "Salwa", "Shaab",
  "Siddiq", "Midan Hawalli", "Hittin", "Shuhada", "Bidaa", "Zuhor",
  // Farwaniya
  "Farwaniya", "Khaitan", "Rehab", "Ardiya", "Riggae", "Qurain", "Omariya", "Ashbeliah",
  "Sabah Al-Nasser", "Abdullah Al-Mubarak", "Andalus", "Abraq Khaitan", "Dajeej",
  // Ahmadi
  "Fahaheel", "Fintas", "Mangaf", "Mahboula", "Abu Halifa", "Ahmadi", "Riqqa", "Sabahiya",
  "Funaitis", "Ali Sabah Al-Salem", "Zour", "Wafra", "Khiran", "Nuwaiseeb", "Shuaiba",
  "Hadiya", "Bnaider",
  // Jahra
  "Jahra", "Qasr", "Taima", "Naseem", "Oyoun", "Saad Al-Abdullah", "Amghara", "Mutlaa",
  "Sulaibiya", "Naeem", "Qairawan",
  // Mubarak Al-Kabeer
  "Mubarak Al-Kabeer", "Adan", "Sabah Al-Salem", "Fnaitees", "Messila", "Abu Ftaira",
  "Qusour", "Mishrif",
]

export const PROPERTY_TYPES = [
  "apartment", "villa", "chalet", "floor", "building", "land", "office", "shop",
]

export const LISTING_TYPES = ["rent", "sale"] as const
export type ListingType = typeof LISTING_TYPES[number]
