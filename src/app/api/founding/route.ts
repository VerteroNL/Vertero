import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

const TOTAL = 50

export async function GET() {
  const { count } = await supabase
    .from('founding_members')
    .select('*', { count: 'exact', head: true })
  const remaining = Math.max(0, TOTAL - (count ?? 0))
  return NextResponse.json({ remaining, total: TOTAL })
}

export async function POST(req: Request) {
  const { email } = await req.json()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Ongeldig e-mailadres' }, { status: 400 })
  }

  const { count } = await supabase
    .from('founding_members')
    .select('*', { count: 'exact', head: true })

  if ((count ?? 0) >= TOTAL) {
    return NextResponse.json({ error: 'Vol', full: true }, { status: 409 })
  }

  const { error } = await supabase.from('founding_members').insert({ email })

  if (error?.code === '23505') {
    return NextResponse.json({ error: 'Al aangemeld' }, { status: 409 })
  }
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, remaining: Math.max(0, TOTAL - (count ?? 0) - 1) })
}
