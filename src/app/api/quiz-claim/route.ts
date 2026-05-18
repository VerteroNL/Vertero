import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getOwnerUserId } from '@/lib/auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export async function POST(req: Request) {
  const userId = await getOwnerUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { token } = await req.json()
  if (!token) return NextResponse.json({ error: 'No token' }, { status: 400 })

  const { data: quiz } = await supabase
    .from('quizzes')
    .select('id')
    .eq('temp_token', token)
    .is('user_id', null)
    .maybeSingle()

  if (!quiz) return NextResponse.json({ alreadyClaimed: true })

  const { error: quizError } = await supabase
    .from('quizzes')
    .update({ user_id: userId, is_temp: false, temp_token: null })
    .eq('id', quiz.id)
  if (quizError) return NextResponse.json({ error: quizError.message }, { status: 500 })

  const { error: leadsError } = await supabase
    .from('leads')
    .update({ user_id: userId })
    .eq('quiz_id', quiz.id)
    .is('user_id', null)
  if (leadsError) return NextResponse.json({ error: leadsError.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
