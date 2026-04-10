import { auth, clerkClient } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export async function DELETE() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Delete in order: feedback, leads, user_settings, quizzes
  await supabase.from('feedback').delete().eq('user_id', userId)
  await supabase.from('leads').delete().eq('user_id', userId)
  await supabase.from('user_settings').delete().eq('user_id', userId)
  await supabase.from('quizzes').delete().eq('user_id', userId)

  const client = await clerkClient()
  await client.users.deleteUser(userId)

  return NextResponse.json({ ok: true })
}
