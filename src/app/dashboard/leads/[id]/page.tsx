'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { calculateScore } from '@/lib/scoring'

function ScoreRing({ score }: { score: number }) {
  const r = 36
  const stroke = 8
  const circumference = 2 * Math.PI * r
  const filled = (score / 100) * circumference
  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#f97316' : '#ef4444'

  return (
    <div className="flex-shrink-0 relative w-24 h-24">
      <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <circle
          cx="48" cy="48" r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${filled} ${circumference}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-extrabold leading-none" style={{ color }}>{score}%</span>
        <span className="text-[9px] font-bold uppercase tracking-widest text-white/30 mt-0.5">Score</span>
      </div>
    </div>
  )
}

type Question = { id: string; question: string; type: 'multiple' | 'text'; options: string[] }

type Lead = {
  id: string
  name: string
  email: string
  phone: string
  status: string
  created_at: string
  answers: Record<string, string>
  quizzes: { name: string; config: { scoring?: boolean; questions: Question[] } } | null
}

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [loadingDone, setLoadingDone] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)

  useEffect(() => {
    fetch(`/api/leads/${id}/detail`)
      .then(r => r.json())
      .then(data => {
        if (!data || data.error) { setNotFound(true); setLoading(false); return }
        setLead(data)
        setLoading(false)
        if (data.status === 'new') {
          fetch(`/api/leads/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'seen' }),
          })
        }
      })
  }, [id])

  async function handleDone() {
    setLoadingDone(true)
    await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'done' }),
    })
    router.push('/dashboard/leads')
  }

  async function handleDelete() {
    setLoadingDelete(true)
    await fetch(`/api/leads/${id}`, { method: 'DELETE' })
    router.push('/dashboard/leads')
  }

  if (loading) return <div className="px-6 pt-8 text-white/40 text-sm">Laden…</div>

  if (notFound || !lead) return <div className="px-6 pt-8 text-white/40">Lead niet gevonden.</div>

  const questions: Question[] = lead.quizzes?.config?.questions || []
  const score = lead.quizzes?.config ? calculateScore(lead.quizzes.config, lead.answers) : null

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-6 pt-8 pb-6 border-b border-white/[0.07] flex-shrink-0 flex items-end justify-between gap-4">
        <div>
          <Link href="/dashboard/leads" className="text-white/30 hover:text-white text-xs transition inline-flex items-center gap-1 mb-2">
            ← Leads
          </Link>
          <p className="text-[#f97316] text-[10px] font-bold uppercase tracking-widest mb-1.5">Lead</p>
          <h1 className="text-3xl font-extrabold tracking-tight">{lead.name || 'Onbekend'}</h1>
          <p className="text-white/40 text-sm mt-1">{lead.email}{lead.phone ? ` · ${lead.phone}` : ''}</p>
        </div>
        {score !== null && (
          <ScoreRing score={score} />
        )}
      </div>

      <div className="px-6 py-6 max-w-2xl">

      {/* Contactgegevens */}
      <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl overflow-hidden mb-6">
        <div className="px-5 py-3 border-b border-white/7">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/25">Contactgegevens</p>
        </div>
        <div className="divide-y divide-white/5">
          {[
            { label: 'E-mail', value: lead.email },
            { label: 'Telefoon', value: lead.phone },
            { label: 'Adres', value: lead.answers?.adres },
            { label: 'Quiz', value: lead.quizzes?.name },
            { label: 'Datum', value: new Date(lead.created_at).toLocaleDateString('nl-NL') },
          ].map(({ label, value }) => (
            <div key={label} className="grid grid-cols-[120px_1fr] gap-4 px-5 py-3">
              <span className="text-white/30 text-sm">{label}</span>
              <span className="text-white text-sm font-medium">{value || <span className="text-white/20 italic font-normal">—</span>}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz antwoorden */}
      {questions.length > 0 && (
        <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl overflow-hidden mb-8">
          <div className="px-5 py-3 border-b border-white/7">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/25">Antwoorden</p>
          </div>
          <div className="divide-y divide-white/5">
            {questions.map((q, i) => {
              const answer = lead.answers?.[q.id]
              const optionIndex = q.type === 'multiple' ? q.options.indexOf(answer) : -1
              const pts = lead.quizzes?.config?.scoring && q.type === 'multiple' && optionIndex !== -1
                ? q.options.length - optionIndex
                : null
              return (
                <div key={q.id} className="px-5 py-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-white/30 text-xs mb-1.5">{i + 1}. {q.question}</p>
                    <p className="text-white text-sm font-medium">
                      {answer || <span className="text-white/20 italic font-normal">Geen antwoord</span>}
                    </p>
                  </div>
                  {pts !== null && (
                    <span className="text-xs font-bold text-white/30 flex-shrink-0 mt-1">+{pts}pt</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        {lead.status !== 'done' && (
          <button
            onClick={handleDone}
            disabled={loadingDone}
            className="px-5 py-2.5 rounded-xl bg-green-500/10 hover:bg-green-500/20 disabled:opacity-50 text-green-400 text-sm font-semibold transition"
          >
            {loadingDone ? 'Bezig...' : '✓ Afvinken'}
          </button>
        )}
        <button
          onClick={() => setConfirmDelete(true)}
          disabled={loadingDelete}
          className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 disabled:opacity-50 text-white/40 hover:text-red-400 text-sm font-semibold transition"
        >
          Verwijderen
        </button>

        {confirmDelete && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center"
            onClick={() => setConfirmDelete(false)}
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
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-white/50 hover:text-white text-sm font-semibold transition"
                >
                  Annuleren
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loadingDelete}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-semibold transition"
                >
                  {loadingDelete ? 'Bezig...' : 'Verwijderen'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}
