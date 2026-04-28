import { Webhook } from 'svix'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export async function POST(req: Request) {
  const body = await req.text()
  const svixId = req.headers.get('svix-id')!
  const svixTimestamp = req.headers.get('svix-timestamp')!
  const svixSignature = req.headers.get('svix-signature')!

  let event: { type: string; data: { id: string } }
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)
    event = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as { type: string; data: { id: string } }
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'user.created') {
    await supabase.from('subscriptions').upsert({
      user_id: event.data.id,
      plan: 'free',
      status: 'active',
    }, { onConflict: 'user_id' })
  }

  return NextResponse.json({ ok: true })
}
