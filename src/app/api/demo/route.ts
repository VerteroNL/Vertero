import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM = `Jij bent een leadkwalificatie-assistent voor een Nederlands installatiebedrijf. Je krijgt de antwoorden van een potentiële klant. Analyseer de antwoorden en geef een samenvatting terug als JSON met precies deze velden: samenvatting (1 zin over de aanvraag), budget (het opgegeven budget), timing (wanneer ze willen starten), score (goed / matig / slecht), advies (max 1 zin wat de ondernemer moet doen). Reageer ALLEEN met JSON, geen uitleg, geen markdown.`

export async function POST(req: NextRequest) {
  try {
    const { branch, answers } = await req.json()

    const userMessage = `Branche: ${branch}\n\nAntwoorden:\n${(answers as string[]).join('\n')}`

    const msg = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: SYSTEM,
      messages: [{ role: 'user', content: userMessage }],
    })

    const text = msg.content[0].type === 'text' ? msg.content[0].text : ''
    const result = JSON.parse(text)

    return NextResponse.json(result)
  } catch (err) {
    console.error('Demo API error:', err)
    return NextResponse.json({ error: 'Verwerking mislukt' }, { status: 500 })
  }
}
