import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import ClaimHandler from './ClaimHandler'

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
    <div className="flex flex-col h-full overflow-y-auto">
      <ClaimHandler />

      {/* Page header */}
      <div className="px-6 pt-8 pb-6 border-b border-white/[0.07] flex-shrink-0">
        <p className="text-[#f97316] text-[10px] font-bold uppercase tracking-widest mb-1.5">Overzicht</p>
        <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
      </div>

      <div className="px-6 py-6 flex-1">

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Nieuw', value: newLeads.length, href: '/dashboard/leads', highlight: true },
          { label: 'Vandaag', value: leadsToday.length, href: '/dashboard/leads' },
          { label: 'Deze week', value: leadsThisWeek.length, href: '/dashboard/leads' },
          { label: 'Totaal', value: totalLeads, href: '/dashboard/leads' },
        ].map(stat => (
          <Link key={stat.label} href={stat.href}
            className="bg-[#0d0d1c] border border-white/[0.08] rounded-2xl px-5 py-4 hover:border-white/[0.15] transition group">
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-2">{stat.label}</div>
            <div className={`text-3xl font-extrabold ${stat.highlight ? 'text-[#f97316]' : 'text-white'}`}>{stat.value}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

      {/* Leads lijst */}
      <div className="bg-[#0d0d1c] border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="flex justify-between items-center px-5 py-3.5 border-b border-white/7">
          <div className="text-xs font-bold uppercase tracking-widest text-white/40">Recente leads</div>
          <Link href="/dashboard/leads" className="text-xs font-semibold text-[#f97316] hover:text-[#ea6c0a] transition">
            Alle leads →
          </Link>
        </div>
        {totalLeads === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-white/25 text-sm mb-3">Nog geen leads ontvangen</p>
            <Link href="/dashboard/quiz/new" className="inline-block text-xs font-semibold bg-[#f97316]/10 hover:bg-[#f97316]/20 text-[#f97316] px-4 py-2 rounded-lg transition">
              Maak een quiz aan →
            </Link>
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
      <div className="bg-[#0d0d1c] border border-white/[0.08] rounded-2xl overflow-hidden">
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
      </div>
    </div>
  )
}
