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

  const prompt = targetLang === "ar"
    ? `Translate the following Kuwait real estate listing text to Arabic. Keep it natural and professional. Only return the translated text, nothing else:\n\n${text}`
    : `Translate the following Kuwait real estate listing text to English. Keep it natural and professional. Only return the translated text, nothing else:\n\n${text}`

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }],
  })

  const translated = message.content[0].type === "text" ? message.content[0].text : ""

  return NextResponse.json({ translated })
}
