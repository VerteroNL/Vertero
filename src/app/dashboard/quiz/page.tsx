import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import QuizActions from './QuizActions'
import QuizCopyButtons from './QuizCopyButtons'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export default async function QuizPage() {
  const { userId } = await auth()

  const { data: quizzes } = await supabase
    .from('quizzes')
    .select('*, leads(count)')
    .eq('user_id', userId!)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex justify-between items-start mb-10">
        <div>
          <p className="text-[#f97316] text-xs font-bold uppercase tracking-widest mb-2">Quiz</p>
          <h1 className="text-3xl font-extrabold tracking-tight">Mijn quizzes</h1>
          <p className="text-white/40 text-sm mt-1">{quizzes?.length || 0} quizzes</p>
        </div>
        <Link
          href="/dashboard/quiz/new"
          className="bg-[#f97316] hover:bg-[#ea6c0a] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
        >
          + Nieuwe quiz
        </Link>
      </div>

      {quizzes?.length === 0 ? (
        <div className="border border-dashed border-white/10 rounded-2xl p-20 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#f97316]/10 border border-[#f97316]/20 flex items-center justify-center text-[#f97316] font-bold text-xl mx-auto mb-4">+</div>
          <div className="font-semibold mb-2">Nog geen quizzes</div>
          <div className="text-white/40 text-sm mb-6">Maak je eerste quiz aan en embed hem op elke website</div>
          <Link
            href="/dashboard/quiz/new"
            className="bg-[#f97316] hover:bg-[#ea6c0a] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
          >
            + Eerste quiz aanmaken
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {quizzes?.map(quiz => {
            const leadCount = quiz.leads?.[0]?.count || 0
            const questionCount = quiz.config?.questions?.length || 0
            const initials = quiz.name.slice(0, 2).toUpperCase()

            return (
              <div key={quiz.id} className="bg-[#0d0d1c] border border-white/10 hover:border-white/20 rounded-2xl p-5 flex flex-col gap-4 transition">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#f97316]/10 border border-[#f97316]/20 flex items-center justify-center text-[#f97316] font-bold text-xs flex-shrink-0">
                    {initials}
                  </div>
                  <QuizCopyButtons quizSlug={quiz.slug} />
                </div>

                <div>
                  <div className="font-semibold text-sm mb-0.5">{quiz.name}</div>
                  <div className="font-mono text-xs text-white/20 truncate">{quiz.slug}</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#07070f] rounded-xl p-3 border border-white/5">
                    <div className="text-lg font-extrabold">{leadCount}</div>
                    <div className="text-white/30 text-xs mt-0.5">Leads</div>
                  </div>
                  <div className="bg-[#07070f] rounded-xl p-3 border border-white/5">
                    <div className="text-lg font-extrabold">{questionCount}</div>
                    <div className="text-white/30 text-xs mt-0.5">Vragen</div>
                  </div>
                </div>

                <div className="pt-1 border-t border-white/5 flex flex-col gap-2">
                  <Link
                    href={`/dashboard/quiz/${quiz.id}`}
                    className="block w-full text-center text-xs font-semibold py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition"
                  >
                    Bewerken →
                  </Link>
                  <QuizActions quizId={quiz.id} quizName={quiz.name} quizSlug={quiz.slug} active={quiz.active} />
                </div>
              </div>
            )
          })}

          <Link
            href="/dashboard/quiz/new"
            className="border border-dashed border-white/10 hover:border-[#f97316]/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-white/20 hover:text-white/50 transition min-h-52"
          >
            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center font-bold text-xl">+</div>
            <div className="text-sm font-semibold">Nieuwe quiz</div>
            <div className="text-xs">Kies een template</div>
          </Link>
        </div>
      )}
    </div>
  )
}
