'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Props = {
  hasQuizzes: boolean
  firstQuiz?: { id: string; name: string }
}

export default function TutorialCard({ hasQuizzes, firstQuiz }: Props) {
  const [dismissed, setDismissed] = useState(false)
  const [everCopied, setEverCopied] = useState(false)
  const [everInstalled, setEverInstalled] = useState(false)
  const [copied, setCopied] = useState<'link' | 'embed' | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setDismissed(!!localStorage.getItem('tutorial_dismissed'))
    setEverCopied(!!localStorage.getItem('tutorial_copied'))
    setEverInstalled(!!localStorage.getItem('tutorial_installed'))
    setReady(true)
  }, [])

  if (!ready || dismissed) return null

  const step2 = hasQuizzes
  const step3 = everCopied
  const step4 = everInstalled
  const doneCount = [step2, step3, step4].filter(Boolean).length

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://vertero.nl'
  const quizLink = firstQuiz ? `${origin}/quiz/${firstQuiz.id}` : ''
  const embedCode = firstQuiz
    ? `<script src="https://vertero.nl/widget.js"></script>\n<button data-vertero="${firstQuiz.id}">Vraag offerte aan</button>`
    : ''

  function copy(text: string, type: 'link' | 'embed') {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setEverCopied(true)
    localStorage.setItem('tutorial_copied', '1')
    setTimeout(() => setCopied(null), 2000)
  }

  function markInstalled() {
    setEverInstalled(true)
    localStorage.setItem('tutorial_installed', '1')
  }

  function dismiss() {
    localStorage.setItem('tutorial_dismissed', '1')
    setDismissed(true)
  }

  return (
    <div className="mb-6 bg-[#0d0d1c] border border-white/[0.08] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-white/[0.05] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="font-bold text-sm">Aan de slag</p>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/25">
            {doneCount + 1} / 4
          </span>
        </div>
        <button onClick={dismiss} className="text-white/20 hover:text-white/50 transition text-xs">
          Verberg
        </button>
      </div>

      <div className="divide-y divide-white/[0.05]">

        {/* Stap 1 — altijd klaar */}
        <Step n={1} label="Account aangemaakt" done />

        {/* Stap 2 — quiz maken */}
        <Step n={2} label="Maak je eerste quiz" done={step2} active={!step2}>
          <Link
            href="/dashboard/quiz/new"
            className="inline-block bg-[#f97316] hover:bg-[#ea6c0a] text-white text-xs font-bold px-4 py-2 rounded-lg transition"
          >
            Start nu →
          </Link>
        </Step>

        {/* Stap 3 — embed of link kopiëren */}
        <Step
          n={3}
          label="Kopieer je link of embed code"
          done={step3}
          active={step2 && !step3}
          locked={!step2}
        >
          <div className="flex flex-col gap-2">
            {/* Directe link */}
            <div className="flex items-center gap-2">
              <div className="flex-1 min-w-0 bg-[#07070f] border border-white/8 rounded-lg px-3 py-1.5 font-mono text-xs text-white/40 truncate">
                {quizLink}
              </div>
              <button
                onClick={() => copy(quizLink, 'link')}
                className="flex-shrink-0 text-xs font-semibold text-[#f97316] hover:opacity-75 transition whitespace-nowrap"
              >
                {copied === 'link' ? '✓ Gekopieerd' : 'Kopieer link'}
              </button>
            </div>
            {/* Embed code */}
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0 bg-[#07070f] border border-white/8 rounded-lg px-3 py-1.5 font-mono text-[10px] text-white/40 whitespace-pre leading-relaxed overflow-hidden">
                {embedCode}
              </div>
              <button
                onClick={() => copy(embedCode, 'embed')}
                className="flex-shrink-0 text-xs font-semibold text-[#f97316] hover:opacity-75 transition whitespace-nowrap pt-1"
              >
                {copied === 'embed' ? '✓ Gekopieerd' : 'Kopieer embed'}
              </button>
            </div>
          </div>
        </Step>

        {/* Stap 4 — installeren */}
        <Step
          n={4}
          label="Installeer op je website"
          done={step4}
          active={step2 && step3 && !step4}
          locked={!step2 || !step3}
        >
          <Link
            href="/dashboard/installeren"
            onClick={markInstalled}
            className="inline-block bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
          >
            Bekijk installatie-instructies →
          </Link>
        </Step>

      </div>
    </div>
  )
}

function Step({ n, label, done, active, locked, children }: {
  n: number
  label: string
  done?: boolean
  active?: boolean
  locked?: boolean
  children?: React.ReactNode
}) {
  return (
    <div className={`px-5 py-4 transition-colors ${active ? 'bg-[#f97316]/[0.025]' : ''}`}>
      <div className="flex items-center gap-3">
        <span className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold border ${
          done
            ? 'bg-green-500/15 border-green-500/30 text-green-400'
            : active
            ? 'border-[#f97316]/60 text-[#f97316]'
            : 'border-white/10 text-white/20'
        }`}>
          {done ? '✓' : n}
        </span>
        <span className={`text-sm font-medium ${
          done ? 'line-through text-white/25' : locked ? 'text-white/25' : 'text-white'
        }`}>
          {label}
        </span>
      </div>
      {active && children && (
        <div className="mt-3 ml-9">{children}</div>
      )}
    </div>
  )
}
