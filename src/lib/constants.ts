export const KUWAIT_AREAS = [
  // Capital
  "Abdulla Al-Salem", "Adailiya", "Bnaid Al-Qar", "Daiya", "Dasma", "Doha",
  "Faiha", "Granada", "Jibla", "Kaifan", "Khaldiya", "Mansouriya", "Mirqab",
  "Nahdha", "Nuzha", "Qadsiya", "Qortuba", "Rawda", "Shamiya", "Sharq",
  "Shuwaikh", "Sulaibikhat", "Qairawan", "Surra", "Yarmouk",
  // Hawalli
  "Anjafa", "Bayan", "Bidaa", "Hawalli", "Hitteen", "Jabriya", "Mishrif",
  "Mubarak Al-Abdullah", "Rumaithiya", "Salam", "Salmiya", "Salwa",
  "Shaab", "Shuhada", "Siddiq", "Zahra",
  // Farwaniya
  "Abdullah Al-Mubarak", "Abraq Khaitan", "Andalus", "Ardiya", "Ashbeliah",
  "Dajeej", "Farwaniya", "Jleeb Al-Shuyoukh", "Khaitan", "Omariya",
  "Qurain", "Rai", "Rehab", "Riggae", "Sabah Al-Nasser",
  // Ahmadi
  "Abu Halifa", "Ahmadi", "Ali Sabah Al-Salem", "Bnaider", "Fahaheel",
  "Fintas", "Funaitis", "Hadiya", "Khiran", "Mahboula", "Mangaf",
  "Nuwaiseeb", "Riqqa", "Sabahiya", "Sabah Al-Ahmed Sea City",
  "Shuaiba", "Wafra", "Zour",
  // Jahra
  "Amghara", "Jahra", "Mutlaa", "Naeem", "Naseem", "Oyoun",
  "Qasr", "Saad Al-Abdullah", "Sulaibiya", "Taima",
  // Mubarak Al-Kabeer
  "Abu Al Hasaniya", "Abu Ftaira", "Adan", "Fnaitees", "Masayel",
  "Messila", "Mubarak Al-Kabeer", "Qurain", "Qusour", "Sabah Al-Salem",
]

export const PROPERTY_TYPES = [
  "apartment", "villa", "chalet", "floor", "building", "land", "office", "shop",
]

export const LISTING_TYPES = ["rent", "sale"] as const
export type ListingType = typeof LISTING_TYPES[number]
