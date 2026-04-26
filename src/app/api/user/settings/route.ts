import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getUserPlan } from '@/lib/subscription'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  return NextResponse.json(data ?? { email_on_new_lead: true })
}

export async function PATCH(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  // email_on_new_lead is a pro-only feature
  if ('email_on_new_lead' in body) {
    const plan = await getUserPlan(userId)
    if (plan === 'free') {
      return NextResponse.json({ error: 'UPGRADE_REQUIRED' }, { status: 403 })
    }
  }

  const allowed = ['email_on_new_lead']
  const updates: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) updates[key] = body[key]
  }

  const { error } = await supabase
    .from('user_settings')
    .upsert({ user_id: userId, ...updates }, { onConflict: 'user_id' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
