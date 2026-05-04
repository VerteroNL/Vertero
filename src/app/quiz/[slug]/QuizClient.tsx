'use client'

import { useState } from 'react'

interface Question {
  id: string
  question: string
  type: 'multiple' | 'text'
  options: string[]
  allowCustom?: boolean
  branches?: Record<number, string>
  defaultBranch?: string
}

interface ContactFieldConfig {
  key: string
  enabled: boolean
  required: boolean
}

interface Quiz {
  id: string
  name: string
  slug: string
  config: { questions: Question[]; brandColor?: string; contactFields?: ContactFieldConfig[] }
}

const DEFAULT_CONTACT_FIELDS: ContactFieldConfig[] = [
  { key: 'name',     enabled: true, required: true  },
  { key: 'email',    enabled: true, required: true  },
  { key: 'phone',    enabled: true, required: false },
  { key: 'street',   enabled: true, required: true  },
  { key: 'postcode', enabled: true, required: true  },
  { key: 'city',     enabled: true, required: true  },
]

const FIELD_LABELS: Record<string, string> = {
  name: 'Naam', email: 'E-mailadres', phone: 'Telefoon',
  street: 'Straat en huisnummer', postcode: 'Postcode', city: 'Woonplaats',
}

const FIELD_PLACEHOLDERS: Record<string, string> = {
  name: 'Jan Jansen', email: 'jan@bedrijf.nl', phone: '+31 6 12345678',
  street: 'Voorbeeldstraat 12', postcode: '1234 AB', city: 'Amsterdam',
}

const FIELD_TYPES: Record<string, string> = {
  name: 'text', email: 'email', phone: 'tel',
  street: 'text', postcode: 'text', city: 'text',
}

function resolveNext(q: Question, answer: string, questions: Question[]): number | 'contact' {
  const targetId = q.type === 'text'
    ? q.defaultBranch
    : q.branches?.[q.options.indexOf(answer)]
  if (targetId === '__contact__') return 'contact'
  if (targetId) {
    const idx = questions.findIndex(q2 => q2.id === targetId)
    if (idx !== -1) return idx
  }
  const cur = questions.findIndex(q2 => q2.id === q.id)
  return cur < questions.length - 1 ? cur + 1 : 'contact'
}

export default function QuizClient({ quiz, showPoweredBy = true }: { quiz: Quiz; showPoweredBy?: boolean }) {
  const brand = quiz.config?.brandColor || '#f97316'
  const activeFields = (quiz.config?.contactFields ?? DEFAULT_CONTACT_FIELDS).filter(f => f.enabled)
  const requiredKeys = activeFields.filter(f => f.required).map(f => f.key)

  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [history, setHistory] = useState<number[]>([0])
  const [stage, setStage] = useState<'quiz' | 'contact' | 'done'>('quiz')
  const [contact, setContact] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [contactError, setContactError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const questions = quiz.config?.questions || []
  const current = history[history.length - 1]
  const q = questions[current]

  function fieldError(key: string) {
    return touched[key] && requiredKeys.includes(key) && !contact[key]?.trim()
  }

  function emailError() {
    if (!touched.email) return null
    if (!contact.email?.trim()) return requiredKeys.includes('email') ? 'Vul je e-mailadres in' : null
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) return 'Vul een geldig e-mailadres in'
    return null
  }

  function handleNext() {
    const next = resolveNext(q, answers[q.id] || '', questions)
    if (next === 'contact') setStage('contact')
    else setHistory(h => [...h, next])
  }

  async function submit() {
    const allTouched = Object.fromEntries(activeFields.map(f => [f.key, true]))
    setTouched(p => ({ ...p, ...allTouched }))

    const missing: string[] = []
    for (const f of activeFields) {
      if (!f.required) continue
      if (f.key === 'email') {
        if (!contact.email?.trim()) missing.push('e-mailadres')
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) missing.push('geldig e-mailadres')
      } else if (!contact[f.key]?.trim()) {
        missing.push(FIELD_LABELS[f.key]?.toLowerCase() || f.key)
      }
    }

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
        slug: quiz.slug,
        name: contact.name || '',
        email: contact.email || '',
        phone: contact.phone || '',
        street: contact.street || '',
        postcode: contact.postcode || '',
        city: contact.city || '',
        answers
      })
    })
    setSubmitting(false)
    setStage('done')
  }

  if (stage === 'done') return (
    <div className="min-h-screen bg-[#07070f] flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">✓</div>
        <h2 className="text-2xl font-bold text-white mb-2">Bedankt!</h2>
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
          <h1 className="text-3xl font-bold text-white mb-2">Bijna klaar!</h1>
          <p className="text-white/40 text-sm">Laat je gegevens achter zodat we contact kunnen opnemen.</p>
        </div>

        <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-6 sm:p-8 mb-6 flex flex-col gap-4">
          {activeFields.map(f => (
            <div key={f.key}>
              <label className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2 block">
                {FIELD_LABELS[f.key] || f.key}
                {f.required
                  ? <span className="text-[#f97316] ml-1">*</span>
                  : <span className="text-white/20 normal-case font-normal ml-1">(optioneel)</span>
                }
              </label>
              <input
                type={FIELD_TYPES[f.key] || 'text'}
                value={contact[f.key] || ''}
                onChange={e => setContact(p => ({ ...p, [f.key]: e.target.value }))}
                onBlur={() => setTouched(p => ({ ...p, [f.key]: true }))}
                placeholder={FIELD_PLACEHOLDERS[f.key] || ''}
                className={`w-full bg-[#07070f] border rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none transition ${
                  (f.key === 'email' ? emailError() : fieldError(f.key))
                    ? 'border-red-500/60 focus:border-red-500'
                    : 'border-white/10 focus:border-[#f97316]/50'
                }`}
              />
              {f.key === 'email' && emailError() && <p className="text-red-400 text-xs mt-1.5">{emailError()}</p>}
              {f.key !== 'email' && fieldError(f.key) && <p className="text-red-400 text-xs mt-1.5">Vul dit veld in</p>}
            </div>
          ))}
        </div>

        {contactError && <p className="text-red-400 text-sm mb-4">{contactError}</p>}

        <div className="grid grid-cols-3 items-center">
          <button onClick={() => setStage('quiz')} className="text-white/40 hover:text-white text-sm transition justify-self-start">
            ← Terug
          </button>
          {showPoweredBy && <PoweredBy />}
          <button
            onClick={submit}
            disabled={submitting}
            className="justify-self-end disabled:opacity-30 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
            style={{ background: brand }}
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
          <h1 className="text-3xl font-bold text-white mb-1">{quiz.name}</h1>
          <p className="text-white/30 text-sm">{history.length} / {questions.length}</p>
        </div>

        <div className="w-full bg-white/5 rounded-full h-1 mb-8">
          <div className="h-1 rounded-full transition-all" style={{ width: `${(history.length / questions.length) * 100}%`, background: brand }} />
        </div>

        <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-6 sm:p-8 mb-6">
          <h2 className="text-white text-xl font-semibold mb-6">{q.question}</h2>

          {(q.type === 'multiple' || !q.type) && (
            <div className="flex flex-col gap-3">
              {q.options.map((opt, i) => (
                <button key={i} onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                  className="text-left px-4 py-3 rounded-xl border transition text-sm font-medium border-white/10 text-white/60 hover:border-white/20 hover:text-white"
                  style={answers[q.id] === opt ? { borderColor: brand, background: `${brand}1a`, color: '#fff' } : {}}>
                  {opt}
                </button>
              ))}
              {q.allowCustom && (
                <div className="rounded-xl border transition border-white/10"
                  style={answers[q.id] !== undefined && !q.options.includes(answers[q.id]) ? { borderColor: brand, background: `${brand}1a` } : {}}>
                  <button
                    onClick={() => setAnswers(prev => ({ ...prev, [q.id]: prev[q.id] !== undefined && !q.options.includes(prev[q.id]) ? prev[q.id] : '' }))}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-white/60 hover:text-white transition">
                    Anders, namelijk...
                  </button>
                  {answers[q.id] !== undefined && !q.options.includes(answers[q.id]) && (
                    <input type="text" autoFocus value={answers[q.id]}
                      onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                      placeholder="Typ je antwoord..."
                      className="w-full bg-transparent border-t border-white/10 px-4 py-3 text-sm text-white placeholder-white/30 outline-none" />
                  )}
                </div>
              )}
            </div>
          )}

          {q.type === 'text' && (
            <textarea value={answers[q.id] || ''}
              onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
              placeholder="Typ je antwoord..." rows={4}
              className="w-full bg-[#07070f] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none transition resize-none" />
          )}
        </div>

        <div className="grid grid-cols-3 items-center">
          {history.length > 1 ? (
            <button onClick={() => setHistory(h => h.slice(0, -1))} className="text-white/40 hover:text-white text-sm transition justify-self-start">
              ← Vorige
            </button>
          ) : <div />}
          {showPoweredBy && <PoweredBy />}
          <button onClick={handleNext} disabled={!answers[q.id]}
            className="justify-self-end disabled:opacity-30 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
            style={{ background: brand }}>
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
