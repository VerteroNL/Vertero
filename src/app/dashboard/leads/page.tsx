import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import LeadsTable from './LeadsTable'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export default async function LeadsPage() {
  const { userId } = await auth()

  const [{ data: leads }, { count: archivedCount }] = await Promise.all([
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
  ])

  return (
    <div className="p-4 sm:p-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight mb-4">Leads</h1>

        {/* Tab-style navigation */}
        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/7 rounded-xl p-1 w-fit">
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

      {!leads?.length ? (
        <div className="border border-dashed border-white/10 rounded-xl p-16 text-center text-white/25 text-sm">
          Geen actieve leads — embed een quiz op je website om te beginnen
        </div>
      ) : (
        <LeadsTable leads={leads} />
      )}
    </div>
  )
}
