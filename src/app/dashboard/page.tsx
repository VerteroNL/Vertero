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

  const totalQuizzes = quizzes?.length || 0
  const totalLeads = leads?.length || 0
  const newLeads = leads?.filter(l => l.status === 'new').length || 0

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-10">
        <p className="text-[#f97316] text-xs font-bold uppercase tracking-widest mb-2">Dashboard</p>
        <h1 className="text-3xl font-extrabold tracking-tight">Goedemorgen.</h1>
        <p className="text-white/40 text-sm mt-1">Hier is een overzicht van je account.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition">
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Quizzes</div>
          <div className="text-4xl font-extrabold mb-1">{totalQuizzes}</div>
          <div className="text-white/30 text-xs">Actieve widgets</div>
        </div>
        <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition">
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Leads totaal</div>
          <div className="text-4xl font-extrabold mb-1">{totalLeads}</div>
          <div className="text-white/30 text-xs">Alle inzendingen</div>
        </div>
        <div className="bg-[#0d0d1c] border border-[#f97316]/20 rounded-2xl p-6 hover:border-[#f97316]/40 transition">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#f97316]/60 mb-3">Nieuwe leads</div>
          <div className="text-4xl font-extrabold mb-1 text-[#f97316]">{newLeads}</div>
          <div className="text-white/30 text-xs">Nog niet bekeken</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Quizzes */}
        <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 border-b border-white/7">
            <div className="text-sm font-semibold">Mijn quizzes</div>
            <Link href="/dashboard/quiz/new" className="text-xs font-semibold text-[#f97316] hover:text-[#ea6c0a] transition">
              + Nieuwe quiz
            </Link>
          </div>
          {totalQuizzes === 0 ? (
            <div className="px-6 py-10 text-center text-white/30 text-sm">
              Nog geen quizzes —{' '}
              <Link href="/dashboard/quiz/new" className="text-[#f97316] hover:text-[#ea6c0a] transition">
                maak je eerste aan
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {quizzes?.map(quiz => (
                <Link
                  key={quiz.id}
                  href={`/dashboard/quiz/${quiz.id}`}
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-white/[0.03] transition"
                >
                  <div className="font-medium text-sm">{quiz.name}</div>
                  <div className="text-white/30 text-xs font-mono">{quiz.config?.questions?.length || 0} vragen →</div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recente leads */}
        <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 border-b border-white/7">
            <div className="text-sm font-semibold">Recente leads</div>
            <Link href="/dashboard/leads" className="text-xs font-semibold text-[#f97316] hover:text-[#ea6c0a] transition">
              Alle leads →
            </Link>
          </div>
          {totalLeads === 0 ? (
            <div className="px-6 py-10 text-center text-white/30 text-sm">
              Nog geen leads — embed een quiz op een website om te beginnen
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {leads?.slice(0, 5).map(lead => (
                <Link
                  key={lead.id}
                  href={`/dashboard/leads/${lead.id}`}
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-white/[0.03] transition"
                >
                  <div>
                    <div className="font-medium text-sm">{lead.name || 'Anoniem'}</div>
                    <div className="text-white/30 text-xs mt-0.5">{lead.email}</div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#f97316]/10 text-[#f97316]">
                    Nieuw
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
