import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import LeadsTable from './LeadsTable'
import { getUserPlan } from '@/lib/subscription'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export default async function LeadsPage() {
  const { userId } = await auth()

  const [{ data: leads }, { count: archivedCount }, plan] = await Promise.all([
    supabase
      .from('leads')
      .select('*, quizzes(name, config)')
      .eq('user_id', userId!)
      .in('status', ['new', 'seen'])
      .order('created_at', { ascending: false }),
    supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId!)
      .eq('status', 'done'),
    getUserPlan(userId!),
  ])

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-6 pt-8 pb-6 border-b border-white/[0.07] flex-shrink-0 flex items-end justify-between gap-4">
        <div>
          <p className="text-[#f97316] text-[10px] font-bold uppercase tracking-widest mb-1.5">Overzicht</p>
          <h1 className="text-3xl font-extrabold tracking-tight">Leads</h1>
        </div>
        {/* Tab-style navigation */}
        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.07] rounded-xl p-1 w-fit">
          <span className="px-4 py-2 rounded-lg text-sm font-semibold bg-white/10 text-white">
            Actief
            <span className="ml-2 text-[11px] font-bold bg-[#f97316]/15 text-[#f97316] px-1.5 py-0.5 rounded-full">
              {leads?.length || 0}
            </span>
          </span>
          <Link
            href="/dashboard/leads/archived"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white/40 hover:text-white hover:bg-white/5 transition"
          >
            Afgevinkt
            {(archivedCount ?? 0) > 0 && (
              <span className="ml-2 text-[11px] font-bold bg-white/5 text-white/40 px-1.5 py-0.5 rounded-full">
                {archivedCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="px-6 py-6 flex-1">
        {!leads?.length ? (
          <div className="border border-dashed border-white/[0.08] rounded-2xl p-16 text-center text-white/25 text-sm">
            Geen actieve leads — embed een quiz op je website om te beginnen
          </div>
        ) : (
          <LeadsTable leads={leads} plan={plan} />
        )}
      </div>
    </div>
  )
}
