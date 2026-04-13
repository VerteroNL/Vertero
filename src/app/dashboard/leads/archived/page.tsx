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

  const [{ data: leads }, { count: activeCount }] = await Promise.all([
    supabase
      .from('leads')
      .select('*, quizzes(name, config)')
      .eq('user_id', userId!)
      .eq('status', 'done')
      .order('created_at', { ascending: false }),
    supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId!)
      .in('status', ['new', 'seen']),
  ])

  return (
    <div className="p-4 sm:p-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight mb-4">Leads</h1>

        {/* Tab-style navigation */}
        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/7 rounded-xl p-1 w-fit">
          <Link
            href="/dashboard/leads"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white/40 hover:text-white hover:bg-white/5 transition"
          >
            Actief
            {(activeCount ?? 0) > 0 && (
              <span className="ml-2 text-[11px] font-bold bg-white/5 text-white/40 px-1.5 py-0.5 rounded-full">
                {activeCount}
              </span>
            )}
          </Link>
          <span className="px-4 py-2 rounded-lg text-sm font-semibold bg-white/10 text-white">
            Afgevinkt
            <span className="ml-2 text-[11px] font-bold bg-[#f97316]/15 text-[#f97316] px-1.5 py-0.5 rounded-full">
              {leads?.length || 0}
            </span>
          </span>
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
              <div key={lead.id} className={`${!isLast ? 'border-b border-white/5' : ''} hover:bg-white/[0.02] transition`}>
                {/* Desktop row */}
                <div className="hidden md:flex items-center gap-2">
                  <Link href={`/dashboard/leads/${lead.id}`} className="flex-1 grid grid-cols-[1fr_1fr_1fr] gap-4 items-center px-5 py-3.5 min-w-0">
                    <div>
                      <div className="font-semibold text-sm text-white/70">{lead.name || '—'}</div>
                      <div className="text-white/30 text-xs mt-0.5 font-mono truncate">{lead.email || '—'}</div>
                    </div>
                    <div className="text-white/40 text-xs">{lead.phone || <span className="text-white/20">Geen telefoon</span>}</div>
                    <div className="text-white/30 text-xs">
                      <div>{lead.quizzes?.name || '—'}</div>
                      <div className="mt-0.5">{new Date(lead.created_at).toLocaleDateString('nl-NL')}</div>
                    </div>
                  </Link>
                  <div className="pr-4">
                    <LeadRowActions leadId={lead.id} deleteOnly />
                  </div>
                </div>

                {/* Mobile card */}
                <div className="flex md:hidden items-start gap-3 px-4 py-4">
                  <Link href={`/dashboard/leads/${lead.id}`} className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-white/80 truncate mb-0.5">{lead.name || '—'}</div>
                    <div className="text-white/30 text-xs font-mono truncate mb-1">{lead.email || '—'}</div>
                    <div className="flex items-center gap-2 text-white/25 text-xs">
                      <span>{lead.quizzes?.name || '—'}</span>
                      <span>·</span>
                      <span>{new Date(lead.created_at).toLocaleDateString('nl-NL')}</span>
                    </div>
                  </Link>
                  <div className="flex-shrink-0">
                    <LeadRowActions leadId={lead.id} deleteOnly />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
