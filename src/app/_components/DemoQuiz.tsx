'use client'

import { useState } from 'react'
import Link from 'next/link'

const QUESTIONS = [
  {
    id: 'q1',
    question: 'Wat wil je laten doen?',
    options: ['Badkamer verbouwen', 'Keuken plaatsen', 'Uitbouw plaatsen', 'Iets anders'],
  },
  {
    id: 'q2',
    question: 'Wat is je globale budget?',
    options: ['Onder €5.000', '€5.000 – €15.000', '€15.000 – €30.000', 'Meer dan €30.000'],
  },
  {
    id: 'q3',
    question: 'Wanneer wil je starten?',
    options: ['Zo snel mogelijk', 'Binnen 3 maanden', 'Geen haast'],
  },
]

export default function DemoQuiz() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)

  const q = QUESTIONS[step]
  const selected = answers[q?.id]
  const progress = (step + 1) / QUESTIONS.length

  function pick(opt: string) {
    setAnswers(a => ({ ...a, [q.id]: opt }))
  }

  function next() {
    if (step < QUESTIONS.length - 1) setStep(s => s + 1)
    else setDone(true)
  }

  function reset() {
    setStep(0)
    setAnswers({})
    setDone(false)
  }

  if (done) return (
    <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-8 flex flex-col gap-5">
      <div>
        <p className="text-white/30 text-xs font-medium mb-1">Zo ontvang jij je leads</p>
        <h3 className="text-white font-bold text-lg">Laat je gegevens achter</h3>
      </div>
      <div className="flex flex-col gap-3">
        <div>
          <label className="text-white/40 text-xs font-semibold uppercase tracking-widest block mb-1.5">Naam</label>
          <div className="bg-[#07070f] border border-white/10 rounded-xl px-4 py-3 text-white/20 text-sm">Jan Jansen</div>
        </div>
        <div>
          <label className="text-white/40 text-xs font-semibold uppercase tracking-widest block mb-1.5">E-mailadres</label>
          <div className="bg-[#07070f] border border-white/10 rounded-xl px-4 py-3 text-white/20 text-sm">naam@voorbeeld.com</div>
        </div>
      </div>
      <Link href="/probeer"
        className="block text-center bg-[#f97316] hover:bg-[#ea6c0a] text-white font-semibold text-sm py-3 rounded-xl transition">
        Maak jouw quiz gratis →
      </Link>
      <button onClick={reset} className="text-white/25 text-xs hover:text-white/50 transition text-center">
        Opnieuw proberen
      </button>
    </div>
  )

  return (
    <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-white/30 text-xs font-medium">Voorbeeld quiz</p>
        <p className="text-white/25 text-xs">Stap {step + 1} van {QUESTIONS.length}</p>
      </div>

      <div className="w-full bg-white/5 rounded-full h-[3px]">
        <div className="bg-[#f97316] h-[3px] rounded-full transition-all duration-300"
          style={{ width: `${progress * 100}%` }} />
      </div>

      <h3 className="text-white font-bold text-lg leading-snug">{q.question}</h3>

      <div className="flex flex-col gap-2.5">
        {q.options.map((opt) => (
          <button key={opt} onClick={() => pick(opt)}
            className="text-left px-4 py-3 rounded-xl border text-sm font-medium transition"
            style={selected === opt
              ? { borderColor: '#f9731699', background: '#f9731618', color: '#fff' }
              : { borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
            {opt}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        {step > 0
          ? <button onClick={() => setStep(s => s - 1)} className="text-white/40 hover:text-white text-sm transition">← Vorige</button>
          : <div />}
        <button onClick={next} disabled={!selected}
          className="bg-[#f97316] hover:bg-[#ea6c0a] disabled:opacity-30 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition">
          {step < QUESTIONS.length - 1 ? 'Volgende →' : 'Versturen →'}
        </button>
      </div>
    </div>
  )
}
