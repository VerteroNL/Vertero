interface Question {
  id: string
  type: 'multiple' | 'text'
  options: string[]
}

interface QuizConfig {
  scoring?: boolean
  questions: Question[]
}

export function calculateScore(
  config: QuizConfig,
  answers: Record<string, string>
): number | null {
  if (!config?.scoring) return null

  const scorableQuestions = config.questions.filter(
    (q) => q.type === 'multiple' && q.options.length > 0
  )
  if (scorableQuestions.length === 0) return null

  let earned = 0
  let max = 0

  for (const q of scorableQuestions) {
    const n = q.options.length
    max += n
    const answer = answers?.[q.id]
    const index = q.options.indexOf(answer)
    if (index !== -1) {
      earned += n - index
    }
  }

  if (max === 0) return null
  return Math.round((earned / max) * 100)
}

export function scoreColor(score: number): string {
  if (score >= 70) return 'text-green-400 bg-green-400/10 border-green-400/20'
  if (score >= 40) return 'text-orange-400 bg-orange-400/10 border-orange-400/20'
  return 'text-red-400 bg-red-400/10 border-red-400/20'
}
