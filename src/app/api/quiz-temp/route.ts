import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export async function POST(req: Request) {
  try {
    const { name, config } = await req.json()
    if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 })

    const token = crypto.randomUUID()
    const slug = name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      + '-' + Math.random().toString(36).slice(2, 7)

    const { data, error } = await supabase
      .from('quizzes')
      .insert({
        user_id: null,
        name,
        slug,
        config: config || { questions: [] },
        active: true,
        is_temp: true,
        temp_token: token,
      })
      .select()
      .maybeSingle()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ slug: data.slug, token })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
