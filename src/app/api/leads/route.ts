import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getOwnerUserId } from '@/lib/auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export async function POST(req: Request) {
  try {
    const { slug, name, email, phone, street, postcode, city, answers } = await req.json()

    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()

    if (quizError || !quiz) {
      return NextResponse.json({ error: 'Quiz niet gevonden' }, { status: 404 })
    }

    const address = [street, postcode, city].filter(Boolean).join(', ')

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

    return NextResponse.json({ success: true, lead }, { headers: { 'Access-Control-Allow-Origin': '*' } })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } })
  }
}

export async function PATCH(req: Request) {
  const userId = await getOwnerUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { ids, status } = await req.json()
  if (!Array.isArray(ids) || ids.length === 0)
    return NextResponse.json({ error: 'No ids' }, { status: 400 })

  const { error } = await supabase.from('leads').update({ status }).in('id', ids).eq('user_id', userId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
  const userId = await getOwnerUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { ids } = await req.json()
  if (!Array.isArray(ids) || ids.length === 0)
    return NextResponse.json({ error: 'No ids' }, { status: 400 })

  const { error } = await supabase.from('leads').delete().in('id', ids).eq('user_id', userId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
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
