'use client'

import { useState } from 'react'
import Link from 'next/link'

type Question = {
  id: string
  question: string
  options: string[]
  branches?: Record<number, string>
}

const QUESTIONS: Question[] = [
  {
    id: '1',
    question: 'Wat voor werk zoek je?',
    options: ['Verbouwing / renovatie', 'Nieuwbouw', 'Onderhoud / reparatie', 'Weet ik nog niet'],
    branches: { 0: '2', 1: '3', 2: '4', 3: '5' },
  },
  {
    id: '2',
    question: 'Welk deel van de woning of het pand?',
    options: ['Keuken', 'Badkamer', 'Woonkamer of slaapkamer', 'Heel de woning'],
    branches: { 0: '5', 1: '5', 2: '5', 3: '5' },
  },
  {
    id: '3',
    question: 'Wat voor gebouw gaat het om?',
    options: ['Woning', 'Uitbouw / aanbouw', 'Garage of berging', 'Bedrijfspand'],
    branches: { 0: '5', 1: '5', 2: '5', 3: '5' },
  },
  {
    id: '4',
    question: 'Wat is er aan de hand?',
    options: ['Lekkage', 'Scheuren of verzakking', 'Dak of goot', 'Iets anders'],
    branches: { 0: '5', 1: '5', 2: '5', 3: '5' },
  },
  {
    id: '5',
    question: 'Wat is je budget globaal?',
    options: ['Minder dan €5.000', '€5.000 – €20.000', '€20.000 – €50.000', 'Meer dan €50.000'],
  },
  {
    id: '6',
    question: 'Wanneer wil je starten?',
    options: ['Zo snel mogelijk', 'Binnen 1–3 maanden', 'Later dit jaar', 'Nog niet zeker'],
    branches: { 0: '__contact__', 1: '__contact__', 2: '__contact__', 3: '__contact__' },
  },
]

const byId = Object.fromEntries(QUESTIONS.map(q => [q.id, q]))

export default function DemoPage() {
  const [currentId, setCurrentId] = useState('1')
  const [history, setHistory] = useState<string[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [stage, setStage] = useState<'quiz' | 'done'>('quiz')

  const current = byId[currentId]
  const progress = (history.length / (QUESTIONS.length - 1)) * 100

  function advance(optionIndex: number) {
    const next = current.branches?.[optionIndex]

    if (!next) {
      const idx = QUESTIONS.findIndex(q => q.id === currentId)
      const nextQ = QUESTIONS[idx + 1]
      if (!nextQ) { setStage('done'); setSelected(null); return }
      setHistory(h => [...h, currentId])
      setCurrentId(nextQ.id)
      setSelected(null)
      return
    }

    if (next === '__contact__') {
      setStage('done')
      setSelected(null)
      return
    }

    setHistory(h => [...h, currentId])
    setCurrentId(next)
    setSelected(null)
  }

  function goBack() {
    if (history.length === 0) return
    const prev = history[history.length - 1]
    setHistory(h => h.slice(0, -1))
    setCurrentId(prev)
    setSelected(null)
    setStage('quiz')
  }

  return (
    <div className="min-h-screen bg-[#07070f] text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-white/7 px-5 py-4 flex items-center justify-between">
        <Link href="/" className="hover:opacity-70 transition">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Vertero" className="h-7" />
        </Link>
        <span className="text-white/30 text-xs">Demo quiz · Aannemer</span>
      </div>

      {/* Quiz */}
      <div className="flex-1 flex items-center justify-center px-5 py-8 md:py-14">
        <div className="w-full max-w-lg">
          {stage === 'quiz' ? (
            <>
              {/* Progress */}
              <div className="w-full bg-white/5 rounded-full h-1 mb-10">
                <div
                  className="bg-[#f97316] h-1 rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(8, progress)}%` }}
                />
              </div>

              <p className="text-white/40 text-xs mb-3">Vraag {history.length + 1}</p>
              <h2 className="text-2xl md:text-3xl font-extrabold mb-8 leading-snug">
                {current.question}
              </h2>

              <div className="flex flex-col gap-3 mb-6">
                {current.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setSelected(i)}
                    className={`text-left px-5 py-4 rounded-xl border transition text-sm font-medium ${
                      selected === i
                        ? 'border-[#f97316] bg-[#f97316]/10 text-white'
                        : 'border-white/10 hover:border-white/25 text-white/70 hover:text-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between">
                {history.length > 0 ? (
                  <button onClick={goBack} className="text-white/25 hover:text-white/50 text-xs transition">
                    ← Vorige
                  </button>
                ) : <div />}
                <button
                  onClick={() => selected !== null && advance(selected)}
                  className="bg-[#f97316] hover:bg-[#ea6c0a] text-white font-bold px-6 py-2.5 rounded-xl transition text-sm"
                >
                  Volgende →
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#f97316]/10 border border-[#f97316]/20 flex items-center justify-center mx-auto mb-6 text-2xl text-[#f97316]">
                ✓
              </div>
              <h2 className="text-2xl font-extrabold mb-3">Bedankt!</h2>
              <p className="text-white/40 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
                Dit is hoe jouw klanten een aanvraag insturen. Jij ziet naam, telefoonnummer en alle antwoorden direct in je dashboard.
              </p>

              {/* Dashboard mockup */}
              <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl overflow-hidden mb-8 text-left">
                <div className="px-4 py-3 border-b border-white/7 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Nieuwe lead</span>
                  <span className="w-2 h-2 rounded-full bg-[#f97316]" />
                </div>
                <div className="px-4 py-4 border-b border-white/7 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-sm">Jan de Vries</p>
                    <p className="text-white/35 text-xs mt-0.5">jan@email.nl &nbsp;·&nbsp; 06-12 345 678</p>
                  </div>
                  <span className="text-white/25 text-xs tabular-nums flex-shrink-0">10:42</span>
                </div>
                <div className="px-4 py-4 flex flex-col gap-2">
                  {[
                    ['Type werk', 'Verbouwing / renovatie'],
                    ['Onderdeel', 'Badkamer'],
                    ['Budget', '€5.000 – €20.000'],
                    ['Wanneer starten', 'Zo snel mogelijk'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="text-white/25 text-xs w-24 flex-shrink-0">{label}</span>
                      <span className="text-white/70 text-xs font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#f97316]/[0.07] border border-[#f97316]/25 rounded-2xl p-8">
                <p className="text-white font-bold mb-2">Wil je zo'n quiz op jouw website?</p>
                <p className="text-white/45 text-sm mb-6">Klaar in 15 minuten. Geen creditcard nodig.</p>
                <Link
                  href="/dashboard"
                  className="inline-block bg-[#f97316] hover:bg-[#ea6c0a] text-white font-bold px-8 py-3.5 rounded-xl transition"
                >
                  Maak je eigen quiz gratis →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
