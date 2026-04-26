import { auth, currentUser } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { getUserPlan } from '@/lib/subscription'
import SettingsForm from './SettingsForm'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export default async function SettingsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const [user, settingsResult, plan] = await Promise.all([
    currentUser(),
    supabase.from('user_settings').select('*').eq('user_id', userId).maybeSingle(),
    getUserPlan(userId),
  ])

  const settings = settingsResult.data

  const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Onbekend'
  const email = user?.emailAddresses?.[0]?.emailAddress ?? '—'

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-6 pt-8 pb-6 border-b border-white/[0.07] flex-shrink-0">
        <p className="text-[#f97316] text-[10px] font-bold uppercase tracking-widest mb-1.5">Account</p>
        <h1 className="text-3xl font-extrabold tracking-tight">Instellingen</h1>
        <p className="text-white/40 text-sm mt-1">Beheer je account en voorkeuren</p>
      </div>

      <div className="px-6 py-6 max-w-2xl">

      {/* Profiel */}
      <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-sm font-bold mb-4">Profiel</h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-white/40 text-sm">Naam</span>
            <span className="text-sm font-medium">{name}</span>
          </div>
          <div className="border-t border-white/5" />
          <div className="flex items-center justify-between">
            <span className="text-white/40 text-sm">E-mailadres</span>
            <span className="text-sm font-medium">{email}</span>
          </div>
        </div>
      </div>

      <SettingsForm initialEmailOnNewLead={settings?.email_on_new_lead ?? true} plan={plan} />
      </div>
    </div>
  )
}
