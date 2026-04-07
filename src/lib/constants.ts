export const KUWAIT_AREAS = [
  "Sharq", "Mirqab", "Salhiya", "Dasman", "Bneid Al-Gar",
  "Salmiya", "Jabriya", "Rumaithiya", "Bayan", "Mishref", "Hawalli", "Salwa",
  "Farwaniya", "Khaitan", "Ashbeliah", "Rehab", "Sabah Al-Nasser",
  "Fintas", "Mangaf", "Abu Halifa", "Fahaheel", "Mahboula", "Ahmadi",
  "Jahra", "Sulaibikhat", "Qasr", "Taima",
  "Mubarak Al-Kabeer", "Adan", "Sabah Al-Salem", "Fnaitees",
]

export const PROPERTY_TYPES = [
  "apartment", "villa", "chalet", "floor", "building", "land", "office", "shop",
]

export const LISTING_TYPES = ["rent", "sale"] as const
export type ListingType = typeof LISTING_TYPES[number]
