import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export async function POST(req: Request) {
  try {
    const { slug, name, email, phone, street, postcode, city, answers } = await req.json()

    // Zoek de quiz op basis van slug
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()

    if (quizError || !quiz) {
      return NextResponse.json({ error: 'Quiz niet gevonden' }, { status: 404 })
    }

    const address = [street, postcode, city].filter(Boolean).join(', ')

    // Sla de lead op
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        quiz_id: quiz.id,
        user_id: quiz.user_id,
        name,
        email,
        phone,
        answers: { ...answers, ...(address ? { adres: address } : {}) },
        status: 'new'
      })
      .select()
      .maybeSingle()

    if (leadError) {
      return NextResponse.json({ error: leadError.message }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'website@vertero.nl',
      subject: 'Nieuwe lead via Vertero',
      html: `<p>Nieuwe lead van <strong>${name}</strong> (${email}${phone ? `, ${phone}` : ''}) via quiz <strong>${quiz.title ?? slug}</strong>.</p>${address ? `<p><strong>Adres:</strong> ${address}</p>` : ''}`
    })

    return NextResponse.json({ success: true, lead }, { headers: { 'Access-Control-Allow-Origin': '*' } })
  } catch (err) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } })
  }
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}