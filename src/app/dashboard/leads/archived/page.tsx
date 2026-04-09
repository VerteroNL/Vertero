import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import LeadRowActions from '../LeadRowActions'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export default async function ArchivedLeadsPage() {
  const { userId } = await auth()

  const { data: leads } = await supabase
    .from('leads')
    .select('*, quizzes(name, config)')
    .eq('user_id', userId!)
    .eq('status', 'done')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-5xl">
      <Link href="/dashboard/leads" className="text-white/30 hover:text-white text-sm transition mb-8 inline-flex items-center gap-1.5">
        ← Terug naar leads
      </Link>

      <div className="mt-8 mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Afgevinkt</h1>
          <p className="text-white/30 text-sm mt-1">{leads?.length || 0} afgevinkte inzendingen</p>
        </div>
      </div>

      {!leads?.length ? (
        <div className="border border-dashed border-white/10 rounded-xl p-16 text-center text-white/25 text-sm">
          Nog geen afgevinkte leads
        </div>
      ) : (
        <div className="bg-[#0d0d1c] border border-white/10 rounded-xl overflow-hidden">
          {leads.map((lead, i) => {
            const isLast = i === leads.length - 1
            return (
              <div key={lead.id} className={`flex items-center gap-2 ${!isLast ? 'border-b border-white/5' : ''} hover:bg-white/[0.02] transition`}>
                <Link href={`/dashboard/leads/${lead.id}`} className="flex-1 grid grid-cols-[1fr_1fr_1fr] gap-4 items-center px-5 py-3.5 min-w-0">
                  <div>
                    <div className="font-semibold text-sm text-white/70">{lead.name || '—'}</div>
                    <div className="text-white/30 text-xs mt-0.5 font-mono truncate">{lead.email || '—'}</div>
                  </div>
                  <div>
                    <div className="text-white/40 text-xs">{lead.phone || <span className="text-white/20">Geen telefoon</span>}</div>
                  </div>
                  <div className="text-white/30 text-xs">
                    <div>{lead.quizzes?.name || '—'}</div>
                    <div className="mt-0.5">{new Date(lead.created_at).toLocaleDateString('nl-NL')}</div>
                  </div>
                </Link>
                <div className="pr-4">
                  <LeadRowActions leadId={lead.id} deleteOnly />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
