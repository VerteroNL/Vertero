import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error || !data) return NextResponse.json({ error: 'Niet gevonden' }, { status: 404 })
  return NextResponse.json(data)
}