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

  const totalQuizzes = quizzes?.length || 0
  const totalLeads = leads?.length || 0
  const newLeads = leads?.filter(l => l.status === 'new').length || 0

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl italic">Goedemorgen. 👋</h1>
        <p className="text-white/40 text-sm mt-1">Hier is een overzicht van je account</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-6">
          <div className="text-xs font-bold uppercase tracking-widest text-white/30 mb-2">Quizzes</div>
          <div className="font-mono text-3xl mb-1">{totalQuizzes}</div>
          <div className="text-white/30 text-xs">Actieve widgets</div>
        </div>
        <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-6">
          <div className="text-xs font-bold uppercase tracking-widest text-white/30 mb-2">Leads totaal</div>
          <div className="font-mono text-3xl mb-1">{totalLeads}</div>
          <div className="text-white/30 text-xs">Alle inzendingen</div>
        </div>
        <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-6">
          <div className="text-xs font-bold uppercase tracking-widest text-white/30 mb-2">Nieuwe leads</div>
          <div className="font-mono text-3xl mb-1 text-[#6c5ce7]">{newLeads}</div>
          <div className="text-white/30 text-xs">Nog niet bekeken</div>
        </div>
      </div>

      {/* Quizzes */}
      <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="font-semibold">Mijn quizzes</div>
          <Link href="/dashboard/quiz/new" className="text-xs text-[#6c5ce7] hover:text-[#7d6ef5] font-semibold transition">
            + Nieuwe quiz
          </Link>
        </div>
        {totalQuizzes === 0 ? (
          <div className="text-center py-8 text-white/30 text-sm">
            Nog geen quizzes — <Link href="/dashboard/quiz/new" className="text-[#6c5ce7]">maak je eerste aan</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {quizzes?.map(quiz => (
              <Link key={quiz.id} href={`/dashboard/quiz/${quiz.id}`} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 hover:text-[#6c5ce7] transition">
                <div className="font-medium text-sm">{quiz.name}</div>
                <div className="text-white/30 text-xs font-mono">{quiz.config?.questions?.length || 0} vragen →</div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recente leads */}
      <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="font-semibold">Recente leads</div>
          <Link href="/dashboard/leads" className="text-xs text-[#6c5ce7] hover:text-[#7d6ef5] font-semibold transition">
            Alle leads →
          </Link>
        </div>
        {totalLeads === 0 ? (
          <div className="text-center py-8 text-white/30 text-sm">
            Nog geen leads — embed een quiz op een website om te beginnen
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {leads?.slice(0, 5).map(lead => (
              <div key={lead.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div>
                  <div className="font-medium text-sm">{lead.name || 'Anoniem'}</div>
                  <div className="text-white/30 text-xs">{lead.email}</div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#6c5ce7]/10 text-[#6c5ce7]">
                  Nieuw
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}