import Stripe from 'stripe'
import { readFileSync } from 'fs'

// Read .env.local manually
const env = readFileSync('.env.local', 'utf8')
const key = env.match(/STRIPE_SECRET_KEY=(.+)/)?.[1]?.trim()

if (!key) {
  console.error('STRIPE_SECRET_KEY not found in .env.local')
  process.exit(1)
}

const stripe = new Stripe(key)

const product = await stripe.products.create({ name: 'Vertero Pro' })
console.log('Product:', product.id)

const monthlyPrice = await stripe.prices.create({
  product: product.id,
  unit_amount: 6900,
  currency: 'eur',
  recurring: { interval: 'month' },
})
console.log('Monthly price ID:', monthlyPrice.id)

const yearlyPrice = await stripe.prices.create({
  product: product.id,
  unit_amount: 69000,
  currency: 'eur',
  recurring: { interval: 'year' },
})
console.log('Yearly price ID:', yearlyPrice.id)

console.log('\nVoeg dit toe aan je .env.local:')
console.log(`STRIPE_PRICE_PRO_MONTHLY=${monthlyPrice.id}`)
console.log(`STRIPE_PRICE_PRO_YEARLY=${yearlyPrice.id}`)
