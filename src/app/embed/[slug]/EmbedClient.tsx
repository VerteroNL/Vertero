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
  placeholder?: string
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
  config: { questions: Question[]; brandColor?: string; contactFields?: ContactFieldConfig[]; theme?: 'dark' | 'light' }
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
  name: 'Jan Jansen', email: 'naam@voorbeeld.com', phone: '+31 6 12345678',
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

export default function EmbedClient({ quiz, showPoweredBy = true }: { quiz: Quiz; showPoweredBy?: boolean }) {
  const brand = quiz.config?.brandColor || '#f97316'
  const isLight = quiz.config?.theme === 'light'
  const c = isLight ? {
    card: 'bg-white border-black/[0.06]',
    title: 'text-gray-900',
    sub: 'text-gray-400',
    counter: 'text-gray-300',
    opt: 'border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-900',
    input: 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-300',
    progress: 'bg-black/5',
    back: 'text-gray-400 hover:text-gray-900',
    label: 'text-gray-400',
    border: 'border-gray-100',
  } : {
    card: 'bg-[#07070f] border-white/10',
    title: 'text-white',
    sub: 'text-white/40',
    counter: 'text-white/30',
    opt: 'border-white/10 text-white/60 hover:border-white/20 hover:text-white',
    input: 'bg-[#0d0d1c] border-white/10 text-white placeholder-white/20',
    progress: 'bg-white/5',
    back: 'text-white/40 hover:text-white',
    label: 'text-white/40',
    border: 'border-white/5',
  }
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
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6">
      <div className={`w-full max-w-[480px] ${c.card} rounded-[20px] border overflow-hidden`}>
        <div className="p-8 text-center">
          <div className="text-4xl mb-4">✓</div>
          <h2 className={`text-2xl font-bold ${c.title} mb-2`}>Bedankt!</h2>
          <p className={`${c.sub} text-sm`}>Je antwoorden zijn ontvangen.</p>
        </div>
        {showPoweredBy && <PoweredBy isLight={isLight} borderClass={c.border} />}
      </div>
    </div>
  )

  if (stage === 'contact') return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4 sm:p-6">
      <div className={`w-full max-w-[480px] ${c.card} rounded-[20px] border overflow-hidden`}>
        <div className="p-6 sm:p-8">
          <h2 className={`${c.title} text-lg font-semibold mb-1`}>Bijna klaar!</h2>
          <p className={`${c.sub} text-sm mb-6`}>Laat je gegevens achter zodat we contact kunnen opnemen.</p>
          <div className="flex flex-col gap-4 mb-6">
            {activeFields.map(f => (
              <div key={f.key}>
                <label className={`${c.label} text-xs font-semibold uppercase tracking-widest mb-2 block`}>
                  {FIELD_LABELS[f.key] || f.key}
                  {f.required
                    ? <span className="text-[#f97316] ml-1">*</span>
                    : <span className={`${isLight ? 'text-gray-300' : 'text-white/20'} normal-case font-normal ml-1`}>(optioneel)</span>
                  }
                </label>
                <input
                  type={FIELD_TYPES[f.key] || 'text'}
                  value={contact[f.key] || ''}
                  onChange={e => setContact(p => ({ ...p, [f.key]: e.target.value }))}
                  onBlur={() => setTouched(p => ({ ...p, [f.key]: true }))}
                  placeholder={FIELD_PLACEHOLDERS[f.key] || ''}
                  className={`w-full border rounded-xl px-4 py-3 outline-none transition text-sm ${c.input} ${
                    (f.key === 'email' ? emailError() : fieldError(f.key))
                      ? 'border-red-400 focus:border-red-500'
                      : ''
                  }`}
                />
                {f.key === 'email' && emailError() && <p className="text-red-400 text-xs mt-1.5">{emailError()}</p>}
                {f.key !== 'email' && fieldError(f.key) && <p className="text-red-400 text-xs mt-1.5">Vul dit veld in</p>}
              </div>
            ))}
          </div>
          {contactError && <p className="text-red-400 text-xs mb-4">{contactError}</p>}
          <div className="grid grid-cols-3 items-center">
            <button onClick={() => setStage('quiz')} className={`${c.back} text-sm transition justify-self-start`}>
              ← Terug
            </button>
            {showPoweredBy && <PoweredBy isLight={isLight} />}
            <button onClick={submit} disabled={submitting}
              className="justify-self-end disabled:opacity-30 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
              style={{ background: brand }}>
              {submitting ? 'Versturen...' : 'Versturen →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4 sm:p-6">
      <div className={`w-full max-w-[480px] ${c.card} rounded-[20px] border overflow-hidden`}>
        <div className="p-6 sm:p-8">
          <p className={`${c.counter} text-xs font-mono mb-2`}>{history.length} / {questions.length}</p>
          <div className={`w-full ${c.progress} rounded-full h-[3px] mb-6`}>
            <div className="h-[3px] rounded-full transition-all"
              style={{ width: `${(history.length / questions.length) * 100}%`, background: brand }} />
          </div>

          <h2 className={`${c.title} text-lg font-semibold mb-5 leading-snug`}>{q.question}</h2>

          <div className="flex flex-col gap-3 mb-6">
            {(q.type === 'multiple' || !q.type) && (
              <>
                {q.options.map((opt, i) => (
                  <button key={i} onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                    className={`text-left px-4 py-3 rounded-xl border transition text-sm font-medium ${c.opt}`}
                    style={answers[q.id] === opt ? { borderColor: `${brand}99`, background: `${brand}18`, color: isLight ? '#111' : '#fff' } : {}}>
                    {opt}
                  </button>
                ))}
                {q.allowCustom && (() => {
                  const isCustomSelected = answers[q.id] !== undefined && !q.options.includes(answers[q.id])
                  return (
                    <div>
                      <button
                        onClick={() => setAnswers(prev => ({ ...prev, [q.id]: isCustomSelected ? prev[q.id] : '' }))}
                        className={`w-full text-left px-4 py-3 rounded-xl border transition text-sm font-medium ${c.opt}`}
                        style={isCustomSelected ? { borderColor: `${brand}99`, background: `${brand}18`, color: isLight ? '#111' : '#fff' } : {}}>
                        Anders, namelijk...
                      </button>
                      {isCustomSelected && (
                        <input type="text" autoFocus value={answers[q.id]}
                          onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                          placeholder="Typ je antwoord..."
                          className={`w-full mt-2 border rounded-xl px-4 py-3 text-sm outline-none transition ${c.input}`} />
                      )}
                    </div>
                  )
                })()}
              </>
            )}
            {q.type === 'text' && (
              <textarea value={answers[q.id] || ''}
                onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                placeholder={q.placeholder || 'Typ je antwoord...'} rows={3}
                className={`w-full border rounded-xl px-4 py-3 outline-none transition resize-none text-sm ${c.input}`} />
            )}
          </div>

          <div className="grid grid-cols-3 items-center">
            {history.length > 1 ? (
              <button onClick={() => setHistory(h => h.slice(0, -1))} className={`${c.back} text-sm transition justify-self-start`}>
                ← Vorige
              </button>
            ) : <div />}
            {showPoweredBy && <PoweredBy isLight={isLight} />}
            <button onClick={handleNext} disabled={!answers[q.id]}
              className="justify-self-end disabled:opacity-30 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
              style={{ background: brand }}>
              Volgende →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PoweredBy({ isLight = false, borderClass = '' }: { isLight?: boolean; borderClass?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 py-3 border-t ${borderClass || (isLight ? 'border-gray-100' : 'border-white/5')}`}>
      <span className={`${isLight ? 'text-gray-300' : 'text-white/25'} text-[11px] font-medium tracking-wide`}>Powered by</span>
      <a href="https://vertero.nl" target="_blank" rel="noopener noreferrer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Vertero" className={`h-[11px] ${isLight ? 'opacity-25' : 'opacity-40'}`} />
      </a>
    </div>
  )
}
