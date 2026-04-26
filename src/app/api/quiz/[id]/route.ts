import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getUserPlan } from '@/lib/subscription'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  // Strip pro-only fields for free users
  const plan = await getUserPlan(userId)
  if (plan === 'free' && body.config?.brandColor) {
    body.config = { ...body.config, brandColor: '#f97316' }
  }

  const { data, error } = await supabase
    .from('quizzes')
    .update(body)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { count } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('quiz_id', id)
    .eq('user_id', userId)

  if (count && count > 0) {
    return NextResponse.json(
      { error: `Deze quiz heeft ${count} lead${count === 1 ? '' : 's'}. Verwijder eerst de leads voordat je de quiz verwijdert.` },
      { status: 409 }
    )
  }

  const { error } = await supabase
    .from('quizzes')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}