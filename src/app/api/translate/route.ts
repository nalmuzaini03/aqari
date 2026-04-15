import Anthropic from "@anthropic-ai/sdk"
import { NextResponse } from "next/server"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: Request) {
  const { text, targetLang } = await request.json()

  if (!text || !targetLang) {
    return NextResponse.json({ error: "Missing text or targetLang" }, { status: 400 })
  }

  const KUWAIT_AREAS_NOTE = `Important: Do NOT translate Kuwait area/neighborhood names. Keep these exactly as written in English: Abdulla Al-Salem, Adailiya, Bnaid Al-Qar, Daiya, Dasma, Doha, Faiha, Granada, Jibla, Kaifan, Khaldiya, Mansouriya, Mirqab, Nahdha, Nuzha, Qadsiya, Qortuba, Rawda, Shamiya, Sharq, Shuwaikh, Sulaibikhat, Qairawan, Surra, Yarmouk, Anjafa, Bayan, Bidaa, Hawalli, Hitteen, Jabriya, Mishrif, Mubarak Al-Abdullah, Rumaithiya, Salam, Salmiya, Salwa, Shaab, Shuhada, Siddiq, Zahra, Abdullah Al-Mubarak, Abraq Khaitan, Andalus, Ardiya, Ashbeliah, Dajeej, Farwaniya, Jleeb Al-Shuyoukh, Khaitan, Omariya, Qurain, Rai, Rehab, Riggae, Sabah Al-Nasser, Abu Halifa, Ahmadi, Ali Sabah Al-Salem, Bnaider, Fahaheel, Fintas, Funaitis, Hadiya, Khiran, Mahboula, Mangaf, Nuwaiseeb, Riqqa, Sabahiya, Sabah Al-Ahmed Sea City, Shuaiba, Wafra, Zour, Amghara, Jahra, Mutlaa, Naeem, Naseem, Oyoun, Qasr, Saad Al-Abdullah, Sulaibiya, Taima, Abu Al Hasaniya, Abu Ftaira, Adan, Fnaitees, Masayel, Messila, Mubarak Al-Kabeer, Qusour, Sabah Al-Salem.`

  const prompt = targetLang === "ar"
    ? `Translate the following Kuwait real estate listing text to Arabic. Keep it natural and professional. ${KUWAIT_AREAS_NOTE} Only return the translated text, nothing else:\n\n${text}`
    : `Translate the following Kuwait real estate listing text to English. Keep it natural and professional. ${KUWAIT_AREAS_NOTE} Only return the translated text, nothing else:\n\n${text}`

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }],
  })

  const translated = message.content[0].type === "text" ? message.content[0].text : ""

  return NextResponse.json({ translated })
}
