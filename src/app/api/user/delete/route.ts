import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getOwnerUserId } from '@/lib/auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export async function DELETE() {
  const userId = await getOwnerUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await supabase.from('feedback').delete().eq('user_id', userId)
  await supabase.from('leads').delete().eq('user_id', userId)
  await supabase.from('user_settings').delete().eq('user_id', userId)
  await supabase.from('quizzes').delete().eq('user_id', userId)

  return NextResponse.json({ ok: true })
}
