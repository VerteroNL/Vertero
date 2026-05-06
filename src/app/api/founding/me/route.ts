import { auth, currentUser } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

const TOTAL = 50

async function getEmail() {
  const user = await currentUser()
  return user?.emailAddresses[0]?.emailAddress ?? null
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ isFounder: false })

  const email = await getEmail()
  if (!email) return NextResponse.json({ isFounder: false })

  const { count } = await supabase
    .from('founding_members')
    .select('*', { count: 'exact', head: true })
    .eq('email', email)

  return NextResponse.json({ isFounder: (count ?? 0) > 0 })
}

export async function POST() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const email = await getEmail()
  if (!email) return NextResponse.json({ error: 'No email' }, { status: 400 })

  const { count: total } = await supabase
    .from('founding_members')
    .select('*', { count: 'exact', head: true })

  if ((total ?? 0) >= TOTAL) {
    return NextResponse.json({ error: 'Vol', full: true }, { status: 409 })
  }

  const { error } = await supabase.from('founding_members').insert({ email })
  if (error?.code === '23505') return NextResponse.json({ isFounder: true })
  if (error) {
    console.error('founding/me insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ isFounder: true })
}
