import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export default async function DashboardPage() {
  const { userId } = await auth()

  const { data: quizzes } = await supabase
    .from('quizzes')
    .select('*')
    .eq('user_id', userId!)

  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .eq('user_id', userId!)
    .order('created_at', { ascending: false })

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).toISOString()

  const newLeads = leads?.filter(l => l.status === 'new') || []
  const leadsToday = leads?.filter(l => l.created_at >= startOfToday) || []
  const leadsThisWeek = leads?.filter(l => l.created_at >= startOfWeek) || []
  const totalLeads = leads?.length || 0

  const leadsPerQuiz = quizzes?.map(quiz => ({
    ...quiz,
    leadCount: leads?.filter(l => l.quiz_id === quiz.id).length || 0,
  })).sort((a, b) => b.leadCount - a.leadCount) || []

  return (
    <div className="p-8 max-w-3xl">

      {/* Hero: nieuwe leads */}
      <div className="mb-8">
        <div className="text-[11px] font-bold uppercase tracking-widest text-white/25 mb-2">Nieuwe leads</div>
        <div className="flex items-end gap-4">
          <div className="text-7xl font-extrabold leading-none text-[#f97316]">{newLeads.length}</div>
          <div className="mb-2 flex gap-4 text-sm text-white/30">
            <span><span className="text-white/60 font-semibold">{leadsToday.length}</span> vandaag</span>
            <span><span className="text-white/60 font-semibold">{leadsThisWeek.length}</span> deze week</span>
            <span><span className="text-white/60 font-semibold">{totalLeads}</span> totaal</span>
          </div>
        </div>
      </div>

      {/* Leads lijst */}
      <div className="bg-[#0d0d1c] border border-white/10 rounded-xl overflow-hidden mb-4">
        <div className="flex justify-between items-center px-5 py-3.5 border-b border-white/7">
          <div className="text-xs font-bold uppercase tracking-widest text-white/40">Recente leads</div>
          <Link href="/dashboard/leads" className="text-xs font-semibold text-[#f97316] hover:text-[#ea6c0a] transition">
            Alle leads →
          </Link>
        </div>
        {totalLeads === 0 ? (
          <div className="px-5 py-10 text-center text-white/25 text-sm">
            Nog geen leads
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {leads?.slice(0, 8).map(lead => {
              const date = new Date(lead.created_at)
              const isToday = lead.created_at >= startOfToday
              const timeLabel = isToday
                ? date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
                : date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })

              return (
                <Link
                  key={lead.id}
                  href={`/dashboard/leads/${lead.id}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.03] transition group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {lead.status === 'new' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] flex-shrink-0" />
                    )}
                    {lead.status !== 'new' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-transparent flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate">{lead.name || 'Anoniem'}</div>
                      <div className="text-white/30 text-xs font-mono truncate">{lead.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <span className="text-white/25 text-xs tabular-nums">{timeLabel}</span>
                    <span className="text-white/15 group-hover:text-white/40 transition text-xs">→</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Quizzes — compact, leads per quiz */}
      <div className="bg-[#0d0d1c] border border-white/10 rounded-xl overflow-hidden">
        <div className="flex justify-between items-center px-5 py-3.5 border-b border-white/7">
          <div className="text-xs font-bold uppercase tracking-widest text-white/40">Quizzes</div>
          <Link href="/dashboard/quiz/new" className="text-xs font-semibold text-[#f97316] hover:text-[#ea6c0a] transition">
            + Nieuw
          </Link>
        </div>
        {leadsPerQuiz.length === 0 ? (
          <div className="px-5 py-6 text-center text-white/25 text-sm">
            <Link href="/dashboard/quiz/new" className="text-[#f97316] hover:text-[#ea6c0a] transition">
              Maak je eerste quiz aan →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {leadsPerQuiz.map(quiz => (
              <Link
                key={quiz.id}
                href={`/dashboard/quiz/${quiz.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.03] transition group"
              >
                <div className="font-medium text-sm truncate text-white/70">{quiz.name}</div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                  <span className="text-white/50 text-xs tabular-nums font-semibold">{quiz.leadCount}</span>
                  <span className="text-white/20 text-xs">leads</span>
                  <span className="text-white/15 group-hover:text-white/40 transition text-xs">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
