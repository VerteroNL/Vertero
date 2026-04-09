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

  quizzes?.sort((a, b) => (b.leads?.[0]?.count || 0) - (a.leads?.[0]?.count || 0))

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Mijn quizzes</h1>
          <p className="text-white/30 text-sm mt-1">{quizzes?.length || 0} quizzes</p>
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

            return (
              <div key={quiz.id} className="bg-[#0d0d1c] border border-white/10 hover:border-white/[0.18] rounded-2xl overflow-hidden flex flex-col transition group">

                {/* Body */}
                <div className="flex-1 px-6 pt-6 pb-5">
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div className="min-w-0">
                      <div className="font-bold text-[15px] leading-snug truncate">{quiz.name}</div>
                      <div className="font-mono text-xs text-white/20 truncate mt-1">{quiz.slug}</div>
                    </div>
                    <QuizActions quizId={quiz.id} quizName={quiz.name} quizSlug={quiz.slug} active={quiz.active} />
                  </div>

                  <div className="flex items-end gap-2">
                    <div className="text-3xl font-extrabold text-[#f97316]">{leadCount}</div>
                    <div className="text-[11px] text-white/30 mb-1">lead{leadCount !== 1 ? 's' : ''} ontvangen</div>
                  </div>
                  <div className="text-[11px] text-white/20 mt-1">{questionCount} vragen</div>
                </div>

                {/* Footer */}
                <div className="border-t border-white/5 px-4 py-3 flex items-center gap-2 bg-white/[0.02]">
                  <Link
                    href={`/dashboard/quiz/${quiz.id}`}
                    className="flex-1 text-center text-xs font-semibold py-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition"
                  >
                    Bewerken →
                  </Link>
                  <div className="w-px h-5 bg-white/5" />
                  <QuizCopyButtons quizSlug={quiz.slug} />
                </div>
              </div>
            )
          })}

          <Link
            href="/dashboard/quiz/new"
            className="border border-dashed border-white/[0.07] hover:border-white/20 rounded-2xl flex flex-col items-center justify-center gap-2 text-white/20 hover:text-white/40 transition min-h-[160px]"
          >
            <span className="text-2xl leading-none">+</span>
            <span className="text-xs font-semibold">Nieuwe quiz</span>
          </Link>
        </div>
      )}
    </div>
  )
}
