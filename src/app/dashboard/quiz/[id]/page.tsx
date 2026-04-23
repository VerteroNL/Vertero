import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import QuizEditor from './QuizEditor'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { userId } = await auth()

  const { data: quiz } = await supabase
    .from('quizzes')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId!)
    .maybeSingle()

  if (!quiz) notFound()

  return <QuizEditor quiz={quiz} />
}
