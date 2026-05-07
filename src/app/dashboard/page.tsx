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

  const leadsToday = leads?.filter(l => l.created_at >= startOfToday) || []
  const leadsThisWeek = leads?.filter(l => l.created_at >= startOfWeek) || []
  const totalLeads = leads?.length || 0
  const hasQuizzes = (quizzes?.length ?? 0) > 0

  const leadsPerQuiz = quizzes?.map(quiz => ({
    ...quiz,
    leadCount: leads?.filter(l => l.quiz_id === quiz.id).length || 0,
  })).sort((a, b) => b.leadCount - a.leadCount) || []

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <ClaimHandler />

      {/* Header */}
      <div className="px-6 pt-8 pb-6 border-b border-white/[0.07] flex-shrink-0 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight">Dashboard</h1>
        <Link
          href="/dashboard/quiz/new"
          className="bg-[#f97316] hover:bg-[#ea6c0a] text-white font-semibold text-sm px-4 py-2 rounded-lg transition"
        >
          + Nieuwe quiz
        </Link>
      </div>

      <div className="px-6 py-6 flex-1">

        {/* ONBOARDING — geen quizzes */}
        {!hasQuizzes ? (
          <div className="max-w-lg">
            <h2 className="text-xl font-extrabold mb-1">Welkom bij Vertero! 👋</h2>
            <p className="text-white/40 text-sm mb-8">Je bent in 3 stappen klaar om aanvragen te ontvangen.</p>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4 bg-[#0d0d1c] border border-white/[0.08] rounded-xl px-5 py-4">
                <span className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-400 text-xs font-bold">✓</span>
                </span>
                <span className="text-sm text-white/50 line-through">Account aangemaakt</span>
              </div>

              <div className="flex items-center justify-between gap-4 bg-[#0d0d1c] border border-[#f97316]/40 rounded-xl px-5 py-4">
                <div className="flex items-center gap-4">
                  <span className="w-6 h-6 rounded-full border border-white/20 flex-shrink-0" />
                  <span className="text-sm font-semibold">Maak je eerste quiz</span>
                </div>
                <Link href="/dashboard/quiz/new" className="bg-[#f97316] hover:bg-[#ea6c0a] text-white text-xs font-bold px-4 py-1.5 rounded-lg transition flex-shrink-0">
                  Start nu →
                </Link>
              </div>

              <div className="flex items-center gap-4 bg-[#0d0d1c] border border-white/[0.08] rounded-xl px-5 py-4 opacity-40">
                <span className="w-6 h-6 rounded-full border border-white/20 flex-shrink-0" />
                <span className="text-sm">Installeer op je website</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Vandaag', value: leadsToday.length },
                { label: 'Deze week', value: leadsThisWeek.length },
                { label: 'Totaal', value: totalLeads },
              ].map(stat => (
                <Link key={stat.label} href="/dashboard/leads"
                  className="bg-[#0d0d1c] border border-white/[0.08] rounded-2xl px-5 py-4 hover:border-white/[0.15] transition">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-2">{stat.label}</div>
                  <div className="text-3xl font-extrabold">{stat.value}</div>
                </Link>
              ))}
            </div>

            {/* Leads + Quizzes */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

              {/* Leads — 2/3 breedte */}
              <div className="xl:col-span-2 bg-[#0d0d1c] border border-white/[0.08] rounded-2xl overflow-hidden">
                <div className="flex justify-between items-center px-5 py-3.5 border-b border-white/7">
                  <div className="text-xs font-bold uppercase tracking-widest text-white/40">Recente leads</div>
                  <Link href="/dashboard/leads" className="text-xs font-semibold text-[#f97316] hover:text-[#ea6c0a] transition">
                    Alle leads →
                  </Link>
                </div>
                {totalLeads === 0 ? (
                  <div className="px-5 py-10 text-center">
                    <p className="text-white/25 text-sm mb-3">Je quiz staat live — maar nog geen aanvragen binnen.</p>
                    <Link href="/dashboard/installeren" className="inline-block text-xs font-semibold bg-[#f97316]/10 hover:bg-[#f97316]/20 text-[#f97316] px-4 py-2 rounded-lg transition">
                      Bekijk installatie-instructies →
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
                        <Link key={lead.id} href={`/dashboard/leads/${lead.id}`}
                          className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.03] transition group">
                          <div className="flex items-center gap-3 min-w-0">
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${lead.status === 'new' ? 'bg-[#f97316]' : 'bg-transparent'}`} />
                            <div className="min-w-0">
                              <div className="font-semibold text-sm truncate">{lead.name || 'Anoniem'}</div>
                              <div className="text-white/30 text-xs truncate">{lead.email}</div>
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

              {/* Quizzes — 1/3 breedte */}
              <div className="bg-[#0d0d1c] border border-white/[0.08] rounded-2xl overflow-hidden">
                <div className="flex justify-between items-center px-5 py-3.5 border-b border-white/7">
                  <div className="text-xs font-bold uppercase tracking-widest text-white/40">Quizzes</div>
                  <Link href="/dashboard/quiz/new" className="text-xs font-semibold text-[#f97316] hover:text-[#ea6c0a] transition">
                    + Nieuw
                  </Link>
                </div>
                <div className="divide-y divide-white/5">
                  {leadsPerQuiz.map(quiz => (
                    <Link key={quiz.id} href={`/dashboard/quiz/${quiz.id}`}
                      className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.03] transition group">
                      <div className="font-medium text-sm truncate text-white/70">{quiz.name}</div>
                      <div className="flex items-center gap-1.5 flex-shrink-0 ml-3">
                        <span className="text-white/50 text-xs font-semibold tabular-nums">{quiz.leadCount}</span>
                        <span className="text-white/20 text-xs">leads</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  )
}
