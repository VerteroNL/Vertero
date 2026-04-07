'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function QuizActions({ quizId, quizName, quizSlug, active }: {
  quizId: string
  quizName: string
  quizSlug: string
  active: boolean
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  async function toggleActive() {
    setLoading(true)
    await fetch(`/api/quiz/${quizId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active })
    })
    router.refresh()
    setLoading(false)
  }

  async function duplicate() {
    setLoading(true)
    await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: `${quizName} (kopie)`, duplicate_from: quizId })
    })
    router.refresh()
    setLoading(false)
  }

  async function deleteQuiz() {
    setLoading(true)
    await fetch(`/api/quiz/${quizId}`, { method: 'DELETE' })
    router.refresh()
    setLoading(false)
    setShowConfirm(false)
  }

  return (
    <>
      <div className="flex items-center gap-1.5">
        <button
          onClick={toggleActive}
          disabled={loading}
          className={`flex-1 text-xs font-semibold py-2 px-3 rounded-lg border transition ${
            active
              ? 'border-[#f97316]/30 text-[#f97316] hover:bg-[#f97316]/10'
              : 'border-white/10 text-white/30 hover:border-white/20 hover:text-white/50'
          }`}
        >
          {active ? 'Actief' : 'Inactief'}
        </button>
        <button
          onClick={duplicate}
          disabled={loading}
          className="flex-1 text-xs font-semibold py-2 px-3 rounded-lg border border-white/10 hover:border-white/20 text-white/50 hover:text-white transition"
        >
          Dupliceer
        </button>
        <button
          onClick={() => setShowConfirm(true)}
          className="flex-1 text-xs font-semibold py-2 px-3 rounded-lg border border-red-500/20 text-red-400/50 hover:border-red-500/40 hover:text-red-400 transition"
        >
          Verwijder
        </button>
      </div>

      {showConfirm && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-8 w-full max-w-sm mx-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-2xl mb-4">🗑️</div>
            <div className="font-semibold text-lg mb-2">Quiz verwijderen?</div>
            <div className="text-white/40 text-sm mb-6 leading-relaxed">
              Je staat op het punt <span className="text-white font-medium">"{quizName}"</span> te verwijderen. Dit kan niet ongedaan worden gemaakt.
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/20 text-sm font-semibold transition"
              >
                Annuleren
              </button>
              <button
                onClick={deleteQuiz}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-semibold border border-red-500/20 transition disabled:opacity-40"
              >
                {loading ? 'Verwijderen...' : 'Ja, verwijder'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}