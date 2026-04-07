import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { name, config, duplicate_from } = await req.json()

    let finalConfig = config || {}

    // Als dupliceren, haal de originele quiz op
    if (duplicate_from) {
      const { data: original } = await supabase
        .from('quizzes')
        .select('config')
        .eq('id', duplicate_from)
        .eq('user_id', userId)
        .maybeSingle()
      if (original) finalConfig = original.config
    }

    const slug = name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      + '-' + Math.random().toString(36).slice(2, 7)

    const { data, error } = await supabase
      .from('quizzes')
      .insert({ user_id: userId, name, slug, config: finalConfig })
      .select()
      .maybeSingle()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}