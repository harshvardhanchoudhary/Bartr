import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const client = new Anthropic()

export async function POST(request: Request) {
  try {
    const { title, description, category, type } = await request.json()
    const isService = type === 'service'

    const prompt = isService
      ? `You're helping a freelancer write a compelling skills listing for Bartr-B, a skills marketplace.

Input:
Title: ${title || '(not provided)'}
Category: ${category || '(not provided)'}
Description: ${description || '(not provided)'}

Write an improved listing. Return ONLY a JSON object (no surrounding text) with exactly these keys:
- "title": Specific, professional skill title (max 65 chars). State what you do and for whom if helpful.
- "description": 2-3 confident sentences. Cover: what you deliver, your approach/experience, what clients can expect. Specific > vague.`
      : `You're helping someone write a clear listing for Bartr, a peer-to-peer item trading marketplace.

Input:
Title: ${title || '(not provided)'}
Category: ${category || '(not provided)'}
Description: ${description || '(not provided)'}

Write an improved listing. Return ONLY a JSON object (no surrounding text) with exactly these keys:
- "title": Specific, descriptive title (max 60 chars, no emojis).
- "description": 2-3 sentences covering: condition, what's included, any defects or notes the trader should know. Honest and warm, not salesy.`

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 320,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : '{}'

    // Extract JSON even if surrounded by markdown fences or text
    const match = text.match(/\{[\s\S]*?\}/)
    if (!match) {
      return NextResponse.json({ error: 'Unexpected response format' }, { status: 500 })
    }

    const parsed = JSON.parse(match[0])
    return NextResponse.json(parsed)
  } catch (err) {
    console.error('[AI suggest]', err)
    return NextResponse.json({ error: 'Failed to generate suggestion' }, { status: 500 })
  }
}
