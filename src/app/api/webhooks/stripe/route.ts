import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import type Stripe from 'stripe'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const sub = event.data.object as Stripe.Subscription

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const userId = sub.metadata?.userId
      if (!userId) break

      const priceId = sub.items.data[0]?.price?.id
      const isProMonthly = priceId === process.env.STRIPE_PRICE_PRO_MONTHLY
      const isProYearly = priceId === process.env.STRIPE_PRICE_PRO_YEARLY
      const plan = (isProMonthly || isProYearly) ? 'pro' : 'free'

      const periodEnd = sub.items.data[0]?.current_period_end
      await supabase.from('subscriptions').upsert({
        user_id: userId,
        stripe_customer_id: sub.customer as string,
        stripe_subscription_id: sub.id,
        plan,
        status: sub.status,
        current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      }, { onConflict: 'user_id' })
      break
    }

    case 'customer.subscription.trial_will_end': {
      // 3 dagen voor het einde van de trial — hier kun je een reminder e-mail sturen
      break
    }

    case 'customer.subscription.deleted': {
      const userId = sub.metadata?.userId
      if (!userId) break

      const periodEnd = sub.items.data[0]?.current_period_end
      await supabase.from('subscriptions').upsert({
        user_id: userId,
        stripe_subscription_id: sub.id,
        plan: 'free',
        status: 'canceled',
        current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      }, { onConflict: 'user_id' })
      break
    }
  }

  return NextResponse.json({ received: true })
}
