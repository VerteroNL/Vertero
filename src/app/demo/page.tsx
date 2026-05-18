'use client'

import { useState } from 'react'
import Link from 'next/link'

type Branch = 'kozijnen' | 'badkamer' | 'keuken'

const QUIZZES: Record<Branch, { steps: { question: string; options: string[] }[] }> = {
  kozijnen: {
    steps: [
      { question: 'Wat wil je vervangen?', options: ['Enkele kozijnen', 'Alle kozijnen in huis', 'Kozijnen + deuren'] },
      { question: 'Hoeveel kozijnen gaat het om?', options: ['1 tot 3', '4 tot 8', '9+'] },
      { question: 'Welk materiaal?', options: ['Kunststof', 'Aluminium', 'Hout', 'Weet ik nog niet'] },
      { question: 'Wanneer wil je starten?', options: ['Binnen 1 maand', '1 tot 3 maanden', 'Nog niet zeker'] },
      { question: 'Wat is je globale budget?', options: ['Onder €2.000', '€2.000 tot €8.000', 'Boven €8.000', 'Weet ik nog niet'] },
    ],
  },
  badkamer: {
    steps: [
      { question: 'Wat wil je laten doen?', options: ['Volledige renovatie', 'Gedeeltelijke renovatie', 'Alleen sanitair vervangen'] },
      { question: 'Huur of eigen woning?', options: ['Eigen woning', 'Huurwoning'] },
      { question: 'Wat is je budget?', options: ['Onder €5.000', '€5.000 tot €15.000', 'Boven €15.000', 'Weet ik nog niet'] },
      { question: 'Wanneer wil je starten?', options: ['Binnen 1 maand', '1 tot 3 maanden', 'Nog niet zeker'] },
      { question: 'Heb je al een idee van het ontwerp?', options: ['Ja, ik weet wat ik wil', 'Nog niet, ik zoek advies'] },
    ],
  },
  keuken: {
    steps: [
      { question: 'Wat wil je laten doen?', options: ['Complete nieuwe keuken', 'Keuken renoveren', 'Alleen apparatuur vervangen'] },
      { question: 'Nieuwbouw of bestaande woning?', options: ['Nieuwbouw', 'Bestaande woning'] },
      { question: 'Wat is je budget?', options: ['Onder €5.000', '€5.000 tot €15.000', 'Boven €15.000', 'Weet ik nog niet'] },
      { question: 'Wanneer wil je starten?', options: ['Binnen 1 maand', '1 tot 3 maanden', 'Nog niet zeker'] },
      { question: 'Heb je al een meting laten doen?', options: ['Ja', 'Nee, dat moet nog gebeuren'] },
    ],
  },
}

type ResultCard = {
  samenvatting: string
  budget: string
  timing: string
  score: 'goed' | 'matig' | 'slecht'
  advies: string
}

function scoreAanvraag(branch: Branch, antwoorden: string[]): ResultCard {
  let punten = 0
  let budget = 'Onbekend'
  let timing = 'Onbekend'

  for (const a of antwoorden) {
    const v = a.split(': ').slice(1).join(': ')

    // Budget
    if (v.includes('Boven €8.000') || v.includes('Boven €15.000')) { punten += 2; budget = v }
    else if (v.includes('€2.000 tot €8.000') || v.includes('€5.000 tot €15.000')) { punten += 1; budget = v }
    else if (v.includes('Onder €2.000') || v.includes('Onder €5.000')) { punten -= 1; budget = v }
    else if (v === 'Weet ik nog niet' && antwoorden.some(x => x.toLowerCase().includes('budget'))) { budget = v }

    // Timing
    if (v === 'Binnen 1 maand') { punten += 2; timing = v }
    else if (v === '1 tot 3 maanden') { punten += 1; timing = v }
    else if (v === 'Nog niet zeker') { punten -= 1; timing = v }

    // Woning (badkamer / keuken)
    if (v === 'Eigen woning') punten += 1
    else if (v === 'Huurwoning') punten -= 1

    // Hoeveelheid (kozijnen)
    if (v === '9+') punten += 2
    else if (v === '4 tot 8') punten += 1
  }

  const score: ResultCard['score'] = punten >= 4 ? 'goed' : punten >= 2 ? 'matig' : 'slecht'
  const advies =
    score === 'goed' ? 'Bel deze persoon binnen 10 minuten terug.' :
    score === 'matig' ? 'Bel vandaag nog terug om budget en planning te bespreken.' :
    'Stuur een automatische opvolgmail en wacht af.'

  // Samenvatting per branche
  let samenvatting = ''
  if (branch === 'kozijnen') {
    const aantal = antwoorden.find(a => a.includes('Hoeveel'))?.split(': ')[1] ?? '?'
    const materiaal = antwoorden.find(a => a.includes('materiaal'))?.split(': ')[1] ?? '?'
    samenvatting = `Aanvraag voor ${aantal} kozijnen in ${materiaal.toLowerCase()}, budget ${budget}, start ${timing.toLowerCase()}.`
  } else if (branch === 'badkamer') {
    const type = antwoorden.find(a => a.includes('laten doen'))?.split(': ')[1] ?? '?'
    const woning = antwoorden.find(a => a.includes('woning'))?.split(': ')[1] ?? '?'
    samenvatting = `${type} in ${woning.toLowerCase()}, budget ${budget}, start ${timing.toLowerCase()}.`
  } else {
    const type = antwoorden.find(a => a.includes('laten doen'))?.split(': ')[1] ?? '?'
    const woning = antwoorden.find(a => a.includes('Nieuwbouw'))?.split(': ')[1] ?? antwoorden.find(a => a.includes('woning'))?.split(': ')[1] ?? '?'
    samenvatting = `${type} in ${woning.toLowerCase()}, budget ${budget}, start ${timing.toLowerCase()}.`
  }

  return { samenvatting, budget, timing, score, advies }
}

const SCORE_STYLE: Record<ResultCard['score'], string> = {
  goed: 'border-green-500/40 bg-green-500/5',
  matig: 'border-[#f97316]/40 bg-[#f97316]/5',
  slecht: 'border-red-500/40 bg-red-500/5',
}
const SCORE_DOT: Record<ResultCard['score'], string> = {
  goed: 'bg-green-500',
  matig: 'bg-[#f97316]',
  slecht: 'bg-red-500',
}
const SCORE_LABEL: Record<ResultCard['score'], string> = {
  goed: 'Serieuze aanvraag',
  matig: 'Matige aanvraag',
  slecht: 'Niet gekwalificeerd',
}

function QuizFlow({ branch }: { branch: Branch }) {
  const { steps } = QUIZZES[branch]
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [phase, setPhase] = useState<'quiz' | 'loading' | 'result'>('quiz')
  const [result, setResult] = useState<ResultCard | null>(null)

  const current = steps[step]
  const progress = ((step) / steps.length) * 100

  function choose(i: number) {
    setSelected(i)
  }

  async function next() {
    if (selected === null) return
    const newAnswers = [...answers, `${current.question}: ${current.options[selected]}`]
    setAnswers(newAnswers)
    setSelected(null)

    if (step < steps.length - 1) {
      setStep(s => s + 1)
      return
    }

    setPhase('loading')
    await new Promise(r => setTimeout(r, 3000))
    setResult(scoreAanvraag(branch, newAnswers))
    setPhase('result')
  }

  function reset() {
    setStep(0)
    setAnswers([])
    setSelected(null)
    setPhase('quiz')
    setResult(null)
  }

  if (phase === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-[#f97316] animate-spin" />
        <p className="text-white/40 text-sm">Aanvraag wordt beoordeeld…</p>
      </div>
    )
  }

  if (phase === 'result' && result) {
    return (
      <div className="py-6 max-w-md mx-auto">
        <div className={`border rounded-2xl p-6 mb-6 ${SCORE_STYLE[result.score]}`}>
          <div className="flex items-center gap-2 mb-4">
            <span className={`w-2 h-2 rounded-full ${SCORE_DOT[result.score]}`} />
            <span className="text-xs font-bold uppercase tracking-widest text-white/50">{SCORE_LABEL[result.score]}</span>
          </div>
          <p className="text-white font-medium text-sm mb-5 leading-relaxed">{result.samenvatting}</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Budget', value: result.budget },
              { label: 'Timing', value: result.timing },
            ].map(f => (
              <div key={f.label} className="bg-black/20 rounded-xl px-4 py-3">
                <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-1">{f.label}</p>
                <p className="text-white/80 text-sm font-medium">{f.value}</p>
              </div>
            ))}
          </div>
          {result.advies && (
            <div className="mt-4 pt-4 border-t border-white/[0.08]">
              <p className="text-white/35 text-[10px] font-bold uppercase tracking-widest mb-1">Advies</p>
              <p className="text-white/60 text-sm leading-relaxed">{result.advies}</p>
            </div>
          )}
        </div>

        <p className="text-white/40 text-sm text-center mb-6 leading-relaxed">
          Dit krijg jij voortaan op je telefoon. Alleen van mensen die het menen.
        </p>

        <div className="bg-[#0d0d1c] border border-white/[0.08] rounded-2xl p-6 mb-4">
          <p className="font-bold text-base mb-2">Overtuigd?</p>
          <p className="text-white/45 text-sm leading-relaxed mb-4">Wij zetten dit binnen 48 uur live op jouw website. Geen gedoe, geen technische kennis nodig.</p>
          <Link href="/contact" className="inline-block bg-[#f97316] hover:bg-[#ea6c0a] text-white font-bold px-7 py-3 rounded-xl transition text-sm">
            Ja, ik wil dit →
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="text-white/25 hover:text-white/50 text-sm transition"
          >
            Opnieuw proberen
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="py-4 max-w-md mx-auto">
      {/* Progress */}
      <div className="w-full bg-white/5 rounded-full h-0.5 mb-8">
        <div
          className="bg-[#f97316] h-0.5 rounded-full transition-all duration-300"
          style={{ width: `${Math.max(4, progress)}%` }}
        />
      </div>

      <p className="text-white/30 text-xs mb-3">Vraag {step + 1} van {steps.length}</p>
      <h3 className="text-xl font-bold mb-6 leading-snug">{current.question}</h3>

      <div className="flex flex-col gap-2 mb-6">
        {current.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => choose(i)}
            className={`text-left px-5 py-3.5 rounded-xl border transition text-sm font-medium ${
              selected === i
                ? 'border-[#f97316] bg-[#f97316]/10 text-white'
                : 'border-white/10 hover:border-white/25 text-white/60 hover:text-white'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <button
        onClick={next}
        disabled={selected === null}
        className="w-full bg-[#f97316] hover:bg-[#ea6c0a] disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition text-sm"
      >
        {step === steps.length - 1 ? 'Verstuur aanvraag →' : 'Volgende →'}
      </button>
    </div>
  )
}

const TABS: { id: Branch; label: string }[] = [
  { id: 'kozijnen', label: 'Kozijnen' },
  { id: 'badkamer', label: 'Badkamer' },
  { id: 'keuken', label: 'Keuken' },
]

export default function DemoPage() {
  const [branch, setBranch] = useState<Branch>('kozijnen')

  return (
    <div className="bg-[#07070f] text-white min-h-screen flex flex-col">

      {/* Header */}
      <div className="border-b border-white/[0.06] px-5 py-4 flex items-center justify-between">
        <Link href="/" className="hover:opacity-70 transition">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Vertero" className="h-7" />
        </Link>
        <span className="text-white/25 text-xs">Interactieve demo</span>
      </div>

      <div className="flex-1 flex flex-col items-center px-5 py-10">
        <div className="w-full max-w-lg">

          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold mb-2">Probeer het zelf, vul in als klant</h1>
            <p className="text-white/40 text-sm">Kies je branche en doorloop de quiz. Dan zie je wat jij als ondernemer ontvangt.</p>
          </div>

          {/* Branch tabs */}
          <div className="flex gap-1 bg-[#0d0d1c] border border-white/[0.08] rounded-xl p-1 mb-8">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setBranch(t.id)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                  branch === t.id
                    ? 'bg-[#f97316] text-white'
                    : 'text-white/35 hover:text-white/70'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <QuizFlow key={branch} branch={branch} />
        </div>
      </div>
    </div>
  )
}
