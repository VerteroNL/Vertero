'use client'

import { useState, useEffect, use } from 'react'

interface Question {
  id: string
  question: string
  type: 'multiple' | 'text'
  options: string[]
}

interface Quiz {
  id: string
  name: string
  slug: string
  config: { questions: Question[] }
}

export default function EmbedQuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [current, setCurrent] = useState(0)
  const [stage, setStage] = useState<'quiz' | 'contact' | 'done'>('quiz')
  const [notFound, setNotFound] = useState(false)
  const [contact, setContact] = useState({ name: '', email: '', phone: '', street: '', postcode: '', city: '' })
  const [contactError, setContactError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch(`/api/quiz-public/${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setNotFound(true)
        else setQuiz(data)
      })
  }, [slug])

  async function submit() {
    const missing: string[] = []
    if (!contact.name.trim()) missing.push('naam')
    if (!contact.email.trim()) missing.push('e-mailadres')
    if (!contact.street.trim()) missing.push('straat en huisnummer')
    if (!contact.postcode.trim()) missing.push('postcode')
    if (!contact.city.trim()) missing.push('woonplaats')

    if (missing.length > 0) {
      setContactError(`Vul alsjeblieft de volgende verplichte velden in: ${missing.join(', ')}.`)
      return
    }

    setContactError(null)
    setSubmitting(true)
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, name: contact.name, email: contact.email, phone: contact.phone, street: contact.street, postcode: contact.postcode, city: contact.city, answers })
    })
    setSubmitting(false)
    setStage('done')
  }

  if (notFound) return (
    <div className="min-h-screen bg-transparent flex items-center justify-center">
      <div className="w-full max-w-[480px] bg-[#07070f] rounded-[20px] border border-white/10 overflow-hidden">
        <div className="p-8 text-white/40 text-sm">Quiz niet gevonden.</div>
        <PoweredBy />
      </div>
    </div>
  )

  if (!quiz) return (
    <div className="min-h-screen bg-transparent flex items-center justify-center">
      <div className="w-full max-w-[480px] bg-[#07070f] rounded-[20px] border border-white/10 overflow-hidden">
        <div className="p-8 text-white/40 text-sm">Laden...</div>
        <PoweredBy />
      </div>
    </div>
  )

  const questions = quiz.config?.questions || []
  const q = questions[current]

  if (stage === 'done') return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6">
      <div className="w-full max-w-[480px] bg-[#07070f] rounded-[20px] border border-white/10 overflow-hidden">
        <div className="p-8 text-center">
          <div className="text-4xl mb-4">✓</div>
          <h2 className="font-serif text-2xl italic text-white mb-2">Bedankt!</h2>
          <p className="text-white/40 text-sm">Je antwoorden zijn ontvangen.</p>
        </div>
        <PoweredBy />
      </div>
    </div>
  )

  if (stage === 'contact') return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6">
      <div className="w-full max-w-[480px] bg-[#07070f] rounded-[20px] border border-white/10 overflow-hidden">
        <div className="p-8">
          <h2 className="text-white text-lg font-semibold mb-1">Bijna klaar!</h2>
          <p className="text-white/40 text-sm mb-6">Laat je gegevens achter zodat we contact kunnen opnemen.</p>
          <div className="flex flex-col gap-4 mb-6">
            <div>
              <label className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2 block">Naam</label>
              <input
                type="text"
                value={contact.name}
                onChange={e => setContact(p => ({ ...p, name: e.target.value }))}
                placeholder="Jan Jansen"
                className="w-full bg-[#0d0d1c] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-[#6c5ce7]/50 transition text-sm"
              />
            </div>
            <div>
              <label className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2 block">Straat en huisnummer</label>
              <input
                type="text"
                value={contact.street}
                onChange={e => setContact(p => ({ ...p, street: e.target.value }))}
                placeholder="Voorbeeldstraat 12"
                className="w-full bg-[#0d0d1c] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-[#6c5ce7]/50 transition text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2 block">Postcode</label>
                <input
                  type="text"
                  value={contact.postcode}
                  onChange={e => setContact(p => ({ ...p, postcode: e.target.value }))}
                  placeholder="1234 AB"
                  className="w-full bg-[#0d0d1c] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-[#6c5ce7]/50 transition text-sm"
                />
              </div>
              <div>
                <label className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2 block">Woonplaats</label>
                <input
                  type="text"
                  value={contact.city}
                  onChange={e => setContact(p => ({ ...p, city: e.target.value }))}
                  placeholder="Amsterdam"
                  className="w-full bg-[#0d0d1c] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-[#6c5ce7]/50 transition text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2 block">E-mail</label>
              <input
                type="email"
                value={contact.email}
                onChange={e => setContact(p => ({ ...p, email: e.target.value }))}
                placeholder="naam@voorbeeld.com"
                className="w-full bg-[#0d0d1c] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-[#6c5ce7]/50 transition text-sm"
              />
            </div>
            <div>
              <label className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2 block">Telefoon <span className="text-white/20 normal-case font-normal">(optioneel)</span></label>
              <input
                type="tel"
                value={contact.phone}
                onChange={e => setContact(p => ({ ...p, phone: e.target.value }))}
                placeholder="+31 6 12345678"
                className="w-full bg-[#0d0d1c] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-[#6c5ce7]/50 transition text-sm"
              />
            </div>
          </div>
          {contactError && (
            <p className="text-red-400 text-xs mb-4">{contactError}</p>
          )}
          <div className="grid grid-cols-3 items-center">
            <button onClick={() => setStage('quiz')} className="text-white/40 hover:text-white text-sm transition justify-self-start">
              ← Terug
            </button>
            <PoweredBy />
            <button
              onClick={submit}
              disabled={submitting}
              className="justify-self-end bg-[#6c5ce7] hover:bg-[#7d6ef5] disabled:opacity-30 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
            >
              {submitting ? 'Versturen...' : 'Versturen →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6">
      <div className="w-full max-w-[480px] bg-[#07070f] rounded-[20px] border border-white/10 overflow-hidden">
        <div className="p-8">
          <p className="text-white/30 text-xs font-mono mb-2">{current + 1} / {questions.length}</p>
          <div className="w-full bg-white/5 rounded-full h-[3px] mb-6">
            <div
              className="bg-[#6c5ce7] h-[3px] rounded-full transition-all"
              style={{ width: `${((current + 1) / questions.length) * 100}%` }}
            />
          </div>

          <h2 className="text-white text-lg font-semibold mb-5 leading-snug">{q.question}</h2>

          <div className="flex flex-col gap-3 mb-6">
            {q.type === 'multiple' && q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                className={`text-left px-4 py-3 rounded-xl border transition text-sm font-medium ${
                  answers[q.id] === opt
                    ? 'border-[#6c5ce7] bg-[#6c5ce7]/15 text-white'
                    : 'border-white/10 text-white/60 hover:border-white/20 hover:text-white'
                }`}
              >
                {opt}
              </button>
            ))}

            {q.type === 'text' && (
              <textarea
                value={answers[q.id] || ''}
                onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                placeholder="Typ je antwoord..."
                rows={3}
                className="w-full bg-[#0d0d1c] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-[#6c5ce7]/50 transition resize-none text-sm"
              />
            )}
          </div>

          <div className="grid grid-cols-3 items-center">
            {current > 0 ? (
              <button onClick={() => setCurrent(c => c - 1)} className="text-white/40 hover:text-white text-sm transition justify-self-start">
                ← Vorige
              </button>
            ) : <div />}

            <PoweredBy />

            {current < questions.length - 1 ? (
              <button
                onClick={() => setCurrent(c => c + 1)}
                disabled={!answers[q.id]}
                className="justify-self-end bg-[#6c5ce7] hover:bg-[#7d6ef5] disabled:opacity-30 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
              >
                Volgende →
              </button>
            ) : (
              <button
                onClick={() => setStage('contact')}
                disabled={!answers[q.id]}
                className="justify-self-end bg-[#6c5ce7] hover:bg-[#7d6ef5] disabled:opacity-30 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
              >
                Volgende →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function PoweredBy() {
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="text-white/25 text-[11px] font-medium tracking-wide">Powered by</span>
      <a href="https://vertero.app" target="_blank" rel="noopener noreferrer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Vertero" className="h-[11px] opacity-40" />
      </a>
    </div>
  )
}