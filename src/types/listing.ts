export type Listing = {
  id: string
  title: string
  title_ar: string | null
  title_en: string | null
  description: string | null
  description_ar: string | null
  description_en: string | null
  price: number
  price_per_night: number | null
  area: string
  bedrooms: number | null
  bathrooms: number | null
  property_type: string
  phone_number: string
  photos: string[]
  is_verified: boolean
  created_at: string
  listing_type: "rent" | "sale" | "short_stay"
}
