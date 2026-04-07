'use client'

import { useState } from 'react'

export default function QuizCopyButtons({ quizSlug }: { quizSlug: string }) {
  const [copied, setCopied] = useState<string | null>(null)

  const embedCode = `<iframe src="${window.location.origin}/quiz/${quizSlug}" width="100%" height="600" frameborder="0"></iframe>`
  const directLink = `${window.location.origin}/quiz/${quizSlug}`

  function copyText(text: string, label: string) {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => copyText(embedCode, 'embed')}
        className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-white/10 hover:border-white/20 text-white/40 hover:text-white transition"
      >
        {copied === 'embed' ? '✓ Gekopieerd' : '🔗 Website code'}
      </button>
      <button
        onClick={() => copyText(directLink, 'link')}
        className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-white/10 hover:border-white/20 text-white/40 hover:text-white transition"
      >
        {copied === 'link' ? '✓ Gekopieerd' : '📤 Deel link'}
      </button>
    </div>
  )
}