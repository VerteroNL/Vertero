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

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
  }
  if (error || !data) return NextResponse.json({ error: 'Niet gevonden' }, { status: 404, headers })
  return NextResponse.json(data, { headers })
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}