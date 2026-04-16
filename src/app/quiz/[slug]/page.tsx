'use client'

import { useState, useEffect, use } from 'react'

interface Question {
  id: string
  question: string
  type: 'multiple' | 'text'
  options: string[]
  allowCustom?: boolean
}

interface Quiz {
  id: string
  name: string
  slug: string
  config: { questions: Question[] }
}

const REQUIRED_FIELDS = ['name', 'email', 'street', 'postcode', 'city'] as const
type ContactField = typeof REQUIRED_FIELDS[number] | 'phone'

export default function PublicQuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [current, setCurrent] = useState(0)
  const [stage, setStage] = useState<'quiz' | 'contact' | 'done'>('quiz')
  const [notFound, setNotFound] = useState(false)
  const [contact, setContact] = useState({ name: '', email: '', phone: '', street: '', postcode: '', city: '' })
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({})
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

  function touchField(field: ContactField) {
    setTouched(p => ({ ...p, [field]: true }))
  }

  function fieldError(field: typeof REQUIRED_FIELDS[number]) {
    return touched[field] && !contact[field].trim()
  }

  function emailError() {
    if (!touched.email) return null
    if (!contact.email.trim()) return 'Vul je e-mailadres in'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) return 'Vul een geldig e-mailadres in'
    return null
  }

  async function submit() {
    // Touch all required fields to show errors
    const allTouched = Object.fromEntries(REQUIRED_FIELDS.map(f => [f, true]))
    setTouched(p => ({ ...p, ...allTouched }))

    const missing: string[] = []
    if (!contact.name.trim()) missing.push('naam')
    if (!contact.email.trim()) missing.push('e-mailadres')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) missing.push('geldig e-mailadres')
    if (!contact.street.trim()) missing.push('straat en huisnummer')
    if (!contact.postcode.trim()) missing.push('postcode')
    if (!contact.city.trim()) missing.push('woonplaats')

    if (missing.length > 0) {
      setContactError(`Vul alsjeblieft in: ${missing.join(', ')}.`)
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
    <div className="min-h-screen bg-[#07070f] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl italic text-white mb-2">Bijna klaar!</h1>
          <p className="text-white/40 text-sm">Laat je gegevens achter zodat we contact kunnen opnemen.</p>
        </div>

        <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-6 sm:p-8 mb-6 flex flex-col gap-4">
          <div>
            <label className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2 block">
              Naam <span className="text-[#f97316]">*</span>
            </label>
            <input
              type="text"
              value={contact.name}
              onChange={e => setContact(p => ({ ...p, name: e.target.value }))}
              onBlur={() => touchField('name')}
              placeholder="Jan Jansen"
              className={`w-full bg-[#07070f] border rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none transition ${fieldError('name') ? 'border-red-500/60 focus:border-red-500' : 'border-white/10 focus:border-[#f97316]/50'}`}
            />
            {fieldError('name') && <p className="text-red-400 text-xs mt-1.5">Vul je naam in</p>}
          </div>
          <div>
            <label className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2 block">
              Straat en huisnummer <span className="text-[#f97316]">*</span>
            </label>
            <input
              type="text"
              value={contact.street}
              onChange={e => setContact(p => ({ ...p, street: e.target.value }))}
              onBlur={() => touchField('street')}
              placeholder="Voorbeeldstraat 12"
              className={`w-full bg-[#07070f] border rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none transition ${fieldError('street') ? 'border-red-500/60 focus:border-red-500' : 'border-white/10 focus:border-[#f97316]/50'}`}
            />
            {fieldError('street') && <p className="text-red-400 text-xs mt-1.5">Vul je straat en huisnummer in</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2 block">
                Postcode <span className="text-[#f97316]">*</span>
              </label>
              <input
                type="text"
                value={contact.postcode}
                onChange={e => setContact(p => ({ ...p, postcode: e.target.value }))}
                onBlur={() => touchField('postcode')}
                placeholder="1234 AB"
                className={`w-full bg-[#07070f] border rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none transition ${fieldError('postcode') ? 'border-red-500/60 focus:border-red-500' : 'border-white/10 focus:border-[#f97316]/50'}`}
              />
              {fieldError('postcode') && <p className="text-red-400 text-xs mt-1.5">Vul je postcode in</p>}
            </div>
            <div>
              <label className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2 block">
                Woonplaats <span className="text-[#f97316]">*</span>
              </label>
              <input
                type="text"
                value={contact.city}
                onChange={e => setContact(p => ({ ...p, city: e.target.value }))}
                onBlur={() => touchField('city')}
                placeholder="Amsterdam"
                className={`w-full bg-[#07070f] border rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none transition ${fieldError('city') ? 'border-red-500/60 focus:border-red-500' : 'border-white/10 focus:border-[#f97316]/50'}`}
              />
              {fieldError('city') && <p className="text-red-400 text-xs mt-1.5">Vul je woonplaats in</p>}
            </div>
          </div>
          <div>
            <label className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2 block">
              E-mail <span className="text-[#f97316]">*</span>
            </label>
            <input
              type="email"
              value={contact.email}
              onChange={e => setContact(p => ({ ...p, email: e.target.value }))}
              onBlur={() => touchField('email')}
              placeholder="jan@bedrijf.nl"
              className={`w-full bg-[#07070f] border rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none transition ${emailError() ? 'border-red-500/60 focus:border-red-500' : 'border-white/10 focus:border-[#f97316]/50'}`}
            />
            {emailError() && <p className="text-red-400 text-xs mt-1.5">{emailError()}</p>}
          </div>
          <div>
            <label className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2 block">Telefoon <span className="text-white/20 normal-case font-normal">(optioneel)</span></label>
            <input
              type="tel"
              value={contact.phone}
              onChange={e => setContact(p => ({ ...p, phone: e.target.value }))}
              placeholder="+31 6 12345678"
              className="w-full bg-[#07070f] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-[#f97316]/50 transition"
            />
          </div>
        </div>

        {contactError && (
          <p className="text-red-400 text-sm mb-4">{contactError}</p>
        )}

        <div className="grid grid-cols-3 items-center">
          <button
            onClick={() => setStage('quiz')}
            className="text-white/40 hover:text-white text-sm transition justify-self-start"
          >
            ← Terug
          </button>
          <PoweredBy />
          <button
            onClick={submit}
            disabled={submitting}
            className="justify-self-end bg-[#f97316] hover:bg-[#ea6c0a] disabled:opacity-30 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
          >
            {submitting ? 'Versturen...' : 'Versturen →'}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#07070f] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl italic text-white mb-1">{quiz.name}</h1>
          <p className="text-white/30 text-sm">{current + 1} / {questions.length}</p>
        </div>

        <div className="w-full bg-white/5 rounded-full h-1 mb-8">
          <div
            className="bg-[#f97316] h-1 rounded-full transition-all"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-6 sm:p-8 mb-6">
          <h2 className="text-white text-xl font-semibold mb-6">{q.question}</h2>

          {q.type === 'multiple' && (
            <div className="flex flex-col gap-3">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                  className={`text-left px-4 py-3 rounded-xl border transition text-sm font-medium ${
                    answers[q.id] === opt
                      ? 'border-[#f97316] bg-[#f97316]/10 text-white'
                      : 'border-white/10 text-white/60 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {opt}
                </button>
              ))}
              {q.allowCustom && (
                <div
                  className={`rounded-xl border transition ${
                    answers[q.id] !== undefined && !q.options.includes(answers[q.id])
                      ? 'border-[#f97316] bg-[#f97316]/10'
                      : 'border-white/10'
                  }`}
                >
                  <button
                    onClick={() => setAnswers(prev => ({ ...prev, [q.id]: prev[q.id] !== undefined && !q.options.includes(prev[q.id]) ? prev[q.id] : '' }))}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-white/60 hover:text-white transition"
                  >
                    Anders, namelijk...
                  </button>
                  {answers[q.id] !== undefined && !q.options.includes(answers[q.id]) && (
                    <input
                      type="text"
                      autoFocus
                      value={answers[q.id]}
                      onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                      placeholder="Typ je antwoord..."
                      className="w-full bg-transparent border-t border-[#f97316]/20 px-4 py-3 text-sm text-white placeholder-white/30 outline-none"
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {q.type === 'text' && (
            <textarea
              value={answers[q.id] || ''}
              onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
              placeholder="Typ je antwoord..."
              rows={4}
              className="w-full bg-[#07070f] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-[#f97316]/50 transition resize-none"
            />
          )}
        </div>

        <div className="grid grid-cols-3 items-center">
          {current > 0 ? (
            <button
              onClick={() => setCurrent(c => c - 1)}
              className="text-white/40 hover:text-white text-sm transition justify-self-start"
            >
              ← Vorige
            </button>
          ) : <div />}

          <PoweredBy />

          <button
            onClick={() => {
              if (current < questions.length - 1) {
                setCurrent(c => c + 1)
              } else {
                setStage('contact')
              }
            }}
            disabled={!answers[q.id]}
            className="justify-self-end bg-[#f97316] hover:bg-[#ea6c0a] disabled:opacity-30 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
          >
            Volgende →
          </button>
        </div>
      </div>
    </div>
  )
}

function PoweredBy() {
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="text-white/25 text-[11px] font-medium tracking-wide">Powered by</span>
      <a href="https://vertero.nl" target="_blank" rel="noopener noreferrer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Vertero" className="h-[11px] opacity-40" />
      </a>
    </div>
  )
}
