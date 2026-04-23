import { createClient } from '@supabase/supabase-js'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import EmbedClient from './EmbedClient'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

const getQuiz = unstable_cache(
  async (slug: string) => {
    const { data } = await supabase
      .from('quizzes')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
    return data
  },
  ['quiz-by-slug'],
  { revalidate: 30, tags: ['quiz'] }
)

export default async function EmbedQuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const quiz = await getQuiz(slug)

  if (!quiz) notFound()

  return <EmbedClient quiz={quiz} />
}
