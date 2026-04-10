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

  const { data: leads } = await supabase
    .from('leads')
    .select('*, quizzes(name, config)')
    .eq('user_id', userId!)
    .in('status', ['new', 'seen'])
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Leads</h1>
          <p className="text-white/30 text-sm mt-1">{leads?.length || 0} actieve inzendingen</p>
        </div>
        <Link
          href="/dashboard/leads/archived"
          className="text-white/30 hover:text-white/60 text-sm transition whitespace-nowrap mt-1"
        >
          Afgevinkte leads →
        </Link>
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
