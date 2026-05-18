import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getOrCreateStripeCustomer } from '@/lib/subscription'
import { getOwnerUserId } from '@/lib/auth'

export async function POST() {
  const userId = await getOwnerUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const email = process.env.OWNER_EMAIL ?? ''
  const customerId = await getOrCreateStripeCustomer(userId, email)

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
  })

  return NextResponse.json({ url: session.url })
}
