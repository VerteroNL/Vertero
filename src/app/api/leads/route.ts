import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export async function POST(req: Request) {
  try {
    const { slug, name, email, phone, answers } = await req.json()

    // Zoek de quiz op basis van slug
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()

    if (quizError || !quiz) {
      return NextResponse.json({ error: 'Quiz niet gevonden' }, { status: 404 })
    }

    // Sla de lead op
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        quiz_id: quiz.id,
        user_id: quiz.user_id,
        name,
        email,
        phone,
        answers,
        status: 'new'
      })
      .select()
      .maybeSingle()

    if (leadError) {
      return NextResponse.json({ error: leadError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, lead })
  } catch (err) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}