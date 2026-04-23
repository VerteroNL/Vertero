import { createClient } from '@supabase/supabase-js'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import QuizClient from './QuizClient'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

const getQuiz = (slug: string) => unstable_cache(
  async () => {
    const { data } = await supabase
      .from('quizzes')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
    return data
  },
  [`quiz-${slug}`],
  { revalidate: 30, tags: [`quiz-${slug}`] }
)()

export default async function PublicQuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const quiz = await getQuiz(slug)

  if (!quiz) notFound()

  return <QuizClient quiz={quiz} />
}
