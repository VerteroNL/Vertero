'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BETA_HIDE_PRO } from '@/lib/flags'

function FounderBanner() {
  const [dismissed, setDismissed] = useState(false)
  const [status, setStatus] = useState<'loading' | 'founder' | 'not-founder'>('loading')
  const [claiming, setClaiming] = useState(false)
  const [claimError, setClaimError] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [message, setMessage] = useState('')
  const [feedbackState, setFeedbackState] = useState<'idle' | 'loading' | 'done'>('idle')

  useEffect(() => {
    if (localStorage.getItem('founder_banner_dismissed')) { setDismissed(true); return }
    fetch('/api/founding/me')
      .then(r => r.json())
      .then(d => setStatus(d.isFounder ? 'founder' : 'not-founder'))
      .catch(() => setStatus('not-founder'))
  }, [])

  function dismiss() {
    localStorage.setItem('founder_banner_dismissed', '1')
    setDismissed(true)
  }

  async function claimFounder() {
    setClaiming(true)
    setClaimError('')
    try {
      const res = await fetch('/api/founding/me', { method: 'POST' })
      const data = await res.json()
      if (data.full) { setClaimError('Alle plekken zijn helaas vergeven.'); setClaiming(false); return }
      if (!res.ok) throw new Error()
      setStatus('founder')
    } catch {
      setClaimError('Er ging iets mis. Probeer het opnieuw.')
      setClaiming(false)
    }
  }

  async function submitFeedback() {
    if (!message.trim()) return
    setFeedbackState('loading')
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'algemeen', message }),
      })
      if (!res.ok) throw new Error()
      setFeedbackState('done')
      setMessage('')
      setTimeout(() => setFeedbackState('idle'), 2000)
    } catch {
      setFeedbackState('idle')
    }
  }

  if (dismissed || status === 'loading') return null

  if (status === 'not-founder') {
    return (
      <div className="bg-[#f97316]/[0.07] border-b border-[#f97316]/20">
        <div className="px-4 sm:px-6 py-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="bg-white/10 text-white/60 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full flex-shrink-0">
            Founding member
          </span>
          <span className="text-white/50 text-xs flex-1 min-w-0">
            Word founding member en krijg <strong className="text-white/70">3 maanden</strong> ons hoogste abonnement gratis zodra we officieel lanceren.
          </span>
          <button
            onClick={claimFounder}
            disabled={claiming}
            className="bg-[#f97316] hover:bg-[#ea6c0a] disabled:opacity-50 text-white text-[10px] font-bold px-3 py-1 rounded-full transition flex-shrink-0"
          >
            {claiming ? 'Bezig…' : 'Claim je plek →'}
          </button>
          <button onClick={dismiss} className="text-white/20 hover:text-white/50 transition text-xs flex-shrink-0 ml-1">✕</button>
        </div>
        {claimError && (
          <p className="px-4 sm:px-6 pb-2 text-red-400 text-xs">{claimError}</p>
        )}
      </div>
    )
  }


  return (
    <div className="bg-[#f97316]/[0.07] border-b border-[#f97316]/20">
      <div className="px-4 sm:px-6 py-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="bg-[#f97316] text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full flex-shrink-0">
          Founding member
        </span>
        <span className="text-white/50 text-xs flex-1 min-w-0">
          Je bent een van onze eerste gebruikers — we stellen je feedback enorm op prijs.
        </span>
        <button
          onClick={() => setExpanded(v => !v)}
          className="text-[#f97316] text-xs font-semibold hover:opacity-80 transition flex-shrink-0"
        >
          {expanded ? 'Sluiten ↑' : 'Feedback sturen ↓'}
        </button>
        <button onClick={dismiss} className="text-white/20 hover:text-white/50 transition text-xs flex-shrink-0">✕</button>
      </div>
      {expanded && (
        <div className="px-4 sm:px-6 pb-3 flex flex-col sm:flex-row gap-2">
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Wat vind je er tot nu toe van? Wat mis je?"
            rows={2}
            className="flex-1 bg-[#07070f] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/20 outline-none focus:border-[#f97316]/40 transition text-xs resize-none"
          />
          <button
            onClick={submitFeedback}
            disabled={feedbackState === 'loading' || !message.trim()}
            className="bg-[#f97316] hover:bg-[#ea6c0a] disabled:opacity-40 text-white font-bold px-5 py-2 rounded-lg transition text-xs self-end sm:self-auto"
          >
            {feedbackState === 'loading' ? 'Bezig…' : feedbackState === 'done' ? '✓ Verstuurd!' : 'Versturen →'}
          </button>
        </div>
      )}
    </div>
  )
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  const navLinks = (
    <>
      <div className="px-3 pt-4 pb-2">
        <Link onClick={() => setOpen(false)} href="/dashboard/quiz/new"
          className="flex items-center justify-center gap-2 w-full bg-[#f97316] hover:bg-[#ea6c0a] text-white font-bold text-sm py-2.5 rounded-xl transition">
          + Nieuwe quiz
        </Link>
      </div>

      <nav className="flex-1 px-3 py-2 flex flex-col gap-0.5">
        <Link onClick={() => setOpen(false)} href="/dashboard" className="px-3 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition">
          Dashboard
        </Link>
        <Link onClick={() => setOpen(false)} href="/dashboard/leads" className="px-3 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition">
          Leads
        </Link>
        <Link onClick={() => setOpen(false)} href="/dashboard/quiz" className="px-3 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition">
          Mijn quizzes
        </Link>
      </nav>

      <div className="px-3 py-3 border-t border-white/7 flex flex-col gap-0.5">
        <Link onClick={() => setOpen(false)} href="/dashboard/installeren" className="px-3 py-2 rounded-lg text-sm font-medium text-white/30 hover:text-white hover:bg-white/5 transition">
          Installeren
        </Link>
        {!BETA_HIDE_PRO && (
          <Link onClick={() => setOpen(false)} href="/dashboard/billing" className="px-3 py-2 rounded-lg text-sm font-medium text-white/30 hover:text-white hover:bg-white/5 transition">
            Abonnement
          </Link>
        )}
      </div>

      <div className="px-3 py-3 border-t border-white/7 flex flex-col gap-0.5">
        <Link onClick={() => setOpen(false)} href="/dashboard/settings" className="px-3 py-2 rounded-lg text-sm font-medium text-white/30 hover:text-white hover:bg-white/5 transition">
          ⚙ Instellingen
        </Link>
        <form action="/api/logout" method="POST">
          <button type="submit" className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-white/30 hover:text-white hover:bg-white/5 transition">
            Uitloggen
          </button>
        </form>
      </div>
    </>
  )

  return (
    <div className="flex h-screen bg-[#07070f] text-white">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 flex-shrink-0 border-r border-white/7 flex-col sticky top-0 h-screen">
        <div className="px-6 py-5 border-b border-white/7">
          <Link href="/" className="hover:opacity-80 transition inline-block">
            <img src="/logo.png" alt="Vertero" className="h-7" />
          </Link>
        </div>
        {navLinks}
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#07070f]/95 backdrop-blur border-b border-white/7 flex items-center justify-between px-4 py-3">
        <Link href="/" className="hover:opacity-80 transition">
          <img src="/logo.png" alt="Vertero" className="h-7" />
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/5 transition text-white/60 hover:text-white"
          aria-label="Menu openen"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          {/* Drawer */}
          <aside className="relative w-72 max-w-[85vw] bg-[#07070f] border-r border-white/7 flex flex-col h-full overflow-y-auto">
            <div className="px-6 py-5 border-b border-white/7 flex items-center justify-between">
              <Link href="/" onClick={() => setOpen(false)} className="hover:opacity-80 transition">
                <img src="/logo.png" alt="Vertero" className="h-7" />
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition text-white/40 hover:text-white"
                aria-label="Menu sluiten"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            {navLinks}
          </aside>
        </div>
      )}

      {/* Main content — add top padding on mobile for fixed header */}
      <main className="flex-1 min-h-0 overflow-y-auto pt-[57px] md:pt-0 flex flex-col">
        <FounderBanner />
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </main>
    </div>
  )
}
