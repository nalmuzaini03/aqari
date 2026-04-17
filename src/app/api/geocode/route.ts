import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { area, block, street } = await request.json()

  if (!area) return NextResponse.json({ error: "Missing area" }, { status: 400 })

  // Build address string for Kuwait
  const parts = []
  if (street) parts.push(`Street ${street}`)
  if (block) parts.push(`Block ${block}`)
  parts.push(area)
  parts.push("Kuwait")

  const address = parts.join(", ")

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_GEOCODING_KEY}`
  )

  const data = await res.json()

  if (data.status !== "OK" || !data.results[0]) {
    return NextResponse.json({ error: "Location not found" }, { status: 404 })
  }

  const { lat, lng } = data.results[0].geometry.location
  return NextResponse.json({ lat, lng, formatted: data.results[0].formatted_address })
}
