import { auth } from '@clerk/nextjs/server'
import { getUserPlan } from '@/lib/subscription'
import BillingClient from './BillingClient'

export default async function BillingPage({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
  const { userId } = await auth()
  const plan = await getUserPlan(userId!)
  const { success } = await searchParams

  return <BillingClient plan={plan} justUpgraded={success === '1'} />
}
