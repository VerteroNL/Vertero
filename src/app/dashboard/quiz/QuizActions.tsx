'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function QuizActions({ quizId, quizName, quizSlug, active }: {
  quizId: string
  quizName: string
  quizSlug: string
  active: boolean
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  async function toggleActive() {
    setLoading(true)
    setOpen(false)
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
    setOpen(false)
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
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(o => !o)}
          disabled={loading}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 hover:border-white/20 text-white/40 hover:text-white transition text-sm disabled:opacity-40"
          title="Meer opties"
        >
          ···
        </button>

        {open && (
          <div className="absolute right-0 top-10 z-50 bg-[#0d0d1c] border border-white/10 rounded-xl shadow-xl w-44 py-1 overflow-hidden">
            <button
              onClick={toggleActive}
              className="w-full text-left px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition"
            >
              {active ? 'Zet inactief' : 'Zet actief'}
            </button>
            <button
              onClick={duplicate}
              className="w-full text-left px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition"
            >
              Dupliceren
            </button>
            <div className="border-t border-white/5 my-1" />
            <button
              onClick={() => { setOpen(false); setShowConfirm(true) }}
              className="w-full text-left px-4 py-2.5 text-sm text-red-400/70 hover:text-red-400 hover:bg-white/5 transition"
            >
              Verwijderen
            </button>
          </div>
        )}
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
