import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export type Plan = 'free' | 'pro'

export async function getUserPlan(userId: string): Promise<Plan> {
  const { data } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', userId)
    .maybeSingle()

  if (data?.plan === 'pro' && (data.status === 'active' || data.status === 'trialing')) {
    return 'pro'
  }
  return 'free'
}

export async function getOrCreateStripeCustomer(userId: string, email: string): Promise<string> {
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .maybeSingle()

  if (sub?.stripe_customer_id) return sub.stripe_customer_id

  const { stripe } = await import('./stripe')
  const customer = await stripe.customers.create({ email, metadata: { userId } })

  await supabase.from('subscriptions').upsert({
    user_id: userId,
    stripe_customer_id: customer.id,
    plan: 'free',
    status: 'active',
  }, { onConflict: 'user_id' })

  return customer.id
}
