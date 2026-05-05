import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { getUserPlan } from '@/lib/subscription'
import BillingClient from './BillingClient'
import { BETA_HIDE_PRO } from '@/lib/flags'

export default async function BillingPage({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
  if (BETA_HIDE_PRO) redirect('/dashboard')

  const { userId } = await auth()
  const plan = await getUserPlan(userId!)
  const { success } = await searchParams

  return <BillingClient plan={plan} justUpgraded={success === '1'} />
}
