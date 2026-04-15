export const KUWAIT_AREAS = [
  "Abdulla Al-Salem", "Abu Al Hasaniya", "Abu Ftaira", "Abu Halifa",
  "Abraq Khaitan", "Adan", "Adailiya", "Ahmadi", "Ali Sabah Al-Salem",
  "Amghara", "Andalus", "Anjafa", "Ardiya", "Ashbeliah",
  "Bayan", "Bidaa", "Bnaider", "Bnaid Al-Qar",
  "Daiya", "Dajeej", "Dasma", "Doha",
  "Fahaheel", "Faiha", "Farwaniya", "Fintas", "Fnaitees", "Funaitis",
  "Granada",
  "Hadiya", "Hawalli", "Hitteen",
  "Jabriya", "Jahra", "Jibla", "Jleeb Al-Shuyoukh",
  "Kaifan", "Khaldiya", "Khaitan", "Khiran",
  "Mahboula", "Mangaf", "Mansouriya", "Masayel", "Messila",
  "Mirqab", "Mishrif", "Mubarak Al-Abdullah", "Mubarak Al-Kabeer",
  "Mutlaa",
  "Naeem", "Nahdha", "Naseem", "Nuwaiseeb", "Nuzha",
  "Omariya", "Oyoun",
  "Qadsiya", "Qairawan", "Qasr", "Qortuba", "Qurain", "Qusour",
  "Rai", "Rawda", "Rehab", "Riggae", "Riqqa", "Rumaithiya",
  "Saad Al-Abdullah", "Sabah Al-Ahmed Sea City", "Sabah Al-Nasser",
  "Sabah Al-Salem", "Sabahiya", "Salam", "Salhiya", "Salmiya",
  "Salwa", "Shaab", "Shamiya", "Sharq", "Shuhada", "Shuaiba",
  "Shuwaikh", "Siddiq", "Sulaibikhat", "Sulaibiya", "Surra",
  "Taima",
  "Wafra",
  "Yarmouk",
  "Zahra", "Zour",
]

export const PROPERTY_TYPES = [
  "apartment", "villa", "chalet", "floor", "building", "land", "office", "shop",
]

export const LISTING_TYPES = ["rent", "sale"] as const
export type ListingType = typeof LISTING_TYPES[number]
