import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { Webhook } from 'svix'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export async function POST(req: Request) {
  const body = await req.text()
  const svixId = req.headers.get('svix-id') ?? ''
  const svixTimestamp = req.headers.get('svix-timestamp') ?? ''
  const svixSignature = req.headers.get('svix-signature') ?? ''

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)
  let event: { type: string; data: Record<string, unknown> }

  try {
    event = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as typeof event
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'user.created') {
    const data = event.data
    const emailObj = (data.email_addresses as Array<{ email_address: string; id: string }>)?.[0]
    const email = emailObj?.email_address
    const clerkId = data.id as string
    const firstName = data.first_name as string | null
    const lastName = data.last_name as string | null

    if (email && clerkId) {
      await supabase.from('users').upsert({
        clerk_id: clerkId,
        email,
        first_name: firstName ?? null,
        last_name: lastName ?? null,
      }, { onConflict: 'clerk_id' })
    }
  }

  return NextResponse.json({ received: true })
}
