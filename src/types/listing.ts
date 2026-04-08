export type Listing = {
  id: string
  title: string
  description: string | null
  price: number
  area: string
  bedrooms: number | null
  bathrooms: number | null
  property_type: string
  phone_number: string
  photos: string[]
  is_verified: boolean
  created_at: string
  listing_type: "rent" | "sale" | "short_stay"
  price_per_night: number | null
}
