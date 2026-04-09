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

export default function PublicQuizPage({ params }: { params: Promise<{ slug: string }> }) {
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
      body: JSON.stringify({
        slug,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        street: contact.street,
        postcode: contact.postcode,
        city: contact.city,
        answers
      })
    })
    setSubmitting(false)
    setStage('done')
  }

  if (notFound) return (
    <div className="min-h-screen bg-[#07070f] flex items-center justify-center text-white/40">
      Quiz niet gevonden.
    </div>
  )

  if (!quiz) return (
    <div className="min-h-screen bg-[#07070f] flex items-center justify-center text-white/40">
      Laden...
    </div>
  )

  const questions = quiz.config?.questions || []
  const q = questions[current]

  if (stage === 'done') return (
    <div className="min-h-screen bg-[#07070f] flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">✓</div>
        <h2 className="font-serif text-2xl italic text-white mb-2">Bedankt!</h2>
        <p className="text-white/40 text-sm">Je antwoorden zijn ontvangen.</p>
      </div>
      <PoweredBy />
    </div>
  )

  if (questions.length === 0) return (
    <div className="min-h-screen bg-[#07070f] flex items-center justify-center text-white/40">
      Deze quiz heeft nog geen vragen.
    </div>
  )

  if (stage === 'contact') return (
    <div className="min-h-screen bg-[#07070f] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl italic text-white mb-2">Bijna klaar!</h1>
          <p className="text-white/40 text-sm">Laat je gegevens achter zodat we contact kunnen opnemen.</p>
        </div>

        <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-8 mb-6 flex flex-col gap-4">
          <div>
            <label className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2 block">Naam</label>
            <input
              type="text"
              value={contact.name}
              onChange={e => setContact(p => ({ ...p, name: e.target.value }))}
              placeholder="Jan Jansen"
              className="w-full bg-[#07070f] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-[#6c5ce7]/50 transition"
            />
          </div>
          <div>
            <label className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2 block">Straat en huisnummer</label>
            <input
              type="text"
              value={contact.street}
              onChange={e => setContact(p => ({ ...p, street: e.target.value }))}
              placeholder="Voorbeeldstraat 12"
              className="w-full bg-[#07070f] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-[#6c5ce7]/50 transition"
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
                className="w-full bg-[#07070f] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-[#6c5ce7]/50 transition"
              />
            </div>
            <div>
              <label className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2 block">Woonplaats</label>
              <input
                type="text"
                value={contact.city}
                onChange={e => setContact(p => ({ ...p, city: e.target.value }))}
                placeholder="Amsterdam"
                className="w-full bg-[#07070f] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-[#6c5ce7]/50 transition"
              />
            </div>
          </div>
          <div>
            <label className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2 block">E-mail</label>
            <input
              type="email"
              value={contact.email}
              onChange={e => setContact(p => ({ ...p, email: e.target.value }))}
              placeholder="jan@bedrijf.nl"
              className="w-full bg-[#07070f] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-[#6c5ce7]/50 transition"
            />
          </div>
          <div>
            <label className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2 block">Telefoon <span className="text-white/20 normal-case font-normal">(optioneel)</span></label>
            <input
              type="tel"
              value={contact.phone}
              onChange={e => setContact(p => ({ ...p, phone: e.target.value }))}
              placeholder="+31 6 12345678"
              className="w-full bg-[#07070f] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-[#6c5ce7]/50 transition"
            />
          </div>
        </div>

        {contactError && (
          <p className="text-red-400 text-sm mb-4">{contactError}</p>
        )}

        <div className="flex justify-between">
          <button
            onClick={() => setStage('quiz')}
            className="text-white/40 hover:text-white text-sm transition"
          >
            ← Terug
          </button>
          <button
            onClick={submit}
            disabled={submitting}
            className="bg-[#6c5ce7] hover:bg-[#7d6ef5] disabled:opacity-30 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
          >
            {submitting ? 'Versturen...' : 'Versturen →'}
          </button>
        </div>
      </div>
      <PoweredBy />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#07070f] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl italic text-white mb-1">{quiz.name}</h1>
          <p className="text-white/30 text-sm">{current + 1} / {questions.length}</p>
        </div>

        <div className="w-full bg-white/5 rounded-full h-1 mb-8">
          <div
            className="bg-[#6c5ce7] h-1 rounded-full transition-all"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-8 mb-6">
          <h2 className="text-white text-xl font-semibold mb-6">{q.question}</h2>

          {q.type === 'multiple' && (
            <div className="flex flex-col gap-3">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                  className={`text-left px-4 py-3 rounded-xl border transition text-sm font-medium ${
                    answers[q.id] === opt
                      ? 'border-[#6c5ce7] bg-[#6c5ce7]/10 text-white'
                      : 'border-white/10 text-white/60 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {q.type === 'text' && (
            <textarea
              value={answers[q.id] || ''}
              onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
              placeholder="Typ je antwoord..."
              rows={4}
              className="w-full bg-[#07070f] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-[#6c5ce7]/50 transition resize-none"
            />
          )}
        </div>

        <div className="flex justify-between items-center">
          {current > 0 ? (
            <button
              onClick={() => setCurrent(c => c - 1)}
              className="text-white/40 hover:text-white text-sm transition"
            >
              ← Vorige
            </button>
          ) : <div />}

          <PoweredBy />

          {current < questions.length - 1 ? (
            <button
              onClick={() => setCurrent(c => c + 1)}
              disabled={!answers[q.id]}
              className="bg-[#6c5ce7] hover:bg-[#7d6ef5] disabled:opacity-30 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
            >
              Volgende →
            </button>
          ) : (
            <button
              onClick={() => setStage('contact')}
              disabled={!answers[q.id]}
              className="bg-[#6c5ce7] hover:bg-[#7d6ef5] disabled:opacity-30 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
            >
              Volgende →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function PoweredBy() {
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="text-white/25 text-[11px] font-medium tracking-wide">Powered by</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="Vertero" className="h-[11px] opacity-40" />
    </div>
  )
}