'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LeadRowActions({ leadId, deleteOnly }: { leadId: string; deleteOnly?: boolean }) {
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDone(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    await fetch(`/api/leads/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'done' }),
    })
    router.refresh()
  }

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    await fetch(`/api/leads/${leadId}`, { method: 'DELETE' })
    router.refresh()
    setLoading(false)
    setShowConfirm(false)
  }

  return (
    <>
      <div className="flex items-center gap-1">
        {!deleteOnly && (
          <button
            onClick={handleDone}
            title="Afvinken"
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-green-500/20 text-white/40 hover:text-green-400 transition text-sm"
          >
            ✓
          </button>
        )}
        <button
          onClick={e => { e.preventDefault(); e.stopPropagation(); setShowConfirm(true) }}
          title="Verwijderen"
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition text-sm"
        >
          🗑
        </button>
      </div>

      {showConfirm && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center"
          onClick={e => { e.preventDefault(); e.stopPropagation(); setShowConfirm(false) }}
        >
          <div
            className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-8 w-full max-w-sm mx-4 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </div>
            <div className="font-bold text-base mb-1.5">Lead verwijderen</div>
            <div className="text-white/40 text-sm leading-relaxed mb-7">
              Weet je zeker dat je deze lead wilt verwijderen? Dit kan niet ongedaan worden gemaakt.
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-white/50 hover:text-white text-sm font-semibold transition"
              >
                Annuleren
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition disabled:opacity-40"
              >
                {loading ? 'Verwijderen...' : 'Verwijderen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
