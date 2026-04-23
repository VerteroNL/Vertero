import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getOrCreateStripeCustomer } from '@/lib/subscription'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { interval } = await req.json() // 'month' | 'year'
  const priceId = interval === 'year'
    ? process.env.STRIPE_PRICE_PRO_YEARLY!
    : process.env.STRIPE_PRICE_PRO_MONTHLY!

  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress ?? ''

  const customerId = await getOrCreateStripeCustomer(userId, email)

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
    subscription_data: {
      metadata: { userId },
      trial_period_days: 14,
    },
    allow_promotion_codes: true,
  })

  return NextResponse.json({ url: session.url })
}
